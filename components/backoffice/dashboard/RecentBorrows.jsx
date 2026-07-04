"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function RecentBorrows() {
  const {
    data: recentBorrows,
    isLoading: isRecentBorrowsLoading,
    error: errorRecentBorrows,
  } = useQuery({
    queryKey: ["recent-borrows"],
    // ดึงข้อมูลโดยลบ / ตัวหน้าสุดออกเพื่อให้ฟังก์ชัน getData ต่อ URL ได้ถูกต้อง
    queryFn: () => getData("admin/borrows/recent-borrows"), 
  });

  if (isRecentBorrowsLoading) {
    return (
      <div>
        <Skeleton className="w-full h-96 mb-2 " />
      </div>
    );
  }

  if (errorRecentBorrows) {
    return <div>Error loading borrows</div>;
  }

  return (
    <div>
      {recentBorrows?.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          ยังไม่มีการยืมหนังสือ
        </div>
      )}
      
      {recentBorrows?.map((borrow) => (
        /* ย้าย key มาไว้ที่แท็กนอกสุด (Link) เพื่อให้ถูกต้องตามหลักการวนลูปของ React */
        <Link href={`/dashboard/history/borrow/return/${borrow.id}`} key={borrow.id}>
          <Card className="mb-2 hover:bg-accent/50 transition-colors">
            <CardContent className="grid gap-8 p-4">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage
                    src={borrow.borrower?.profileImage}
                    alt="Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {borrow.borrower?.fullName ? borrow.borrower.fullName[0] : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {borrow.borrower?.fullName || "ไม่ระบุชื่อ"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {borrow.borrower?.emailAddress || "-"}
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  {(() => {
                    switch (borrow.status) {
                      case "BORROWED":
                        return (
                          <div className="text-yellow-600 dark:text-yellow-500 font-semibold">
                            กำลังยืม
                          </div>
                        );
                      case "OVERDUE":
                        return (
                          <div className="text-orange-600 dark:text-orange-500 font-semibold">
                            ค้างคืนเกินกำหนด
                          </div>
                        );
                      case "LOST":
                        return (
                          <div className="text-red-600 dark:text-red-500 font-semibold">
                            สูญหาย
                          </div>
                        );
                      case "RETURNED":
                        return (
                          <div className="text-green-600 dark:text-green-500 font-semibold">
                            ส่งคืนแล้ว
                          </div>
                        );
                      default:
                        return <div>{borrow.status}</div>;
                    }
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}