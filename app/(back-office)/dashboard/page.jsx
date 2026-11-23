"use client";
import HeadDashboard from "@/components/backoffice/dashboard/HeadDashboard";
import LowStockBooks from "@/components/backoffice/dashboard/LowStockBooks";
import RecentBorrows from "@/components/backoffice/dashboard/RecentBorrows";
import TodayTasks from "@/components/backoffice/dashboard/TodayTasks";
import PageHeaderNoAdd from "@/components/backoffice/PageHeaderNoAdd";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function page() {
  const {
    data: totalQuantity,
    isLoading: isTotalQuantityLoading,
    errorTotalQuantity,
  } = useQuery({
    queryKey: ["totalQuantity"],
    queryFn: () => getData("admin/books/total-quantity"),
  });
  const {
    data: totalRemaining,
    isLoading: isTotalRemainingLoading,
    errorRemaining,
  } = useQuery({
    queryKey: ["totalRemaining"],
    queryFn: () => getData("admin/books/total-remaining"),
  });
  const {
    data: reservations,
    isLoading: isReservationsLoading,
    error: reservationsError,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getData("admin/reservations"),
  });
  const {
    data: borrows,
    isLoading: isBorrowsLoading,
    error: borrowsError,
  } = useQuery({
    queryKey: ["borrows"],
    queryFn: () => getData("admin/borrows"),
  });
  const {
    data: books,
    isLoading: isBooksLoading,
    error: booksError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: () => getData("admin/books"),
  });

  const quantity = totalQuantity?.totalQuantity || 0;
  const remaining = totalRemaining?.totalRemaining || 0;
  const activeBorrows = Array.isArray(borrows)
    ? borrows.filter(
        (borrow) =>
          !borrow.isReturned &&
          borrow.status !== "RETURNED" &&
          borrow.status !== "LOST"
      ).length
    : 0;
  const pendingReservations = Array.isArray(reservations) ? reservations.length : 0;

  if (errorTotalQuantity) return <div>{errorTotalQuantity.message}</div>;
  if (errorRemaining) return <div>{errorRemaining.message}</div>;
  if (borrowsError) return <div>{borrowsError.message}</div>;
  if (reservationsError) return <div>{reservationsError.message}</div>;

  return (
    <div className="px-4 sm:px-0">
      <PageHeaderNoAdd loading={isTotalRemainingLoading} heading="Dashboard" />

      <div className="">
        {isTotalQuantityLoading ||
        isTotalRemainingLoading ||
        isReservationsLoading ||
        isBorrowsLoading ||
        !totalQuantity ||
        !totalRemaining ? (
          <Skeleton className="w-full h-32 mt-4 " />
        ) : (
          <div className="mt-4">
            <HeadDashboard
              quantity={quantity}
              remaining={remaining}
              activeBorrows={activeBorrows}
              pendingReservations={pendingReservations}
            />
          </div>
        )}
        <div className="mt-4">
          <TodayTasks
            borrows={borrows}
            reservations={reservations}
            isLoading={isBorrowsLoading || isReservationsLoading}
            error={borrowsError || reservationsError}
          />
        </div>
        <div className="mt-4">
          <LowStockBooks books={books} isLoading={isBooksLoading} error={booksError} />
        </div>
        <div className="mt-4">
          <RecentBorrows />
        </div>
      </div>
    </div>
  );
}
