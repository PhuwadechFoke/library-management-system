import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const notification = await db.notification.update({
      where: { id: id },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "Marked as read", data: notification });
  } catch (error) {
    console.error("Failed to update notification:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดต" },
      { status: 500 }
    );
  }
}
