"use client";

import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import IsMeColumn from "@/components/backoffice/data-table-columns/IsMeColumn";
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
    header: ({ column }) => <TitleColumn column={column} title="ชื่อ-นามสกุล"/> ,
    cell: ({ row }) => <IsMeColumn row={row} accessorKey="fullName"  />,
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
    accessorKey: "emailAddress",
    header: ({ column }) => <TitleColumn column={column} title="อีเมล" />,
  },
  {
    id: "role",
    accessorFn: (profile) => profile.user?.role || "ADMIN",
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
];
