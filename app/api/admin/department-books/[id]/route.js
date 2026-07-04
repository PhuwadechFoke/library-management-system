import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const book = await db.departmentBook.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      return NextResponse.json(
        { data: null, message: "ไม่พบหนังสือแผนกนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือแผนก", error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const {
      title,
      slug,
      department,
      price,
      quantity,
      remaining,
      author,
      imageUrls,
      description,
    } = await request.json();

    const book = await db.departmentBook.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        department,
        price: parseInt(price) || 0,
        quantity: parseInt(quantity) || 0,
        remaining: parseInt(remaining) || 0,
        author,
        imageUrl: imageUrls?.[0],
        imageUrls,
        description,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัพเดทหนังสือแผนก", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const book = await db.departmentBook.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบหนังสือแผนก", error },
      { status: 500 }
    );
  }
}
