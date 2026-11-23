"use client";

import ActionColumn from "@/components/backoffice/data-table-columns/ActionColumn";
import ActionStatusColumn from "@/components/backoffice/data-table-columns/ActionStatusColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import DateUpdatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnUpdatedCell";
import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import NumberColumn from "@/components/backoffice/data-table-columns/NumberColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { getBookStockStatus } from "@/lib/bookStock";
import Link from "next/link";

function StockStatusCell({ status }) {
  const { t } = useLanguage();
  const style = {
    out: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    low: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    normal: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    unknown: "border-border bg-muted text-muted-foreground",
  };
  const label = {
    out: "stock.out",
    low: "stock.low",
    normal: "stock.normal",
    unknown: "stock.unknown",
  };

  return <Badge className={style[status]}>{t(label[status])}</Badge>;
}

export const columns = [
  {
    accessorKey: "imageUrl",
    header: "รูปภาพ",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="imageUrl" />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <TitleColumn
        column={column}
        title="ชื่อ-หนังสือ"
        className="-m-4 min-w-80"
      />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <TitleColumn column={column} title="ราคา" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="price" />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <TitleColumn column={column} title="ทั้งหมด" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="quantity" />,
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => <TitleColumn column={column} title="คงเหลือ" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="remaining" />,
  },
  {
    id: "stockStatus",
    accessorFn: (row) => getBookStockStatus(row.remaining),
    header: ({ column }) => <TitleColumn column={column} title="stock.status" />,
    cell: ({ row }) => <StockStatusCell status={getBookStockStatus(row.original.remaining)} />,
  },
  {
    accessorKey: "availabilityStatus",
    header: ({ column }) => <TitleColumn column={column} title="สถานะหนังสือ" />,
    cell: ({ row }) => {
      const isAvailable =
        row.original.availabilityStatus === "AVAILABLE" ||
        (row.original.availabilityStatus == null && row.original.remaining > 0);
      return (
        <span
          className={
            isAvailable
              ? "text-green-700 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          }
        >
          {isAvailable ? "ว่าง" : "ไม่ว่าง"}
        </span>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => <TitleColumn column={column} title="การแสดงผล" />,
    id: "active",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <ActionStatusColumn
          row={row}
          title="การแสดงผล"
          accessorKey="active"
          bookId={book.id}
        />
      );
    },
  },
  {
    header: ({ column }) => <TitleColumn column={column} title="ยืมหนังสือ" />,
    id: "borrow",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <Link href={`/dashboard/books/borrow/${book.id}`} className="w-full">
          <Button variant="outline" className="min-w-20">
            ยืม
          </Button>
        </Link>
      );
    },
  },
  {
    header: "จัดการ",
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <ActionColumn
          row={row}
          title="หนังสือ"
          refreshQueryKey="books"
          endpoint={`admin/books/${book.id}`}
          editEndpoint={`books/update/${book.id}`}
        />
      );
    },
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => <TitleColumn column={column} title="สถานะ" />,
  //   cell: ({ row }) => <StatusColumn row={row} accessorKey="status" />,
  // },

  //   {
  //   accessorKey: "author",
  //   header: ({ column }) => <TitleColumn column={column} title="ชื่อผู้แต่ง" />,
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DateCreatedColumn column={column} title="วันที่สร้าง" />
    ),
    cell: ({ row }) => (
      <DateCreatedColumnCell row={row} accessorKey="createdAt" />
    ),
  },
  {
    accessorKey: "creator",
    header: ({ column }) => <TitleColumn column={column} title="ผู้สร้าง" />,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DateCreatedColumn column={column} title="อัพเดท" />
    ),
    cell: ({ row }) => (
      <DateUpdatedColumnCell row={row} accessorKey="updatedAt" />
    ),
  },
  {
    accessorKey: "updater",
    header: ({ column }) => <TitleColumn column={column} title="ผู้อัพเดท" />,
  },
];
