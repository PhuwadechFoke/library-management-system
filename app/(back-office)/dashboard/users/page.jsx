"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeaderNoAdd from "@/components/backoffice/PageHeaderNoAdd";
import ExportReportButton from "@/components/backoffice/ExportReportButton";

const Page = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getData("admin/users"),
  });

  const headers = [
    "ชื่อผู้ใช้",
    "ชื่อ-นามสกุล",
    "ระดับการศึกษา",
    "ชั้นปี",
    "อีเมล",
    "เบอร์โทรศัพท์",
    "วันที่เข้าร่วม",
  ];

  const rowMapper = (item, index, { formatDate }) => [
    item.username || "-",
    `${item.prefix || ""} ${item.fullName || ""}`.trim() || "-",
    item.educationLevel || "-",
    item.educationYear || "-",
    item.emailAddress || item.user?.email || "-",
    item.phoneNumber || "-",
    formatDate(item.createdAt),
  ];

  return (
    <div>
      {/* Header พร้อมปุ่มออกรายงานในกล่อง Header เดียวกัน */}
      <PageHeaderNoAdd loading={isLoading} heading="ข้อมูลผู้ใช้งาน">
        <ExportReportButton
          data={users || []}
          headers={headers}
          rowMapper={rowMapper}
          filenamePrefix="รายงานข้อมูลสมาชิก"
        />
      </PageHeaderNoAdd>

      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error.message}</div>
        ) : (
          <DataTable
            data={users || []}
            columns={columns}
            filterKeys={["username", "fullName"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
