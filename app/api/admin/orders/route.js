import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function generateOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request) {
  try {
    const { orderById, supplierName, supplierContact, note, items } = await request.json();
    if (!orderById || !supplierName?.trim() || !Array.isArray(items) || !items.length) return NextResponse.json({ message: "กรุณาระบุผู้จัดจำหน่ายและรายการหนังสืออย่างน้อย 1 รายการ" }, { status: 400 });
    const adminProfile = await db.userProfile.findUnique({ where: { userId: orderById } });
    if (!adminProfile) return NextResponse.json({ message: "ไม่พบข้อมูลผู้สร้างใบสั่งซื้อ" }, { status: 404 });

    const validatedItems = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.bookId || !Number.isInteger(quantity) || quantity < 1) return NextResponse.json({ message: "ข้อมูลหนังสือหรือจำนวนไม่ถูกต้อง" }, { status: 400 });
      const book = await db.book.findUnique({ where: { id: item.bookId } });
      if (!book) return NextResponse.json({ message: "ไม่พบหนังสือในรายการ" }, { status: 404 });
      validatedItems.push({ bookId: book.id, quantity, unitPrice: book.price, totalPrice: book.price * quantity });
    }

    let orderNumber;
    do { orderNumber = generateOrderNumber(); } while (await db.bookOrder.findUnique({ where: { orderNumber } }));
    const totalAmount = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const order = await db.bookOrder.create({
      data: { orderNumber, orderById, supplierName: supplierName.trim(), supplierContact: supplierContact?.trim() || null, note: note?.trim() || null, totalAmount, items: { create: validatedItems } },
      include: { items: { include: { book: { select: { id: true, title: true, author: true, price: true, imageUrl: true } } } } },
    });
    return NextResponse.json({ data: order, message: "สร้างใบสั่งซื้อเรียบร้อย" }, { status: 201 });
  } catch (error) {
    console.error("CREATE_BOOK_ORDER:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการสร้างใบสั่งซื้อ" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await db.bookOrder.findMany({ orderBy: { createdAt: "desc" }, include: { items: { include: { book: { select: { id: true, title: true, author: true, price: true, imageUrl: true } } } } } });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET_BOOK_ORDERS:", error);
    return NextResponse.json({ message: "ไม่สามารถดึงรายการสั่งซื้อได้" }, { status: 500 });
  }
}