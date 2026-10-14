"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeaderNoAdd from "@/components/backoffice/PageHeaderNoAdd";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import ExportReportButton from "@/components/backoffice/ExportReportButton";

const Page = () => {
  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getData("admin/reservations"),
    refetchInterval: 5000,
  });

  const markedIdsRef = useRef(new Set());

  // เมื่อเข้าหน้านี้ ให้ mark ทุกรายการที่ยังไม่อ่านเป็น "อ่านแล้ว" แบบ silent ไม่ให้ toast กวนใจ
  useEffect(() => {
    if (Array.isArray(reservations) && reservations.length > 0) {
      const unreadList = reservations.filter(
        (r) => !r.isRead && !markedIdsRef.current.has(r.id)
      );

      unreadList.forEach((r) => {
        markedIdsRef.current.add(r.id);
        fetch(`/api/admin/reservations/${r.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).catch((err) => console.error("Error marking reservation read:", err));
      });
    }
  }, [reservations]);

  const headers = [
    "ชื่อหนังสือ",
    "ผู้จอง",
    "เบอร์โทรศัพท์",
    "รหัสประจำตัว",
    "ระยะเวลาที่ต้องการยืม (วัน)",
    "สถานะการเปิดดู",
    "วันที่จอง",
  ];

  const rowMapper = (item, index, { formatDate }) => [
    item.bookTitle || item.book?.title || "-",
    item.borrowerName || "-",
    item.borrowerPhoneNumber || item.user?.phoneNumber || "-",
    item.borrowerCodeNumber || item.user?.codeNumber || "-",
    item.numberOfDays || 3,
    item.isRead ? "อ่านแล้ว" : "ใหม่",
    formatDate(item.createdAt),
  ];

  return (
    <div>
      <PageHeaderNoAdd loading={isLoading} heading="การจองหนังสือ">
        <ExportReportButton
          data={reservations || []}
          headers={headers}
          rowMapper={rowMapper}
          filenamePrefix="รายงานการจองหนังสือ"
        />
      </PageHeaderNoAdd>

      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2" />
        ) : error ? (
          <div className="p-4 border rounded-sm bg-destructive/10 text-destructive text-sm">
            เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message || "ไม่สามารถเชื่อมต่อได้"}
          </div>
        ) : (
          <DataTable
            data={reservations || []}
            columns={columns}
            filterKeys={["bookTitle", "borrowerName"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;