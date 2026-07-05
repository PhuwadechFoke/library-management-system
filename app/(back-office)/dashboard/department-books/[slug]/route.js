import db from "@/lib/db";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request, { params: { slug } }) {
  try {
    const book = await db.departmentBook.findUnique({
      where: {
        slug,
      },
    });

    if (!book) {
      return NextResponse.json(
        { data: null, message: "ไม่พบหนังสือแผนกนี้" },
        { status: 404 }
      );
    }

    const relatedBooks = await db.departmentBook.findMany({
      where: {
        department: book.department,
        active: true,
        NOT: {
          id: book.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        ...book,
        relatedBooks,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือแผนก", error: String(error) },
      { status: 500 }
    );
  }
}