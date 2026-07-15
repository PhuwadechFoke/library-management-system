import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "ไม่มีโทเค็นยืนยันบัญชี" }, { status: 400 });
    }

    // ค้นหาโดยใช้ token ที่รับมาจาก URL ตรงๆ
    const user = await db.user.findFirst({
      where: {
        verificationToken: token, // ค้นหาค่าที่ตรงกับใน DB
      },
    });

    if (!user) {
      return NextResponse.json({ message: "ไม่พบบัญชีหรือโทเค็นยืนยันไม่ถูกต้อง" }, { status: 404 });
    }

    // อัปเดตสถานะเป็น true และลบ token ทิ้ง
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true, // ตรงกับชื่อฟิลด์ใน schema.prisma
        verificationToken: null,
      },
    });

    return NextResponse.json({ message: "ยืนยันบัญชีสำเร็จ" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการยืนยันบัญชี" }, { status: 500 });
  }
}