import db from "@/lib/db";
import { NextResponse } from "next/server";
import { canReserveBook } from "@/lib/reservationValidation.mjs";

export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(request) {
  try {
    const { userId, bookId, numberOfDays } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const book = await db.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ message: "ไม่พบหนังสือที่เลือก" }, { status: 404 });
    }

    if (!canReserveBook(book)) {
      return NextResponse.json({ message: "หนังสือเล่มนี้ไม่สามารถจองได้ในขณะนี้" }, { status: 409 });
    }

    const existingReservation = await db.reservation.findFirst({
      where: { userId, bookId },
    });

    if (existingReservation) {
      return NextResponse.json({ message: "คุณจองหนังสือเล่มนี้แล้ว" }, { status: 409 });
    }

    const result = await db.$transaction(async (tx) => {
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          remaining: {
            decrement: 1,
          },
        },
      });

      const reservation = await tx.reservation.create({
        data: {
          userId,
          bookId,
          numberOfDays: parseInt(numberOfDays) || 3,
        },
      });

      return { reservation, updatedBook };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการจองหนังสือ" }, { status: 500 });
  }
}