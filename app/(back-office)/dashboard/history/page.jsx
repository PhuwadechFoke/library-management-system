"use client";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import PageHeaderNoAdd from "@/components/backoffice/PageHeaderNoAdd";
import ExportReportButton from "@/components/backoffice/ExportReportButton";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: borrows, isLoading: isBorrowsLoading } = useQuery({
    queryKey: ["borrows"],
    queryFn: () => getData("admin/borrows"),
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statuses = [
    { value: "ALL", label: "ทั้งหมด" },
    { value: "BORROWED", label: "กำลังยืม" },
    { value: "RETURNED", label: "ส่งคืนแล้ว" },
    { value: "OVERDUE", label: "เกินกำหนด" },
    { value: "LOST", label: "สูญหาย" },
  ];

  const filteredBorrows = useMemo(() => {
    if (!borrows) return [];
    if (statusFilter === "ALL") return borrows;
    return borrows.filter((b) => b.status === statusFilter);
  }, [borrows, statusFilter]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeaderNoAdd loading={isBorrowsLoading} heading="ประวัติการยืมหนังสือ" />
        <div className="pb-2">
          <ExportReportButton
            data={filteredBorrows}
            filenamePrefix="รายงานการยืม"
          />
        </div>
      </div>

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {statuses.map((s) => (
          <Button
            key={s.value}
            variant={statusFilter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label}
            {s.value !== "ALL" && borrows && (
              <span className="ml-1 text-xs opacity-70">
                ({borrows.filter((b) => b.status === s.value).length})
              </span>
            )}
            {s.value === "ALL" && borrows && (
              <span className="ml-1 text-xs opacity-70">({borrows.length})</span>
            )}
          </Button>
        ))}
      </div>

      <div className="py-2">
        {isBorrowsLoading ? (
          <Skeleton className="w-full h-96 mb-2" />
        ) : (
          <DataTable
            data={filteredBorrows}
            columns={columns}
            filterKeys={["borrowerName", "bookTitle", "borrowDate"]}
          />
        )}
      </div>
    </div>
  );
}
