import db from "@/lib/db";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { getBookAvailabilityStatus, syncBookAvailabilityStatus } from "@/lib/bookAvailability";

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

    // สร้างบันทึกการยืมใหม่ในฐานข้อมูล
    const newBorrow = {
      bookId,
      borrowerId,
      approverId,
      borrowDate,
      dueDate,
      numberOfDays: parseInt(numberOfDays),
    };

    const borrowRecord = await db.$transaction(async (tx) => {
      const stockUpdate = await tx.book.updateMany({
        where: { id: bookId, remaining: { gt: 0 } },
        data: { remaining: { decrement: 1 } },
      });

      if (stockUpdate.count === 0) {
        throw new Error("หนังสือหมดสต็อก");
      }

      const updatedBook = await syncBookAvailabilityStatus(tx, bookId);
      await tx.book.update({
        where: { id: bookId },
        data: { active: updatedBook.remaining > 0 },
      });

      const createdBorrow = await tx.borrow.create({ data: newBorrow });
      await tx.activity.create({
        data: {
          type: "CREATE_BORROW",
          userProfileId: approverId,
          bookId: createdBorrow.bookId,
        },
      });

      return createdBorrow;
    });

    // ส่ง in-app notification ให้ผู้ยืม
    // borrowerId คือ UserProfile.userId ซึ่งตรงกับ User.id ด้วย
    await createNotification(db, {
      userId: borrowerId,
      title: `📚 อนุมัติการยืมหนังสือแล้ว`,
      message: `"${book.title}" ได้รับการอนุมัติแล้ว กำหนดคืนวันที่ ${new Date(dueDate).toLocaleDateString("th-TH", { dateStyle: "long" })}`,
      link: "/books/my-books",
    });

    console.log("CREATE_BORROW");
    return NextResponse.json(borrowRecord, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message === "หนังสือหมดสต็อก" ? error.message : "เกิดข้อผิดพลาดในการยืมหนังสือ", error },
      { status: error.message === "หนังสือหมดสต็อก" ? 400 : 500, headers: corsHeaders }
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