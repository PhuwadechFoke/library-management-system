import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { render } from "@react-email/render";
import { getEmailTransport } from "@/lib/emailTransport";
import EmailTemplate from "@/components/ui/email-template";
import db from "@/lib/db";
import { nameWebsite } from "@/lib/nameWebsite";

export async function POST(request) {
  let userCreated = false;
  try {
    const emailTransport = getEmailTransport();
    if (!emailTransport) {
      console.error("Gmail SMTP credentials are not configured");
      return NextResponse.json(
        { message: "ระบบส่งอีเมลยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกชื่อผู้ใช้ อีเมล และรหัสผ่านให้ครบถ้วน" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "รูปแบบอีเมลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

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

    const newUser = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verificationToken: token,
        },
      });

      await tx.userProfile.create({
        data: {
          username,
          emailAddress: email,
          userId: user.id,
          prefix: "",
          fullName: "",
          codeNumber: "",
          phoneNumber: "",
          educationLevel: "",
          educationYear: "",
          branch: "",
          description: "",
          profileImage: "",
        },
      });

      return user;
    });
    userCreated = true;
    const subject = `คุณได้สมัครเป็นสมาชิกในเว็บไซต์ของ ${nameWebsite} โปรดยืนยันบัญชีของคุณ`;
    const linkText = "ยืนยันบัญชีของคุณ";
    const description = "ขอขอบคุณที่สร้างบัญชีกับเรา โปรดยืนยันบัญชีของคุณ";

    const redirectUrl = new URL(
      `/verify-email?token=${encodeURIComponent(token)}`,
      request.url
    ).toString();

    const emailHtml = render(
      EmailTemplate({ name: username, redirectUrl, linkText, subject, description })
    );

    await emailTransport.transporter.sendMail({
      from: `${nameWebsite} <${emailTransport.user}>`,
      to: email,
      subject: subject,
      html: emailHtml,
    });

    return NextResponse.json(
      {
        data: { id: newUser.id, username: newUser.username, email: newUser.email },
        message: "สร้างบัญชีสําเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register user:", error);
    if (userCreated) {
      return NextResponse.json(
        {
          canResendVerification: true,
          message:
            "สร้างบัญชีแล้ว แต่ส่งอีเมลยืนยันไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Gmail SMTP แล้วลองส่งลิงก์อีกครั้ง",
        },
        { status: 502 }
      );
    }
    return NextResponse.json(
      {
        message: "สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง",
      },
      { status: 500 }
    );
  }
}