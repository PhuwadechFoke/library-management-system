import { NextResponse } from "next/server";
import db from "@/lib/db";
import { bangkokDay, bangkokDayStart } from "@/lib/borrow-reminders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const todayStart = bangkokDayStart(bangkokDay());
    const [topBookGroups, topBorrowerGroups, overdueBorrows, totalBorrows, overdueCount] = await Promise.all([
      db.borrow.groupBy({ by: ["bookId"], _count: { bookId: true }, orderBy: { _count: { bookId: "desc" } }, take: 5 }),
      db.borrow.groupBy({ by: ["borrowerId"], _count: { borrowerId: true }, orderBy: { _count: { borrowerId: "desc" } }, take: 5 }),
      db.borrow.findMany({
        where: { isReturned: false, status: { notIn: ["RETURNED", "LOST"] }, dueDate: { lt: todayStart } },
        orderBy: { dueDate: "asc" }, take: 10,
        select: { id: true, dueDate: true, book: { select: { title: true, slug: true } } },
      }),
      db.borrow.count(),
      db.borrow.count({
        where: { isReturned: false, status: { notIn: ["RETURNED", "LOST"] }, dueDate: { lt: todayStart } },
      }),
    ]);
    const [books, borrowers] = await Promise.all([
      db.book.findMany({ where: { id: { in: topBookGroups.map(({ bookId }) => bookId) } }, select: { id: true, title: true, slug: true } }),
      db.userProfile.findMany({ where: { userId: { in: topBorrowerGroups.map(({ borrowerId }) => borrowerId) } }, select: { userId: true, username: true, fullName: true } }),
    ]);
    const booksById = new Map(books.map((book) => [book.id, book]));
    const borrowersById = new Map(borrowers.map((borrower) => [borrower.userId, borrower]));
    const now = Date.now();

    return NextResponse.json({
      totalBorrows,
      overdueCount,
      popularBooks: topBookGroups.flatMap(({ bookId, _count }) => {
        const book = booksById.get(bookId);
        return book ? [{ ...book, borrowCount: _count.bookId }] : [];
      }),
      frequentBorrowers: topBorrowerGroups.flatMap(({ borrowerId, _count }) => {
        const borrower = borrowersById.get(borrowerId);
        return borrower ? [{ displayName: borrower.fullName || borrower.username, borrowCount: _count.borrowerId }] : [];
      }),
      overdueBooks: overdueBorrows.map((borrow) => ({
        id: borrow.id, title: borrow.book.title, slug: borrow.book.slug, dueDate: borrow.dueDate,
        daysOverdue: Math.max(1, Math.floor((now - borrow.dueDate.getTime()) / 86_400_000)),
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load public statistics:", error);
    return NextResponse.json({ message: "ไม่สามารถโหลดข้อมูลสถิติได้" }, { status: 500 });
  }
}
