import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const popularBookGroups = await db.borrow.groupBy({
      by: ["bookId"],
      _count: { bookId: true },
      orderBy: { _count: { bookId: "desc" } },
      take: 30,
    });

    if (popularBookGroups.length === 0) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const books = await db.book.findMany({
      where: {
        id: { in: popularBookGroups.map(({ bookId }) => bookId) },
        active: true,
      },
    });
    const booksById = new Map(books.map((book) => [book.id, book]));
    const popularBooks = popularBookGroups
      .flatMap(({ bookId, _count }) => {
        const book = booksById.get(bookId);
        return book ? [{ ...book, borrowCount: _count.bookId }] : [];
      })
      .slice(0, 8);

    return NextResponse.json(popularBooks, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load popular books:", error);
    return NextResponse.json(
      { message: "ไม่สามารถโหลดหนังสือยอดนิยมได้" },
      { status: 500 }
    );
  }
}
