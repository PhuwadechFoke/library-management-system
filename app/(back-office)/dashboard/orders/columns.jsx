"use client";

import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import NumberColumn from "@/components/backoffice/data-table-columns/NumberColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusMap = {
  PENDING: { label: "รอดำเนินการ", variant: "outline", className: "border-yellow-500 text-yellow-600 dark:text-yellow-400" },
  CONFIRMED: { label: "ยืนยันแล้ว", variant: "outline", className: "border-blue-500 text-blue-600 dark:text-blue-400" },
  COMPLETED: { label: "เสร็จสิ้น", variant: "outline", className: "border-green-500 text-green-600 dark:text-green-400" },
  CANCELLED: { label: "ยกเลิก", variant: "outline", className: "border-red-500 text-red-600 dark:text-red-400" },
};

export const columns = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <TitleColumn column={column} title="เลขที่คำสั่งซื้อ" className="-m-4 min-w-44" />
    ),
  },
  {
    accessorKey: "totalItems",
    header: ({ column }) => <TitleColumn column={column} title="จำนวนรายการ" />,
    cell: ({ row }) => {
      const items = row.original.items;
      return <span>{items?.length || 0} รายการ</span>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <TitleColumn column={column} title="ยอดรวม (บาท)" />,
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      return <span>{amount?.toLocaleString() || 0}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TitleColumn column={column} title="สถานะ" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusMap[status] || { label: status, variant: "outline", className: "" };
      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
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
    header: ({ column }) => <TitleColumn column={column} title="เพิ่มเติม" />,
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Link href={`/dashboard/orders/${order.id}`} className="w-full">
          <Button variant="outline" className="min-w-20">
            รายละเอียด
          </Button>
        </Link>
      );
    },
  },
];
