"use client";

import ActionColumn from "@/components/backoffice/data-table-columns/ActionColumn";
import ActionStatusColumn from "@/components/backoffice/data-table-columns/ActionStatusColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import DateUpdatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnUpdatedCell";
import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import NumberColumn from "@/components/backoffice/data-table-columns/NumberColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";
import RoleColumn from "@/components/backoffice/data-table-columns/RoleColumn";

export const columns = [
  {
    accessorKey: "profileImage",
    header: "โปรไฟล์",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="profileImage" />,
  },
  {
    accessorKey: "username",
    header: ({ column }) => <TitleColumn column={column} title="ชื่อ" />,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <TitleColumn column={column} title="ชื่อ-นามสกุล" />,
  },
  {
    accessorKey: "educationLevel",
    header: ({ column }) => <TitleColumn column={column} title="ระดับ" />,
  },
  {
    accessorKey: "educationYear",
    header: ({ column }) => <TitleColumn column={column} title="ปี" />,
  },
  {
    accessorKey: "branch",
    header: ({ column }) => <TitleColumn column={column} title="สาขา" />,
  },
  {
    accessorKey: "emailAddress",
    header: ({ column }) => <TitleColumn column={column} title="อีเมล" />,
  },
  {
    id: "role",
    accessorFn: (profile) => profile.user?.role || "USER",
    header: ({ column }) => <TitleColumn column={column} title="สิทธิ์" />,
    cell: ({ row }) => <RoleColumn row={row} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DateCreatedColumn column={column} title="เข้าร่วม" />,
    cell: ({ row }) => (
      <DateCreatedColumnCell row={row} accessorKey="createdAt" />
    ),
  },
  {
    header: "จัดการ",
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <ActionColumn
          row={row}
          title="ผู้ใช้"
          refreshQueryKey="users"
          endpoint={`admin/users/${user.userId}`}
          editEndpoint={`users/update/${user.userId}`}
        />
      );
    },
  },
];