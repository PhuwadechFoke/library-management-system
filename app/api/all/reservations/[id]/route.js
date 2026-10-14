import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { createNotification } from "@/lib/notifications";

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

    // แจ้งเตือนยืนยันไปยังผู้ใช้
    await createNotification(db, {
      userId: session.user.id,
      title: "ยกเลิกการจองเรียบร้อย",
      message: `คุณได้ยกเลิกการจอง "${reservation.book?.title || 'หนังสือ'}" เรียบร้อยแล้ว`,
      link: "/books/my-books",
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
