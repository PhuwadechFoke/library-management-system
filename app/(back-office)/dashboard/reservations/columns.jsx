"use client";

import { useState } from "react";
import Image from "next/image";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { makeDeleteRequest, makePostRequest } from "@/lib/apiRequest";
import { queryClient } from "@/lib/react-query-client";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Trash2, CheckCircle } from "lucide-react";

function ActionsCell({ row }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const approverId = session?.user?.id;
  const reservation = row.original;

  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const onSuccess = () => {
    queryClient.invalidateQueries(["reservations"]);
  };

  const handleConfirm = () => {
    makePostRequest(
      `api/admin/reservations/${reservation.id}/confirm`,
      { approverId },
      "การยืม",
      onSuccess,
      () => {},
      dispatch
    );
    setShowConfirm(false);
  };

  const handleCancel = () => {
    makeDeleteRequest(
      `api/admin/reservations/${reservation.id}`,
      {},
      "การจอง",
      onSuccess,
      () => {},
      dispatch
    );
    setShowCancel(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowConfirm(true)}
        >
          <CheckCircle className="w-4 h-4 mr-1" /> ยืนยันการยืม
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowCancel(true)}>
          <Trash2 className="w-4 h-4 mr-1" /> ยกเลิก
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการยืมหนังสือ"
        description={`ยืนยันการยืม "${reservation.book?.title}" ให้ผู้จองนี้?`}
        confirmText="ยืนยันการยืม"
        variant="default"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmDialog
        open={showCancel}
        title="ยกเลิกการจอง"
        description={`ยืนยันยกเลิกการจอง "${reservation.book?.title}" นี้?`}
        confirmText="ยกเลิกการจอง"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </>
  );
}

export const columns = [
  {
    accessorKey: "book.imageUrl",
    header: "รูปภาพ",
    cell: ({ row }) => {
      const imageUrl = row.original.book?.imageUrl;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt={row.original.book?.title || "book"}
          width={60}
          height={60}
          className="rounded-sm object-cover"
        />
      ) : (
        <div className="w-[60px] h-[60px] bg-muted rounded-sm" />
      );
    },
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
    accessorKey: "numberOfDays",
    header: ({ column }) => <TitleColumn column={column} title="ต้องการยืม" />,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.numberOfDays ?? 3} วัน</span>
    ),
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];