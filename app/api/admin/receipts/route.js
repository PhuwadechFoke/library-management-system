import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const receipts = await db.bookReceipt.findMany({
      orderBy: { receivedAt: "desc" },
      include: {
        order: {
          include: {
            items: {
              include: {
                book: { select: { title: true, author: true } },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(receipts);
  } catch (error) {
    console.error("GET_RECEIPTS:", error);
    return NextResponse.json({ message: "ไม่สามารถดึงรายการรับเข้าได้" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { orderId, receivedById, note } = await request.json();
    if (!orderId || !receivedById) return NextResponse.json({ message: "ข้อมูลรับเข้าไม่ครบถ้วน" }, { status: 400 });
    const admin = await db.userProfile.findUnique({ where: { userId: receivedById } });
    if (!admin) return NextResponse.json({ message: "ไม่พบข้อมูลผู้รับเข้า" }, { status: 404 });
    const receipt = await db.$transaction(async (tx) => {
      const order = await tx.bookOrder.findUnique({ where: { id: orderId }, include: { items: true, receipt: true } });
      if (!order) throw new Error("ไม่พบใบสั่งซื้อ");
      if (order.receipt) throw new Error("ใบสั่งซื้อนี้ถูกรับเข้าแล้ว");
      if (order.status !== "CONFIRMED") throw new Error("รับเข้าได้เฉพาะใบสั่งซื้อที่ยืนยันแล้ว");
      for (const item of order.items) await tx.book.update({ where: { id: item.bookId }, data: { quantity: { increment: item.quantity }, remaining: { increment: item.quantity } } });
      const createdReceipt = await tx.bookReceipt.create({ data: { orderId, receivedById, note: note?.trim() || null } });
      await tx.bookOrder.update({ where: { id: orderId }, data: { status: "COMPLETED" } });
      return createdReceipt;
    });
    return NextResponse.json({ data: receipt, message: "รับหนังสือเข้าสต็อกเรียบร้อย" }, { status: 201 });
  } catch (error) {
    const message = error.message || "ไม่สามารถรับหนังสือเข้าได้";
    return NextResponse.json({ message }, { status: message.includes("รับเข้า") || message.includes("ไม่พบใบ") ? 400 : 500 });
  }
}