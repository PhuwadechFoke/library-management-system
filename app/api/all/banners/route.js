import db from "@/lib/db";
import { NextResponse } from "next/server";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    console.log("API HIT");

    const banner = await db.banner.findFirst();

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    console.log("GET BANNER ERROR:", error);

    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลแบนเนอร์",
        error: String(error),
      },
      { status: 500 }
    );
  }
}