import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { randomUUID } from "node:crypto";

export async function GET(request, { params: { id } }) {
  try {
    const userProfile = await db.userProfile.findUnique({
      where: {
        userId: id,
      },
      // select: {
      //   createdAt: true,
      //   email: true,
      //   id: true,
      //   username: true,
      //   role: true,
      //   userProfile: true,
      // },
    });
    return NextResponse.json(userProfile);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ลบผู้ใช้งาน" }, { status: 403 });
    }
    if (session.user.id === id) {
      return NextResponse.json(
        { message: "ไม่สามารถลบบัญชีที่กำลังเข้าสู่ระบบได้" },
        { status: 409 }
      );
    }

    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้งานนี้" }, { status: 404 });
    }
    if (user.role !== "USER") {
      return NextResponse.json(
        { message: "ไม่สามารถลบบัญชีผู้ดูแลระบบได้" },
        { status: 409 }
      );
    }
    if (user.email === null) {
      return NextResponse.json(
        { message: "บัญชีผู้ใช้นี้ถูกลบแล้ว" },
        { status: 409 }
      );
    }

    let hasHistory = false;
    await db.$transaction(async (tx) => {
      const [borrow, activity] = await Promise.all([
        tx.borrow.findFirst({
          where: {
            OR: [
              { borrowerId: id },
              { approverId: id },
              { returnApproverId: id },
            ],
          },
          select: { id: true },
        }),
        tx.activity.findFirst({
          where: { userProfileId: id },
          select: { id: true },
        }),
      ]);
      hasHistory = Boolean(borrow || activity);

      const reservations = await tx.reservation.groupBy({
        by: ["bookId"],
        where: { userId: id },
        _count: { _all: true },
      });

      await Promise.all(
        reservations.map(({ bookId, _count }) =>
          tx.book.update({
            where: { id: bookId },
            data: { remaining: { increment: _count._all } },
          })
        )
      );

      await tx.reservation.deleteMany({ where: { userId: id } });
      await tx.favoriteBook.deleteMany({ where: { userId: id } });

      if (hasHistory) {
        const anonymizedUsername = `deleted-${id.slice(0, 8)}`;

        await tx.userProfile.update({
          where: { userId: id },
          data: {
            username: anonymizedUsername,
            emailAddress: `deleted-${id}@example.invalid`,
            prefix: null,
            fullName: "ผู้ใช้ที่ถูกลบ",
            codeNumber: null,
            phoneNumber: null,
            educationLevel: null,
            educationYear: null,
            description: null,
            profileImage: null,
          },
        });
        await tx.notification.deleteMany({ where: { userId: id } });
        await tx.user.update({
          where: { id },
          data: {
            username: anonymizedUsername,
            email: null,
            password: randomUUID(),
            emailVerified: false,
            verificationToken: null,
            lastUsedVerificationToken: null,
          },
        });
      } else {
        await tx.user.delete({ where: { id } });
      }
    });

    return NextResponse.json({
      message: hasHistory
        ? "ลบข้อมูลส่วนตัวแล้ว และเก็บประวัติการยืมไว้"
        : "ลบผู้ใช้งานสำเร็จ",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน" },
      { status: 500 }
    );
  }
}
