import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// สถานะที่อนุญาต
const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

// สถานะที่ไม่สามารถเปลี่ยนได้อีก (final states)
const FINAL_STATUSES = ["COMPLETED", "CANCELLED"];

// GET /api/admin/orders/[id] — ดูรายละเอียดคำสั่งซื้อ
export async function GET(request, { params: { id } }) {
  try {
    const order = await db.bookOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                imageUrl: true,
                author: true,
                quantity: true,
                remaining: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "ไม่พบคำสั่งซื้อนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/orders/[id] — เปลี่ยนสถานะคำสั่งซื้อ
export async function PUT(request, { params: { id } }) {
  try {
    const body = await request.json();
    const { status } = body;

    // --- ตรวจสอบว่า status ถูกส่งมา ---
    if (!status) {
      return NextResponse.json(
        { message: "กรุณาระบุสถานะ (status)" },
        { status: 400 }
      );
    }

    // --- ตรวจสอบว่า status เป็นค่าที่ถูกต้อง ---
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          message: `สถานะไม่ถูกต้อง กรุณาระบุเป็น: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // --- ตรวจสอบว่า order มีอยู่จริง ---
    const existingOrder = await db.bookOrder.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: "ไม่พบคำสั่งซื้อนี้" },
        { status: 404 }
      );
    }

    // --- ตรวจสอบ state transition: ห้ามเปลี่ยนจาก COMPLETED หรือ CANCELLED ---
    if (FINAL_STATUSES.includes(existingOrder.status)) {
      return NextResponse.json(
        {
          message: `ไม่สามารถเปลี่ยนสถานะได้ เนื่องจากคำสั่งซื้อนี้มีสถานะ "${existingOrder.status}" แล้ว`,
        },
        { status: 400 }
      );
    }

    // --- ตรวจสอบว่าสถานะใหม่ต่างจากสถานะเดิม ---
    if (existingOrder.status === status) {
      return NextResponse.json(
        { message: `คำสั่งซื้อนี้มีสถานะ "${status}" อยู่แล้ว` },
        { status: 400 }
      );
    }

    // --- อัปเดตสถานะ ---
    const updatedOrder = await db.bookOrder.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                imageUrl: true,
                author: true,
              },
            },
          },
        },
      },
    });

    console.log("UPDATE_ORDER_STATUS:", updatedOrder.orderNumber, "->", status);

    return NextResponse.json({
      data: updatedOrder,
      message: `อัปเดตสถานะคำสั่งซื้อเป็น "${status}" สำเร็จ`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}