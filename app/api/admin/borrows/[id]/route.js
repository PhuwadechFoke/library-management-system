import { NextResponse } from "next/server";
import db from "@/lib/db";

// เพิ่มใหม่: GET สำหรับดึงข้อมูลการยืม 1 รายการ
export async function GET(request, { params: { id } }) {
  try {
    const borrow = await db.borrow.findUnique({
      where: { id },
      include: {
        book: true,
        borrower: true,
        approver: true,
        returnApprover: true,
      },
    });

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลการยืมนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(borrow);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลการยืม", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const body = await request.json();
    const { returnApproverId, returnDate, fine, damaged, status, bookId } = body;

    // ตรวจสอบว่า returnApproverId มีอยู่จริง
    if (returnApproverId) {
      const returnApprover = await db.userProfile.findUnique({
        where: {
          userId: returnApproverId,
        },
      });

      if (!returnApprover) {
        return NextResponse.json(
          { message: "ไม่พบผู้ใช้ที่ระบุสำหรับ returnApproverId" },
          { status: 404 }
        );
      }
    }

    // [Backend Validation] ดึงข้อมูลบันทึกการยืมปัจจุบัน
    const currentBorrow = await db.borrow.findUnique({
      where: { id }
    });

    if (!currentBorrow) {
      return NextResponse.json({ message: "ไม่พบข้อมูลการยืมนี้" }, { status: 404 });
    }

    // ไม่ว่าจะเป็น RETURNED หรือ LOST ถือว่าทำรายการปิดยอดเคสนี้แล้ว
    const nextIsReturned = status === "RETURNED" || status === "LOST"; 

    // ค่าที่จะอัปเดตลงฐานข้อมูล
    const updateData = {
      returnApproverId,
      returnDate,
      isReturned: nextIsReturned, 
      fine: parseInt(fine) || 0,
      damaged: parseInt(damaged) || 0,
      status,
    };

    // อัปเดตข้อมูลการยืมในฐานข้อมูล
    const updatedBorrow = await db.borrow.update({
      where: {
        id,
      },
      data: updateData,
    });

    console.log("Updated Borrow:", updatedBorrow);

    // อัปเดตข้อมูลจำนวนหนังสือคืนเข้าชั้นสต็อก (+1)
    if (status === "RETURNED" && !currentBorrow.isReturned) {
      const updateBook = await db.book.update({
        where: {
          id: bookId || currentBorrow.bookId, 
        },
        data: {
          remaining: {
            increment: 1,
          },
        },
      });
      console.log("Updated Book Stock:", updateBook);
    }

    return NextResponse.json(updatedBorrow);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลการยืม", error: error.message },
      { status: 500 }
    );
  }
}