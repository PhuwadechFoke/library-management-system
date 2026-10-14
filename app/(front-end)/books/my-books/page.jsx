"use client";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import { Album, Clock, BookOpen, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function page() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { data: borrows, isLoading: isBorrowsLoading } = useQuery({
    queryKey: ["borrows_my_books_borrower", userId],
    queryFn: () => getData(`all/borrows/user/${userId}`),
    enabled: !!userId,
  });

  const { data: reservations, isLoading: isReservationsLoading } = useQuery({
    queryKey: ["my_reservations", userId],
    queryFn: () => getData(`all/reservations/user/${userId}`),
    enabled: !!userId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userId) {
        router.push("/login");
        router.refresh();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [userId]);

  const handleCancelReservation = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      const res = await fetch(`/api/all/reservations/${cancelTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("ยกเลิกการจองเรียบร้อยแล้ว");
        queryClient.invalidateQueries(["my_reservations", userId]);
      } else {
        const error = await res.json();
        toast.error(error.message || "เกิดข้อผิดพลาดในการยกเลิก");
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <HeadTitleBreadcrumb icon={Album} />

      {/* ส่วนรายการจองที่รอดำเนินการ */}
      <div className="border bg-card py-3 px-4 rounded-sm">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b">
          <Clock className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold text-sm">รายการจองที่รอดำเนินการ</h2>
          {reservations && reservations.length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-full">
              {reservations.length} รายการ
            </span>
          )}
        </div>

        {isReservationsLoading ? (
          <Skeleton className="w-full h-24" />
        ) : !reservations || reservations.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            ไม่มีรายการจองที่รอดำเนินการ
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex gap-3 p-3 border rounded-sm bg-muted/30 hover:bg-muted/50 transition-colors relative group"
              >
                {reservation.book?.imageUrl ? (
                  <Image
                    src={reservation.book.imageUrl}
                    width={60}
                    height={60}
                    alt={reservation.book.title || "Book"}
                    className="rounded-sm object-cover w-14 h-20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-20 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex flex-col justify-between flex-1">
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">
                      {reservation.book?.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      ผู้แต่ง: {reservation.book?.author || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium block">
                      ต้องการยืม {reservation.numberOfDays} วัน
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      จองเมื่อ{" "}
                      {formatDistanceToNow(new Date(reservation.createdAt), {
                        addSuffix: true,
                        locale: th,
                      })}
                    </p>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 px-2"
                      onClick={() => setCancelTarget(reservation)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      ยกเลิกการจอง
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ส่วนประวัติการยืม */}
      <div className="border bg-card py-2 px-4 rounded-sm">
        <div className="py-2">
          {isBorrowsLoading || !borrows ? (
            <Skeleton className="w-full h-96 mb-2" />
          ) : (
            <DataTable
              data={borrows}
              columns={columns}
              filterKeys={["bookTitle", "dueDate"]}
            />
          )}
        </div>
      </div>

      {/* Dialog ยืนยันยกเลิกการจอง */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="ยืนยันการยกเลิกการจอง"
        description={`คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองหนังสือ "${cancelTarget?.book?.title || 'นี้'}"?`}
        confirmText={cancelling ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
        variant="danger"
        onConfirm={handleCancelReservation}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
