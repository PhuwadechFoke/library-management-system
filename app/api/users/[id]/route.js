import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (session.user.id !== id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ดูข้อมูลผู้ใช้งาน" }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        createdAt: true,
        id: true,
        email: true,
        username: true,
        userProfile: true,
      },
    });
    // console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน", error },
      { status: 500 }
    );
  }
}
