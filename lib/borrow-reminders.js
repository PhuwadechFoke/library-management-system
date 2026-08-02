import nodemailer from "nodemailer";
import { nameWebsite } from "@/lib/nameWebsite";

const TIME_ZONE = "Asia/Bangkok";

function dateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(
    parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value])
  );
}

export function bangkokDay(date = new Date()) {
  const { year, month, day } = dateParts(date);
  return `${year}-${month}-${day}`;
}

export function bangkokDayStart(day) {
  return new Date(`${day}T00:00:00+07:00`);
}

export function addDays(day, days) {
  const date = new Date(`${day}T00:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return bangkokDay(date);
}

export function formatThaiDate(date) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: TIME_ZONE,
    dateStyle: "long",
  }).format(date);
}

export async function sendBorrowReminder({ borrow, type }) {
  const recipient = borrow.borrower?.user?.email || borrow.borrower?.emailAddress;
  if (!recipient) throw new Error(`Borrow ${borrow.id} has no recipient email`);

  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASSWORD) {
    throw new Error("NODEMAILER_USER and NODEMAILER_PASSWORD must be configured");
  }

  const isOverdue = type === "OVERDUE";
  const borrowerName = borrow.borrower.fullName || borrow.borrower.username || "สมาชิก";
  const subject = isOverdue
    ? `หนังสือเกินกำหนดคืน: ${borrow.book.title}`
    : `แจ้งเตือนคืนหนังสือพรุ่งนี้: ${borrow.book.title}`;
  const message = isOverdue
    ? "หนังสือของคุณเกินกำหนดคืนแล้ว กรุณานำมาคืนห้องสมุดโดยเร็ว"
    : "หนังสือของคุณครบกำหนดคืนในวันพรุ่งนี้ กรุณาเตรียมคืนตามกำหนด";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.NODEMAILER_USER, pass: process.env.NODEMAILER_PASSWORD },
  });

  await transporter.sendMail({
    from: `${nameWebsite} <${process.env.NODEMAILER_USER}>`,
    to: recipient,
    subject,
    text: `สวัสดี ${borrowerName}\n\n${message}\n\nหนังสือ: ${borrow.book.title}\nกำหนดคืน: ${formatThaiDate(borrow.dueDate)}\n\n${nameWebsite}`,
    html: `<p>สวัสดี ${borrowerName}</p><p>${message}</p><ul><li><strong>หนังสือ:</strong> ${borrow.book.title}</li><li><strong>กำหนดคืน:</strong> ${formatThaiDate(borrow.dueDate)}</li></ul><p>${nameWebsite}</p>`,
  });
}
