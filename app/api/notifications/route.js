import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications  → mark all as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "อ่านทั้งหมดแล้ว" });
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดต" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications  → ลบ notification ที่อ่านแล้วทั้งหมด
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.notification.deleteMany({
      where: { userId: session.user.id, isRead: true },
    });

    return NextResponse.json({ message: "ลบการแจ้งเตือนที่อ่านแล้วเรียบร้อย" });
  } catch (error) {
    console.error("Failed to delete read notifications:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบ" },
      { status: 500 }
    );
  }
}
