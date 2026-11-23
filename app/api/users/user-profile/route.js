import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function PUT(request) {
  try {
    //แบบไม่ Destructuring ตัวแปร
    const {
      username,
      emailAddress,
      prefix,
      fullName,
      codeNumber,
      phoneNumber,
      educationLevel,
      educationYear,
      branch,
      description = "",
      profileImage = "",
      userId,
    } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล" },
        { status: 401 }
      );
    }
    if (session.user.id !== userId) {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้งานนี้" },
        { status: 403 }
      );
    }

    const existingUserProfile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });
    if (!existingUserProfile) {
      return NextResponse.json(
        {
          data: null,
          message: "ไม่พบโปรไฟล์ผู้ใช้งาน",
        },
        { status: 404 }
      );
    }

    const updatedUserProfile = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { username, email: emailAddress },
      });
      return tx.userProfile.update({
        where: { userId },
        data: {
          username,
          emailAddress,
          prefix,
          fullName,
          codeNumber,
          phoneNumber,
          educationLevel,
          educationYear,
          branch,
          description,
          profileImage,
        },
      });
    });

    return NextResponse.json(updatedUserProfile);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัพเดทผู้ใช้งาน", error },
      { status: 500 }
    );
  }
}
