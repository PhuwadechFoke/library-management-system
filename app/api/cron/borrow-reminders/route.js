import { NextResponse } from "next/server";
import db from "@/lib/db";
import {
  addDays,
  bangkokDay,
  bangkokDayStart,
  formatThaiDate,
  sendBorrowReminder,
} from "@/lib/borrow-reminders";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const today = bangkokDay();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);
  const candidates = await db.borrow.findMany({
    where: {
      isReturned: false,
      status: { notIn: ["RETURNED", "LOST"] },
      dueDate: { lt: bangkokDayStart(dayAfterTomorrow) },
    },
    include: {
      book: { select: { title: true } },
      borrower: {
        select: {
          username: true,
          fullName: true,
          emailAddress: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  const results = {
    dueToday: 0,
    dueTomorrow: 0,
    overdue: 0,
    skipped: 0,
    failed: 0,
    emailFailed: 0,
  };
  for (const borrow of candidates) {
    const dueDay = bangkokDay(borrow.dueDate);
    const type =
      dueDay === tomorrow
        ? "DUE_TOMORROW"
        : dueDay <= today
          ? "OVERDUE"
          : null;
    if (!type) continue;

    const reminderDay = bangkokDayStart(today);
    const alreadySent = await db.borrowReminder.findUnique({
      where: { borrowId_type_reminderDay: { borrowId: borrow.id, type, reminderDay } },
    });
    if (alreadySent) {
      results.skipped += 1;
      continue;
    }

    try {
      await db.$transaction(async (tx) => {
        await tx.borrowReminder.create({
          data: { borrowId: borrow.id, type, reminderDay },
        });
        await tx.notification.create({
          data: {
            userId: borrow.borrowerId,
            title:
              dueDay === today
                ? "ถึงกำหนดคืนหนังสือวันนี้"
                : dueDay < today
                  ? "หนังสือเกินกำหนดคืน"
                  : "หนังสือครบกำหนดคืนพรุ่งนี้",
            message: `"${borrow.book.title}" กำหนดคืนวันที่ ${formatThaiDate(
              borrow.dueDate
            )} กรุณานำมาคืนที่ห้องสมุด`,
            link: "/books/my-books",
          },
        });
      });

      if (dueDay === today) results.dueToday += 1;
      else if (type === "OVERDUE") results.overdue += 1;
      else results.dueTomorrow += 1;
    } catch (error) {
      if (error?.code === "P2002") {
        results.skipped += 1;
        continue;
      }
      results.failed += 1;
      console.error(`Could not create ${type} reminder for borrow ${borrow.id}:`, error);
      continue;
    }

    if (dueDay === today) continue;
    try {
      await sendBorrowReminder({ borrow, type });
    } catch (error) {
      results.emailFailed += 1;
      console.error(`Could not email ${type} reminder for borrow ${borrow.id}:`, error);
    }
  }

  return NextResponse.json({ date: today, ...results });
}
