import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(request, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์เปลี่ยนบทบาทผู้ใช้" },
        { status: 403 }
      );
    }

    // Prevent admin from changing their own role
    if (session.user.id === id) {
      return NextResponse.json(
        { message: "ไม่สามารถเปลี่ยนบทบาทของตัวเองได้" },
        { status: 409 }
      );
    }

    const { role } = await request.json();

    // Validate role value
    if (!role || !["ADMIN", "USER"].includes(role)) {
      return NextResponse.json(
        { message: "บทบาทไม่ถูกต้อง กรุณาระบุ ADMIN หรือ USER" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "ไม่พบผู้ใช้งานนี้" },
        { status: 404 }
      );
    }

    // Update the user's role
    const updatedUser = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    });

    return NextResponse.json({
      message: "เปลี่ยนบทบาทสำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to change user role:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการเปลี่ยนบทบาท" },
      { status: 500 }
    );
  }
}
