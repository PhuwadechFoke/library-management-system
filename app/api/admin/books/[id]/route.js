import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const existingBook = await db.book.findUnique({
      where: {
        id,
      },
      include: {
        activities: true,
      },
    });
    if (!existingBook) {
      return NextResponse.json(
        {
          data: null,
          message: "ไม่พบหนังสือนี้",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(existingBook);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ", error },
      { status: 500 }
    );
  }
}

// 🛠️ [แก้ไขฟังก์ชัน DELETE] ตรวจสอบสิทธิ์การลบเพื่อป้องกันระบบประวัติการยืมแครชพัง
export async function DELETE(request, { params: { id } }) {
  try {
    const existingBook = await db.book.findUnique({
      where: {
        id,
      },
    });

    if (!existingBook) {
      return NextResponse.json(
        { data: null, message: "ไม่พบหนังสือนี้ในระบบ" },
        { status: 404 }
      );
    }

    // 1. เช็คว่ามีรายการยืมที่ "ยังไม่ได้คืน" (สถานะไม่ใช่ RETURNED หรือเทียบเท่าตามระบบของคุณ) ค้างอยู่หรือไม่
    const activeBorrows = await db.borrow.findFirst({
      where: {
        bookId: id,
        status: {
          not: "RETURNED" // ปรับคำให้ตรงกับ Enum สถานะการคืนเงิน/คืนหนังสือของคุณจริง ๆ เช่น "RETURNED"
        }
      },
    });

    if (activeBorrows) {
      return NextResponse.json(
        { 
          message: "ไม่สามารถลบหนังสือเล่มนี้ได้ เนื่องจากมีนักศึกษากำลังยืมใช้งานและยังไม่ได้นำมาคืน" 
        },
        { status: 400 }
      );
    }

    // 2. ถ้าไม่มีคนค้างส่งคืน ค่อยทำการลบข้อมูลออกจากระบบอย่างปลอดภัย
    const deletedBook = await db.book.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedBook);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบหนังสือ มีข้อมูลที่เชื่อมโยงกันอยู่", error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const {
      title,
      slug,
      price,
      quantity,
      remaining,
      author,
      imageUrls,
      description,
      categoryId,
      adminId,
    } = await request.json();

    const existingBook = await db.book.findUnique({
      where: {
        id,
      },
    });
    if (!existingBook) {
      return NextResponse.json(
        {
          data: null,
          message: "ไม่พบหนังสือนี้",
        },
        { status: 404 }
      );
    }
    const updateBook = await db.book.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        price: parseInt(price) || 0,
        quantity: parseInt(quantity) || 0,
        remaining: parseInt(remaining) || 0,
        author,
        imageUrl: imageUrls[0],
        imageUrls,
        description,
        categoryId,
      },
    });

    await db.activity.create({
      data: {
        type: "UPDATE_BOOK",
        bookId: updateBook.id,
        userProfileId: adminId,
      },
    });
    console.log("UPDATE_BOOK");
    return NextResponse.json(updateBook,{ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัพเดทหนังสือ", error },
      { status: 500 }
    );
  }
}