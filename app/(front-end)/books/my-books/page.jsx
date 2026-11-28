"use client";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import {
  Album,
  BadgeCheck,
  BookOpen,
  Clock,
  History,
  LibraryBig,
  Trash2,
} from "lucide-react";
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
import LocalizedText from "@/components/frontend/LocalizedText";
import { useLanguage } from "@/context/LanguageContext";
import { sortBorrowRecordsByDueDate } from "@/lib/borrow-due-status";

export default function page() {
  const { data: session } = useSession();
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

  const borrowRecords = Array.isArray(borrows) ? borrows : [];
  const sortedBorrowRecords = sortBorrowRecordsByDueDate(borrowRecords);
  const reservationRecords = Array.isArray(reservations) ? reservations : [];
  const borrowedCount = borrowRecords.filter(
    (borrow) => !borrow.isReturned && borrow.status === "BORROWED"
  ).length;
  const overdueCount = borrowRecords.filter(
    (borrow) => !borrow.isReturned && borrow.status === "OVERDUE"
  ).length;
  const returnedCount = borrowRecords.filter(
    (borrow) => borrow.isReturned || borrow.status === "RETURNED"
  ).length;

  return (
    <div className="space-y-5 pb-6">
      <HeadTitleBreadcrumb icon={Album} />

      <section className="relative isolate overflow-hidden rounded-3xl border border-red-950/10 bg-gradient-to-br from-white via-orange-50/70 to-red-50/80 p-5 shadow-sm dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-red-950/25 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full border border-red-900/10 dark:border-white/10" />
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-white/70 px-3 py-1 text-xs font-semibold text-red-800 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:text-red-200">
          <LibraryBig className="h-3.5 w-3.5" />
          <LocalizedText value="myBooks.overview" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <LocalizedText value="nav.myBooks" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <LocalizedText value="myBooks.description" />
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            icon={History}
            label="myBooks.borrowHistory"
            value={borrowRecords.length}
            tone="red"
            loading={isBorrowsLoading}
          />
          <SummaryCard
            icon={BookOpen}
            label="myBooks.currentlyBorrowed"
            value={borrowedCount}
            tone="blue"
            loading={isBorrowsLoading}
          />
          <SummaryCard
            icon={Clock}
            label="myBooks.overdue"
            value={overdueCount}
            tone="amber"
            loading={isBorrowsLoading}
          />
          <SummaryCard
            icon={BadgeCheck}
            label="myBooks.returned"
            value={returnedCount}
            tone="green"
            loading={isBorrowsLoading}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">
                <LocalizedText value="รายการจองที่รอดำเนินการ" />
              </h2>
              <p className="text-xs text-muted-foreground">
                <LocalizedText value="myBooks.reservationDescription" />
              </p>
            </div>
          </div>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            {isReservationsLoading ? "…" : reservationRecords.length}{" "}
            <LocalizedText value="common.items" />
          </span>
        </div>

        {isReservationsLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : reservationRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/15 px-4 py-8 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">
              <LocalizedText value="myBooks.noPendingReservations" />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              <LocalizedText value="myBooks.reservationEmptyHint" />
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {reservationRecords.map((reservation) => (
              <div
                key={reservation.id}
                className="group relative flex gap-3 overflow-hidden rounded-2xl border border-border/70 bg-background/70 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-background hover:shadow-lg"
              >
                <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-amber-500/70 opacity-0 transition-opacity group-hover:opacity-100" />
                {reservation.book?.imageUrl ? (
                  <Image
                    src={reservation.book.imageUrl}
                    width={60}
                    height={60}
                    alt={reservation.book.title || "Book"}
                    className="h-20 w-14 shrink-0 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
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
                      <LocalizedText value="myBooks.borrowFor" />{" "}
                      {reservation.numberOfDays} <LocalizedText value="stats.days" />
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      <LocalizedText value="myBooks.reservedAt" />{" "}
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
                      className="h-8 rounded-lg px-2 text-xs text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
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
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-800/10 text-red-800 dark:bg-red-300/10 dark:text-red-300">
              <History className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">
                <LocalizedText value="myBooks.borrowHistory" />
              </h2>
              <p className="text-xs text-muted-foreground">
                <LocalizedText value="myBooks.historyDescription" />
              </p>
            </div>
          </div>
          {!isBorrowsLoading && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {borrowRecords.length} <LocalizedText value="common.items" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          {isBorrowsLoading || !borrows ? (
            <Skeleton className="h-72 w-full rounded-2xl" />
          ) : (
            <DataTable
              data={sortedBorrowRecords}
              columns={columns}
              filterKeys={["bookTitle", "dueDate"]}
            />
          )}
        </div>
      </section>

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

function SummaryCard({ icon: Icon, label, value, tone, loading }) {
  const { t } = useLanguage();
  const tones = {
    red: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
    blue: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
    amber:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    green:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4">
      <div className="absolute -right-4 -top-5 h-16 w-16 rounded-full bg-foreground/[0.03] transition-transform duration-300 group-hover:scale-150" />
      <div className="relative flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]} sm:h-10 sm:w-10`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0">
          <p className="line-clamp-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
            {t(label)}
          </p>
          <p
            className={`mt-0.5 text-xl font-bold tracking-tight sm:text-2xl ${
              loading ? "animate-pulse text-muted-foreground/60" : ""
            }`}
          >
            {loading ? "—" : value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
