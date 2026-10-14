"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function exportToCSV(data, customHeaders, rowMapper, filename = "report.csv") {
  if (!data || data.length === 0) return;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const statusMap = {
    BORROWED: "กำลังยืม",
    RETURNED: "ส่งคืนแล้ว",
    OVERDUE: "เกินกำหนด",
    LOST: "สูญหาย",
    PENDING: "รอดำเนินการ",
    CONFIRMED: "ยืนยันแล้ว",
    COMPLETED: "เสร็จสิ้น",
    CANCELLED: "ยกเลิกแล้ว",
  };

  // ถ้ามี headers และ rowMapper ส่งมา ให้ใช้ตามนั้น
  const headers = customHeaders || [
    "ชื่อผู้ยืม",
    "รหัสนักศึกษา/บุคลากร",
    "เบอร์โทรศัพท์",
    "ชื่อหนังสือ",
    "วันที่ยืม",
    "กำหนดส่ง",
    "วันที่ส่งคืน",
    "จำนวนวัน",
    "สถานะ",
    "รับคืนแล้ว",
    "ค่าปรับ (บาท)",
    "ค่าเสียหาย (บาท)",
    "ผู้อนุมัติการยืม",
  ];

  const rows = data.map((item, index) => {
    if (rowMapper) {
      return rowMapper(item, index, { formatDate, statusMap });
    }
    return [
      item.borrowerName || "-",
      item.borrowerCodeNumber || "-",
      item.borrowerPhoneNumber || "-",
      item.bookTitle || "-",
      formatDate(item.borrowDate),
      formatDate(item.dueDate),
      formatDate(item.returnDate),
      item.numberOfDays || 0,
      statusMap[item.status] || item.status || "-",
      item.isReturned ? "ใช่" : "ไม่",
      item.fine || 0,
      item.damaged || 0,
      item.approverName || "-",
    ];
  });

  // UTF-8 BOM สำหรับเปิดใน Excel ภาษาไทยไม่เป็นภาษาต่างดาว
  const BOM = "\uFEFF";
  const csvContent =
    BOM +
    [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? "");
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportReportButton({
  data,
  headers,
  rowMapper,
  filenamePrefix = "รายงาน",
}) {
  const today = new Date()
    .toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  const handleExportCSV = () => {
    exportToCSV(data, headers, rowMapper, `${filenamePrefix}_${today}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!data || data.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          ออกรายงาน
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          ดาวน์โหลด Excel (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
          <Printer className="h-4 w-4 mr-2" />
          พิมพ์รายงาน / บันทึก PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
