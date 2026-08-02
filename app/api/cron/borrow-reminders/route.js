import { NextResponse } from "next/server";
import db from "@/lib/db";
import {
  addDays,
  bangkokDay,
  bangkokDayStart,
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

  const results = { dueTomorrow: 0, overdue: 0, skipped: 0, failed: 0 };
  for (const borrow of candidates) {
    const dueDay = bangkokDay(borrow.dueDate);
    const type = dueDay === tomorrow ? "DUE_TOMORROW" : dueDay < today ? "OVERDUE" : null;
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
      await sendBorrowReminder({ borrow, type });
      await db.borrowReminder.create({ data: { borrowId: borrow.id, type, reminderDay } });
      if (type === "OVERDUE") results.overdue += 1;
      else results.dueTomorrow += 1;
    } catch (error) {
      results.failed += 1;
      console.error(`Could not send ${type} reminder for borrow ${borrow.id}:`, error);
    }
  }

  return NextResponse.json({ date: today, ...results });
}
