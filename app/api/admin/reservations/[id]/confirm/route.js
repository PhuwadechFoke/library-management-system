import db from "@/lib/db";
import { NextResponse } from "next/server";
import { sendReservationReadyNotification } from "@/lib/borrow-reminders";
import { createNotification } from "@/lib/notifications";

export async function POST(request, { params: { id } }) {
  try {
    const { approverId } = await request.json();

    const reservation = await db.reservation.findUnique({
      where: { id },
      include: {
        book: true,
        user: { include: { user: { select: { id: true, email: true } } } },
      },
    });

    if (!reservation) {
      return NextResponse.json({ message: "ไม่พบรายการจองนี้" }, { status: 404 });
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + reservation.numberOfDays);

    const result = await db.$transaction(async (tx) => {
      // สร้างรายการยืมจริง
      const borrow = await tx.borrow.create({
        data: {
          bookId: reservation.bookId,
          borrowerId: reservation.userId,
          approverId,
          borrowDate,
          dueDate,
          numberOfDays: reservation.numberOfDays,
        },
      });

      // ลบรายการจองทิ้ง (จองสำเร็จแล้ว กลายเป็นการยืมจริง)
      await tx.reservation.delete({ where: { id } });

      // บันทึกกิจกรรม
      await tx.activity.create({
        data: {
          type: "CREATE_BORROW",
          userProfileId: approverId,
          bookId: reservation.bookId,
        },
      });

      return borrow;
    });

    // ส่ง in-app notification ให้ผู้ยืม
    const borrowerUserId = reservation.user?.user?.id;
    if (borrowerUserId) {
      await createNotification(db, {
        userId: borrowerUserId,
        title: `✅ อนุมัติการยืมหนังสือแล้ว`,
        message: `"${reservation.book.title}" ได้รับการอนุมัติแล้ว กำหนดคืนวันที่ ${dueDate.toLocaleDateString("th-TH", { dateStyle: "long" })}`,
        link: "/books/my-books",
      });
    }

    let emailSent = false;
    try {
      await sendReservationReadyNotification({ reservation });
      emailSent = true;
    } catch (emailError) {
      // The reservation has already become a borrow record; do not undo that work
      // just because the mail provider is temporarily unavailable.
      console.error(`Could not send ready-for-pickup email for reservation ${id}:`, emailError);
    }

    return NextResponse.json({ ...result, emailSent }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยืนยันการยืม", error: String(error) },
      { status: 500 }
    );
  }
}
