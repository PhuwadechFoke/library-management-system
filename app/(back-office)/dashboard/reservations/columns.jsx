"use client";

import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import { Button } from "@/components/ui/button";
import { makeDeleteRequest } from "@/lib/apiRequest";
import { queryClient } from "@/lib/react-query-client";
import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";

export const columns = [
  {
    accessorKey: "book.imageUrl",
    header: "รูปภาพ",
    cell: ({ row }) => (
      <ImageColumn row={{ original: row.original.book }} accessorKey="imageUrl" />
    ),
  },
  {
    accessorKey: "book.title",
    header: ({ column }) => (
      <TitleColumn column={column} title="ชื่อหนังสือ" className="-m-4 min-w-60" />
    ),
    cell: ({ row }) => row.original.book?.title ?? "-",
  },
  {
    accessorKey: "user.fullName",
    header: ({ column }) => <TitleColumn column={column} title="ผู้จอง" />,
    cell: ({ row }) => {
      const user = row.original.user;
      return `${user?.prefix ?? ""} ${user?.fullName ?? "ไม่ระบุ"}`.trim();
    },
  },
  {
    accessorKey: "user.phoneNumber",
    header: ({ column }) => <TitleColumn column={column} title="เบอร์โทร" />,
    cell: ({ row }) => row.original.user?.phoneNumber ?? "-",
  },
  {
    accessorKey: "isRead",
    header: ({ column }) => <TitleColumn column={column} title="สถานะ" />,
    cell: ({ row }) =>
      row.original.isRead ? (
        <span className="text-green-600 dark:text-green-500 font-semibold">อ่านแล้ว</span>
      ) : (
        <span className="text-red-600 dark:text-red-500 font-semibold">ใหม่</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DateCreatedColumn column={column} title="วันที่จอง" />,
    cell: ({ row }) => <DateCreatedColumnCell row={row} accessorKey="createdAt" />,
  },
  {
    header: "จัดการ",
    id: "actions",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const reservation = row.original;

      const onSuccess = () => {
        queryClient.invalidateQueries(["reservations"]);
      };

      const handleCancel = () => {
        if (confirm("ยืนยันยกเลิกการจองนี้?")) {
          makeDeleteRequest(
            `api/admin/reservations/${reservation.id}`,
            {},
            "การจอง",
            onSuccess,
            () => {},
            dispatch
          );
        }
      };

      return (
        <Button variant="outline" size="sm" onClick={handleCancel}>
          <Trash2 className="w-4 h-4 mr-1" /> ยกเลิก
        </Button>
      );
    },
  },
];