"use client";
import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import ExportReportButton from "@/components/backoffice/ExportReportButton";

const Page = () => {
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getData("admin/orders"),
  });

  const headers = [
    "เลขที่คำสั่งซื้อ",
    "ร้านค้า/ผู้จัดจำหน่าย",
    "จำนวนรายการ",
    "ยอดรวม (บาท)",
    "สถานะ",
    "วันที่สร้าง",
  ];

  const rowMapper = (item, index, { formatDate, statusMap }) => [
    item.orderNumber || "-",
    item.supplierName || "-",
    item.items?.length || 0,
    item.totalAmount || 0,
    statusMap[item.status] || item.status || "-",
    formatDate(item.createdAt),
  ];

  return (
    <div>
      {/* Header พร้อมปุ่มออกรายงานและปุ่มเพิ่มคำสั่งซื้ออยู่ข้างๆ กัน */}
      <PageHeader
        loading={isOrdersLoading}
        heading="รายการสั่งซื้อหนังสือ"
        linkTitle="เพิ่มคำสั่งซื้อ"
        href="/dashboard/orders/new"
      >
        <ExportReportButton
          data={orders || []}
          headers={headers}
          rowMapper={rowMapper}
          filenamePrefix="รายงานการสั่งซื้อหนังสือ"
        />
      </PageHeader>

      <div className="py-2">
        {isOrdersLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : (
          <DataTable
            data={orders || []}
            columns={columns}
            filterKeys={["orderNumber", "status"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
