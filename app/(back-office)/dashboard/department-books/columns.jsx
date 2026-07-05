"use client";

import ActionColumn from "@/components/backoffice/data-table-columns/ActionColumn";
import DateCreatedColumn from "@/components/backoffice/data-table-columns/DateCreatedColumn";
import DateCreatedColumnCell from "@/components/backoffice/data-table-columns/DateCreatedColumnCell";
import ImageColumn from "@/components/backoffice/data-table-columns/ImageColumn";
import NumberColumn from "@/components/backoffice/data-table-columns/NumberColumn";
import TitleColumn from "@/components/backoffice/data-table-columns/TitleColumn";

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
    accessorKey: "department",
    header: ({ column }) => <TitleColumn column={column} title="แผนก" />,
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
    header: "จัดการ",
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <ActionColumn
          row={row}
          title="หนังสือแผนก"
          refreshQueryKey="departmentBooks"
          endpoint={`admin/department-books/${book.id}`}
          editEndpoint={`department-books/update/${book.id}`}
        />
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
];