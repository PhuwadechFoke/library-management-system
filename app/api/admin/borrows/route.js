import db from "@/lib/db";
import { NextResponse } from "next/server";

// ตั้งค่า origin ของ frontend ที่อนุญาตให้เรียก API นี้ได้
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ทดสอบผ่านก่อนด้วย * แล้วค่อยเปลี่ยนเป็น URL frontend จริงทีหลัง
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ตอบ preflight request
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const {
      bookId,
      borrowerId,
      approverId,
      borrowDate,
      dueDate,
      numberOfDays,
    } = await request.json();

    // ค้นหาหนังสือที่ต้องการยืม
    const book = await db.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { message: "ไม่พบหนังสือที่ต้องการยืม" },
        { status: 404, headers: corsHeaders }
      );
    }

    // ตรวจสอบว่าหนังสือมีจำนวนคงเหลือเพียงพอหรือไม่
    if (book.remaining <= 0) {
      return NextResponse.json(
        { message: "หนังสือหมดสต็อก" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ลดจำนวนคงเหลือของหนังสือลง 1 และอัปเดตสถานะอัตโนมัติ
    const newRemaining = book.remaining - 1;
    const updatedBook = await db.book.update({
      where: { id: bookId },
      data: {
        remaining: newRemaining,
        active: newRemaining > 0,
      },
    });

    // สร้างบันทึกการยืมใหม่ในฐานข้อมูล
    const newBorrow = {
      bookId,
      borrowerId,
      approverId,
      borrowDate,
      dueDate,
      numberOfDays: parseInt(numberOfDays),
    };

    const borrowRecord = await db.borrow.create({
      data: newBorrow,
    });

    // บันทึกกิจกรรมการอนุมัติคำขอยืมหนังสือ
    await db.activity.create({
      data: {
        type: "CREATE_BORROW",
        userProfileId: approverId,
        bookId: borrowRecord.bookId,
      },
    });

    console.log("CREATE_BORROW");
    return NextResponse.json(newBorrow, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยืมหนังสือ", error },
      { status: 500, headers: corsHeaders }
    );
  }
}

// api/admin/books
export async function GET(request) {
  try {
    const borrows = await db.borrow.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        book: true,
        borrower: true,
        approver: true,
        returnApprover: true,
      },
    });

    const filterBorrows = borrows.map((item) => {
      return {
        ...item,
        bookTitle: item.book?.title || "",
        borrowerName: `${item.borrower?.prefix || ""} ${item.borrower?.fullName || ""}`.trim(),
        borrowerProfileImage: item.borrower?.profileImage || "",
        borrowerEducation: `${item.borrower?.educationLevel || ""} ${
          item.borrower?.educationYear || ""
        }`.trim(),
        borrowerCodeNumber: item.borrower?.codeNumber || "",
        borrowerPhoneNumber: item.borrower?.phoneNumber || "",
        approverName: item.approver?.username || "",
      };
    });

    return NextResponse.json(filterBorrows, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลการยืม", error },
      { status: 500, headers: corsHeaders }
    );
  }
}