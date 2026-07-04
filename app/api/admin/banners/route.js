import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  try {
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

// POST
export async function POST(request) {
  try {
    const { imageUrls, adminId } = await request.json();

    const res = await db.banner.create({
      data: {
        imageUrls,
      },
    });

    await db.activity.create({
      data: {
        type: "CREATE_BANNER",
        userProfileId: adminId,
        bannerId: res.id,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log("POST BANNER ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างแบนเนอร์", error: String(error) },
      { status: 500 }
    );
  }
}

// PUT (เพิ่มใหม่ - ตัวนี้ที่หายไปทำให้เกิด 405)
export async function PUT(request) {
  try {
    const { id, imageUrls, adminId } = await request.json();

    const res = await db.banner.update({
      where: { id },
      data: {
        imageUrls,
      },
    });

    await db.activity.create({
      data: {
        type: "UPDATE_BANNER",
        userProfileId: adminId,
        bannerId: res.id,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log("PUT BANNER ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัพเดทแบนเนอร์", error: String(error) },
      { status: 500 }
    );
  }
}