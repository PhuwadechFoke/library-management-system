import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { render } from "@react-email/render";
import { getEmailTransport } from "@/lib/emailTransport";
import EmailTemplate from "@/components/ui/email-template";
import db from "@/lib/db";
import { nameWebsite } from "@/lib/nameWebsite";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let pendingVerification;
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "กรุณาระบุอีเมลที่ถูกต้อง" },
        { status: 400 }
      );
    }

    const emailTransport = getEmailTransport();
    if (!emailTransport) {
      console.error("Gmail SMTP credentials are not configured");
      return NextResponse.json(
        { message: "ระบบส่งอีเมลยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ" },
        { status: 503 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.emailVerified) {
      return NextResponse.json({
        message:
          "หากอีเมลนี้มีบัญชีที่ยังไม่ยืนยัน ระบบจะส่งลิงก์ยืนยันให้",
      });
    }

    const previousToken = user.verificationToken;
    const token = base64url.encode(uuidv4());
    await db.user.update({
      where: { id: user.id },
      data: { verificationToken: token },
    });
    pendingVerification = { userId: user.id, previousToken };

    const subject = `คุณได้สมัครเป็นสมาชิกในเว็บไซต์ของ ${nameWebsite} โปรดยืนยันบัญชีของคุณ`;
    const emailHtml = render(
      EmailTemplate({
        name: user.username || "",
        redirectUrl: new URL(
          `/verify-email?token=${encodeURIComponent(token)}`,
          request.url
        ).toString(),
        linkText: "ยืนยันบัญชีของคุณ",
        subject,
        description: "ขอขอบคุณที่สร้างบัญชีกับเรา โปรดยืนยันบัญชีของคุณ",
      })
    );
    await emailTransport.transporter.sendMail({
      from: `${nameWebsite} <${emailTransport.user}>`,
      to: email,
      subject,
      html: emailHtml,
    });
    pendingVerification = undefined;

    return NextResponse.json({
      message: "ส่งลิงก์ยืนยันแล้ว หากไม่พบอีเมลโปรดตรวจสอบโฟลเดอร์สแปม",
    });
  } catch (error) {
    console.error("Failed to resend verification email:", error);
    if (pendingVerification) {
      try {
        await db.user.update({
          where: { id: pendingVerification.userId },
          data: { verificationToken: pendingVerification.previousToken },
        });
      } catch (rollbackError) {
        console.error("Failed to restore verification token:", rollbackError);
      }
    }
    return NextResponse.json(
      { message: "ส่งอีเมลยืนยันไม่สำเร็จ กรุณาลองอีกครั้ง" },
      { status: 500 }
    );
  }
}
