import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { createNotification, notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const reservation = await db.reservation.findUnique({
      where: { id },
      include: {
        book: { select: { title: true } },
        user: { select: { fullName: true, username: true } },
      },
    });

    if (!reservation) {
      return NextResponse.json({ message: "ไม่พบรายการจองนี้" }, { status: 404 });
    }

    // ตรวจสอบว่ารายการจองนี้เป็นของผู้ใช้ที่ล็อกอินอยู่จริงหรือไม่
    if (reservation.userId !== session.user.id) {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ยกเลิกรายการนี้" }, { status: 403 });
    }

    // ทำรายการคืนสต็อกหนังสือ + ลบรายการจอง
    await db.$transaction(async (tx) => {
      await tx.book.update({
        where: { id: reservation.bookId },
        data: { remaining: { increment: 1 } },
      });

      await tx.reservation.delete({ where: { id } });
    });

    // 1. แจ้งเตือนยืนยันไปยังผู้ใช้
    await createNotification(db, {
      userId: session.user.id,
      title: "ยกเลิกการจองเรียบร้อย",
      message: `คุณได้ยกเลิกการจอง "${reservation.book?.title || 'หนังสือ'}" เรียบร้อยแล้ว`,
      link: "/books/my-books",
    });

    // 2. แจ้งเตือนแอดมินว่าผู้ใช้ยกเลิกการจองเอง
    const userName = reservation.user?.fullName || reservation.user?.username || "สมาชิก";
    await notifyAdmins(db, {
      title: "ผู้ใช้ยกเลิกการจองหนังสือ",
      message: `${userName} ได้ยกเลิกการจอง "${reservation.book?.title || 'หนังสือ'}" แล้ว สต็อกคืนเข้าชั้นเรียบร้อย`,
      link: "/dashboard/reservations",
    });

    return NextResponse.json({ message: "ยกเลิกการจองสำเร็จ" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยกเลิกการจอง", error: String(error) },
      { status: 500 }
    );
  }
}
