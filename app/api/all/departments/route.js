import db from "@/lib/db";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const books = await db.departmentBook.findMany({
      where: {
        active: true,
      },
      orderBy: {
        department: "asc",
      },
    });

    const departments = books.reduce((items, book) => {
      const slug = encodeURIComponent(book.department);
      const current = items.get(book.department) || {
        id: slug,
        title: book.department,
        slug,
        imageUrl: book.imageUrl,
        description: `รวมหนังสือของแผนก${book.department}`,
        book: [],
      };

      current.book.push(book);
      if (!current.imageUrl && book.imageUrl) current.imageUrl = book.imageUrl;
      items.set(book.department, current);
      return items;
    }, new Map());

    const departmentList = Array.from(departments.values());

    return NextResponse.json(departmentList, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลแผนก", error },
      { status: 500 }
    );
  }
}
