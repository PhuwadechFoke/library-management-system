"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import ExportReportButton from "@/components/backoffice/ExportReportButton";

const Page = () => {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: () => getData("admin/books"),
  });

  const headers = [
    "ชื่อหนังสือ",
    "ผู้แต่ง",
    "ราคา (บาท)",
    "จำนวนทั้งหมด",
    "คงเหลือ",
    "พร้อมยืม",
    "วันที่สร้าง",
  ];

  const rowMapper = (item, index, { formatDate }) => [
    item.title || "-",
    item.author || "-",
    item.price || 0,
    item.quantity || 0,
    item.remaining || 0,
    item.active ? "พร้อมยืม" : "ไม่พร้อมยืม",
    formatDate(item.createdAt),
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <PageHeader
          loading={isLoading}
          heading="หนังสือ"
          linkTitle="เพิ่มหนังสือ"
          href="/dashboard/books/new"
        />
        <div className="pb-2 self-end sm:self-auto">
          <ExportReportButton
            data={books || []}
            headers={headers}
            rowMapper={rowMapper}
            filenamePrefix="รายงานสต็อกหนังสือ"
          />
        </div>
      </div>
      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error.message}</div>
        ) : (
          <DataTable
            data={books || []}
            columns={columns}
            filterKeys={["title"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;