import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      title,
      slug,
      department,
      price,
      quantity,
      author,
      imageUrls,
      description,
    } = await request.json();

    const existingBook = await db.departmentBook.findUnique({
      where: {
        slug,
      },
    });

    if (existingBook) {
      return NextResponse.json(
        { data: null, message: "มีหนังสือแผนกนี้อยู่แล้ว" },
        { status: 409 }
      );
    }

    const book = await db.departmentBook.create({
      data: {
        title,
        slug,
        department,
        price: parseInt(price) || 0,
        quantity: parseInt(quantity) || 0,
        remaining: parseInt(quantity) || 0,
        author,
        imageUrls,
        imageUrl: imageUrls?.[0],
        description,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างหนังสือแผนก", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const books = await db.departmentBook.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือแผนก", error },
      { status: 500 }
    );
  }
}
