import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params: { id } }) {
  try {
    const reservations = await db.reservation.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            imageUrl: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง", error: String(error) },
      { status: 500 }
    );
  }
}
