import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reservations = await db.favoriteBook.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        book: true,
        user: true,
      },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงรายการจองหนังสือ" },
      { status: 500 }
    );
  }
}
