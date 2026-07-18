import db from "@/lib/db";
import { NextResponse } from "next/server";

// อัปเดตสถานะว่า admin อ่านแล้ว
export async function PUT(request, { params: { id } }) {
  try {
    const reservation = await db.reservation.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดตการจอง", error: String(error) },
      { status: 500 }
    );
  }
}

// ยกเลิกการจอง (ลบ record + คืนจำนวนหนังสือ)
export async function DELETE(request, { params: { id } }) {
  try {
    const reservation = await db.reservation.findUnique({ where: { id } });

    if (!reservation) {
      return NextResponse.json({ message: "ไม่พบรายการจองนี้" }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.book.update({
        where: { id: reservation.bookId },
        data: { remaining: { increment: 1 } },
      });

      await tx.reservation.delete({ where: { id } });
    });

    return NextResponse.json({ message: "ยกเลิกการจองสำเร็จ" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยกเลิกการจอง", error: String(error) },
      { status: 500 }
    );
  }
}