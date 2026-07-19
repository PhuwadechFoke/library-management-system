import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params: { id } }) {
  try {
    const { approverId } = await request.json();

    const reservation = await db.reservation.findUnique({
      where: { id },
      include: { book: true },
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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยืนยันการยืม", error: String(error) },
      { status: 500 }
    );
  }
}