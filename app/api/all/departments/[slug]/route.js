import db from "@/lib/db";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request, { params: { slug } }) {
  try {
    const department = decodeURIComponent(slug);
    const books = await db.departmentBook.findMany({
      where: {
        active: true,
        department,
      },
      orderBy: {
        title: "asc",
      },
    });

    if (!books.length) {
      return NextResponse.json(
        { data: null, message: "ไม่พบหนังสือของแผนกนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: slug,
        title: department,
        slug,
        imageUrl: books.find((book) => book.imageUrl)?.imageUrl,
        description: `รวมหนังสือของแผนก${department}`,
        book: books,
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
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลแผนก", error },
      { status: 500 }
    );
  }
}
