import { Resend } from "resend";
import { nameWebsite } from "@/lib/nameWebsite";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const recipient = borrow.borrower?.user?.email;
  if (!recipient) throw new Error(`Borrow ${borrow.id} has no recipient email`);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY must be configured");
  }

  const isOverdue = type === "OVERDUE";
  const borrowerName = borrow.borrower.fullName || borrow.borrower.username || "สมาชิก";
  const subject = isOverdue
    ? `หนังสือเกินกำหนดคืน: ${borrow.book.title}`
    : `แจ้งเตือนคืนหนังสือพรุ่งนี้: ${borrow.book.title}`;
  const message = isOverdue
    ? "หนังสือของคุณเกินกำหนดคืนแล้ว กรุณานำมาคืนห้องสมุดโดยเร็ว"
    : "หนังสือของคุณครบกำหนดคืนในวันพรุ่งนี้ กรุณาเตรียมคืนตามกำหนด";

  await resend.emails.send({
    from: `${nameWebsite} <onboarding@resend.dev>`, // คำแนะนำ: เมื่อคุณ Verify โดเมนใน Resend แล้ว ให้เปลี่ยนจาก onboarding@resend.dev เป็นอีเมลโดเมนของคุณ เช่น noreply@yourdomain.com
    to: [recipient],
    subject,
    text: `สวัสดี ${borrowerName}\n\n${message}\n\nหนังสือ: ${borrow.book.title}\nกำหนดคืน: ${formatThaiDate(borrow.dueDate)}\n\n${nameWebsite}`,
    html: `<p>สวัสดี ${borrowerName}</p><p>${message}</p><ul><li><strong>หนังสือ:</strong> ${borrow.book.title}</li><li><strong>กำหนดคืน:</strong> ${formatThaiDate(borrow.dueDate)}</li></ul><p>${nameWebsite}</p>`,
  });

  // สร้างแจ้งเตือนในระบบ (In-app notification)
  try {
    const db = (await import("@/lib/db")).default;
    await db.notification.create({
      data: {
        userId: borrow.borrowerId,
        title: subject,
        message: `กำหนดคืน: ${formatThaiDate(borrow.dueDate)}`,
        link: "/books/my-books",
      },
    });
  } catch (error) {
    console.error("Failed to create in-app notification:", error);
  }
}

export async function sendReservationReadyNotification({ reservation }) {
  const recipient = reservation.user?.user?.email || reservation.user?.emailAddress;
  if (!recipient) throw new Error(`Reservation ${reservation.id} has no recipient email`);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY must be configured");
  }

  const borrowerName = reservation.user.fullName || reservation.user.username || "สมาชิก";
  const subject = `หนังสือพร้อมให้รับ: ${reservation.book.title}`;
  const message = "หนังสือที่คุณจองไว้พร้อมให้รับแล้ว กรุณาติดต่อห้องสมุดเพื่อรับหนังสือ";

  await resend.emails.send({
    from: `${nameWebsite} <onboarding@resend.dev>`, // คำแนะนำ: เปลี่ยนเป็นโดเมนของคุณเองเมื่อพร้อม
    to: [recipient],
    subject,
    text: `สวัสดี ${borrowerName}\n\n${message}\n\nหนังสือ: ${reservation.book.title}\nระยะเวลายืม: ${reservation.numberOfDays} วัน\n\n${nameWebsite}`,
    html: `<p>สวัสดี ${borrowerName}</p><p>${message}</p><ul><li><strong>หนังสือ:</strong> ${reservation.book.title}</li><li><strong>ระยะเวลายืม:</strong> ${reservation.numberOfDays} วัน</li></ul><p>${nameWebsite}</p>`,
  });

  // สร้าง in-app notification ให้ผู้จอง
  try {
    const db = (await import("@/lib/db")).default;
    const borrowerUserId = reservation.user?.user?.id;
    if (borrowerUserId) {
      await db.notification.create({
        data: {
          userId: borrowerUserId,
          title: subject,
          message: `หนังสือ "${reservation.book.title}" พร้อมให้รับแล้ว กรุณาติดต่อห้องสมุด`,
          link: "/books/my-books",
        },
      });
    }
  } catch (error) {
    console.error("Failed to create in-app notification for reservation:", error);
  }
}