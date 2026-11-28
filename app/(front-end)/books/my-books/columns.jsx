"use client";

import ActionColumn from "@/components/backoffice/data-table-columns/ActionColumn";
import CalculateDaysRemainingColumn from "@/components/backoffice/data-table-columns/CalculateDaysRemainingColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateUpdatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnUpdatedCell";
import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import IsReturnColumn from "@/components/backoffice/data-table-columns/IsReturnColumn";
import NumberColumn from "@/components/backoffice/data-table-columns/NumberColumn";
import StatusColumn from "@/components/backoffice/data-table-columns/StatusColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import { getBorrowDueInfo } from "@/lib/borrow-due-status";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function DueDateCell({ row }) {
  const { language, t } = useLanguage();
  const borrow = row.original;
  const dueDate = borrow.dueDate ? new Date(borrow.dueDate) : null;
  const dueInfo = getBorrowDueInfo(borrow);
  const formattedDate =
    dueDate && !Number.isNaN(dueDate.getTime())
      ? new Intl.DateTimeFormat(language === "en" ? "en-GB" : "th-TH", {
          timeZone: "Asia/Bangkok",
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(dueDate)
      : "—";

  const statusLabels = {
    OVERDUE: t("myBooks.overdue"),
    DUE_TODAY: t("myBooks.dueToday"),
    DUE_SOON: `${t("myBooks.dueSoon")} · ${dueInfo.daysRemaining} ${
      dueInfo.daysRemaining === 1 ? t("stats.day") : t("stats.days")
    }`,
  };
  const statusStyles = {
    OVERDUE:
      "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    DUE_TODAY:
      "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    DUE_SOON:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  };
  const statusLabel = statusLabels[dueInfo.status];

  return (
    <div className="flex min-w-32 flex-col items-start gap-1.5">
      <span>{formattedDate}</span>
      {statusLabel && (
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            statusStyles[dueInfo.status]
          }`}
        >
          <CalendarClock className="h-3 w-3" aria-hidden="true" />
          {statusLabel}
        </span>
      )}
    </div>
  );
}

export const columns = [
  {
    accessorKey: "bookImageUrl",
    header: "รูปภาพ",
    cell: ({ row }) => (
      <ImageColumn row={row} accessorKey="bookImageUrl" />
    ),
  },
  {
    accessorKey: "bookTitle",
    header: ({ column }) => (
      <TitleColumn
        column={column}
        title="ชื่อหนังสือ"
        className="-m-4 min-w-32"
      />
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DateCreatedColumn column={column} title="กำหนดส่ง" />
    ),
    cell: ({ row }) => <DueDateCell row={row} />,
  },
  {
    accessorKey: "numberOfDays",
    header: ({ column }) => <TitleColumn column={column} title="รวม / วัน" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="numberOfDays" />,
  },
  // {
  //   accessorKey: "dueDate",
  //   id: "daysRemaining",
  //   header: ({ column }) => (
  //     <DateCreatedColumn column={column} title="เหลือ / วัน" />
  //   ),
  //   cell: ({ row }) => (
  //     <CalculateDaysRemainingColumn row={row} accessorKey="dueDate" />
  //   ),
  // },
  {
    accessorKey: "status",
    header: ({ column }) => <TitleColumn column={column} title="สถานะ" />,
    cell: ({ row }) => <StatusColumn row={row} accessorKey="status" />,
  },
  {
    accessorKey: "isReturned",
    header: ({ column }) => <TitleColumn column={column} title="รับคืน" />,
    cell: ({ row }) => <IsReturnColumn row={row} accessorKey="isReturned" />,
  },
  {
    header: ({ column }) => <TitleColumn column={column} title="เพิ่มเติม" />,
    id: "borrow",
    cell: ({ row }) => {
      const borrow = row.original;
      return (
        <Link
          href={
             `/books/my-books/borrow/${borrow.id}` }
          className="w-full"
        >
          <Button variant="outline" className="min-w-20">
           รายละเอียด
          </Button>
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "approverName",
  //   header: ({ column }) => <TitleColumn column={column} title="ผู้อนุมัติ" />,
  // },

  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => (
  //     <DateCreatedColumn column={column} title="อัพเดท" />
  //   ),
  //   cell: ({ row }) => (
  //     <DateUpdatedColumnCell row={row} accessorKey="updatedAt" />
  //   ),
  // },
];
