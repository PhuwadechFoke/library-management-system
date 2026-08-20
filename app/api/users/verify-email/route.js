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

    // ค้นหาโดย token ก่อน
    let user = await db.user.findFirst({
      where: { verificationToken: token },
    });

    // ถ้าหา user จาก token ไม่เจอ ให้เช็คว่าอาจจะยืนยันไปแล้วจากการเรียกซ้ำ (เช่น email scanner แอบกดก่อน)
    if (!user) {
      const alreadyVerifiedUser = await db.user.findFirst({
        where: { lastUsedVerificationToken: token, emailVerified: true },
      });

      if (alreadyVerifiedUser) {
        return NextResponse.json({ message: "บัญชีนี้ยืนยันเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันที", userId: alreadyVerifiedUser.id }, { status: 200 });
      }

      return NextResponse.json({ message: "ไม่พบบัญชีหรือโทเค็นยืนยันไม่ถูกต้อง" }, { status: 404 });
    }

    // อัปเดตสถานะเป็น true, เก็บ token เดิมไว้ใน field แยกเพื่อเช็คซ้ำได้ (กัน error ตอนเรียกซ้ำ)
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        lastUsedVerificationToken: token,
      },
    });

    return NextResponse.json({ message: "ยืนยันบัญชีสำเร็จ", userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการยืนยันบัญชี" }, { status: 500 });
  }
}