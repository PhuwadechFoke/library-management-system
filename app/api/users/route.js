import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { render } from "@react-email/render";
import { Resend } from "resend";
import EmailTemplate from "@/components/ui/email-template";
import db from "@/lib/db";
import { nameWebsite } from "@/lib/nameWebsite";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: "User Already exists",
        },
        { status: 409 }
      );
    }
    // Encrypt the Password => bycrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const rawToken = uuidv4();
    // Encode the token using Base64 URL-safe format
    const token = base64url.encode(rawToken);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationToken: token,
      },
    });

    const userId = newUser.id;
    await db.userProfile.create({
      data: {
        username,
        emailAddress: email,
        userId,
        prefix: "",
        fullName: "",
        codeNumber: "",
        phoneNumber: "",
        educationLevel: "",
        educationYear: "",
        description: "",
        profileImage: "",
      },
    });

    const subject = `คุณได้สมัครเป็นสมาชิกในเว็บไซต์ของ ${nameWebsite} โปรดยืนยันบัญชีของคุณ`;
    const linkText = "ยืนยันบัญชีของคุณ";
    const description = "ขอขอบคุณที่สร้างบัญชีกับเรา โปรดยืนยันบัญชีของคุณ";

    const redirectUrl = `/onboarding/${userId}?token=${token}`;

    const emailHtml = render(
      EmailTemplate({ name: username, redirectUrl, linkText, subject, description })
    );

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
    }

    return NextResponse.json(
      {
        data: newUser,
        message: "สร้างบัญชีสําเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "เกิดข้อผิดพลาด",
      },
      { status: 500 }
    );
  }
}