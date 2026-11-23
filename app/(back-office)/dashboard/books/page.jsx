"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import ExportReportButton from "@/components/backoffice/ExportReportButton";
import { useLanguage } from "@/context/LanguageContext";
import { getBookStockStatus } from "@/lib/bookStock";

const Page = () => {
  const { t } = useLanguage();
  const [stockFilter, setStockFilter] = useState("all");
  const { data: books, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: () => getData("admin/books"),
  });
  const filteredBooks = useMemo(() => {
    const bookList = Array.isArray(books) ? books : [];
    if (stockFilter === "all") return bookList;
    return bookList.filter(
      (book) => getBookStockStatus(book.remaining) === stockFilter
    );
  }, [books, stockFilter]);

  const headers = [
    "ชื่อหนังสือ",
    "ผู้แต่ง",
    "ราคา (บาท)",
    "จำนวนทั้งหมด",
    "คงเหลือ",
    "สถานะหนังสือ",
    "พร้อมยืม",
    "วันที่สร้าง",
  ];

  const rowMapper = (item, index, { formatDate }) => [
    item.title || "-",
    item.author || "-",
    item.price || 0,
    item.quantity || 0,
    item.remaining || 0,
    item.availabilityStatus === "AVAILABLE" ||
    (item.availabilityStatus == null && item.remaining > 0)
      ? "ว่าง"
      : "ไม่ว่าง",
    item.active ? "พร้อมยืม" : "ไม่พร้อมยืม",
    formatDate(item.createdAt),
  ];

  return (
    <div>
      {/* Header พร้อมปุ่มออกรายงานและปุ่มเพิ่มหนังสืออยู่ข้างๆ กัน */}
      <PageHeader
        loading={isLoading}
        heading="หนังสือ"
        linkTitle="เพิ่มหนังสือ"
        href="/dashboard/books/new"
      >
        <ExportReportButton
          data={books || []}
          headers={headers}
          rowMapper={rowMapper}
          filenamePrefix="รายงานสต็อกหนังสือ"
        />
      </PageHeader>

      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error.message}</div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm">
              <label htmlFor="stock-filter" className="text-sm font-medium text-muted-foreground">
                {t("stock.filterLabel")}
              </label>
              <select
                id="stock-filter"
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="h-9 min-w-40 rounded-xl border border-input bg-background px-3 text-sm shadow-sm"
              >
                <option value="all">{t("stock.filterAll")}</option>
                <option value="low">{t("stock.low")}</option>
                <option value="out">{t("stock.out")}</option>
                <option value="normal">{t("stock.normal")}</option>
              </select>
              <span className="ml-auto text-sm text-muted-foreground">
                {filteredBooks.length} {t("common.items")}
              </span>
            </div>
            <DataTable
              data={filteredBooks}
              columns={columns}
              filterKeys={["title"]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;