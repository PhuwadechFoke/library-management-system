import React from "react";
import Link from "next/link";

export default function HeadDashboard({
  quantity,
  remaining,
  totalBooks,
  totalActive,
  borrowCount,
  pendingReservations = 0,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="border bg-card p-4 rounded-sm w-full">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">หนังสือทั้งหมด</h1>
            <div className="text-3xl font-bold m-2">
              {quantity.toLocaleString()}
            </div>
            <div>เล่ม</div>
          </div>
        </div>
      </div>
      <div className="border bg-card p-4 rounded-sm w-full">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">หนังสือคงเหลือ</h1>
            <div className="text-3xl font-bold m-2">
              {remaining.toLocaleString()}
            </div>
            <div>เล่ม</div>
          </div>
        </div>
      </div>

      <div className="border bg-card p-4 rounded-sm w-full">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">หนังสือที่ถูกยืม</h1>
            <div className="text-3xl font-bold m-2">{borrowCount}</div>
            <div>เล่ม</div>
          </div>
        </div>
      </div>
      <div className="border bg-card p-4 rounded-sm w-full">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">หนังสือที่พร้อมยืม</h1>
            <div className="text-3xl font-bold m-2">
              {totalActive.toLocaleString()} <span className="text-lg sm:text-3xl">/</span> {totalBooks.toLocaleString()}
            </div>
            <div>เล่ม</div>
          </div>
        </div>
      </div>
      <Link href="/dashboard/reservations" className="border bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 transition-all p-4 rounded-sm w-full cursor-pointer">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium text-amber-600 dark:text-amber-400">การจองรอดำเนินการ</h1>
            <div className="text-3xl font-bold m-2 text-amber-600 dark:text-amber-400">
              {pendingReservations}
            </div>
            <div className="text-amber-600 dark:text-amber-400">รายการ</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
