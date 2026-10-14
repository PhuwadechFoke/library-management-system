import db from "@/lib/db";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const reservations = await db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        book: true,
        user: true,
      },
    });

    const formattedReservations = reservations.map((item) => {
      const user = item.user;
      const borrowerName = `${user?.prefix || ""} ${user?.fullName || user?.username || "ไม่ระบุ"}`.trim();
      return {
        ...item,
        bookTitle: item.book?.title || "-",
        bookImageUrl: item.book?.imageUrl || "",
        borrowerName,
        borrowerPhoneNumber: user?.phoneNumber || "-",
        borrowerCodeNumber: user?.codeNumber || "-",
      };
    });

    return NextResponse.json(formattedReservations, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching admin reservations:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง", error: String(error) },
      { status: 500 }
    );
  }
}