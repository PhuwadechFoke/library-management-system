"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle2, Receipt } from "lucide-react";
import moment from "moment";
import "moment/locale/th";
import { nameWebsite } from "@/lib/nameWebsite";
moment.locale("th");

export default function FineReceiptModal({
  isOpen,
  onClose,
  borrow,
  overdueFine = 0,
  damagedFine = 0,
  totalFine = 0,
  overdueDays = 0,
  isLost = false,
  returnApproverName,
}) {
  const receiptRef = useRef(null);

  if (!borrow) return null;

  const receiptNo = `REC-${borrow.id ? borrow.id.slice(0, 8).toUpperCase() : Date.now().toString().slice(-8)}`;
  const borrowerName = `${borrow.borrower?.prefix || ""} ${borrow.borrower?.fullName || borrow.borrower?.username || "-"}`.trim();
  const currentDate = moment().format("LLLL");

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden border">
        {/* กล่องบิลสำหรับพิมพ์ / ดู */}
        <div ref={receiptRef} className="p-6 bg-card text-card-foreground">
          {/* Header บิล */}
          <div className="text-center border-b pb-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Receipt className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">{nameWebsite}</h2>
            </div>
            <p className="text-xs text-muted-foreground">ใบเสร็จรับเงิน / ใบรับชำระค่าปรับ</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              เลขที่: <span className="font-semibold text-foreground">{receiptNo}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{currentDate}</p>
          </div>

          {/* ข้อมูลผู้ชำระ */}
          <div className="bg-muted/40 p-3 rounded-sm mb-4 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ผู้ชำระเงิน:</span>
              <span className="font-semibold">{borrowerName}</span>
            </div>
            {borrow.borrower?.codeNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">รหัสประจำตัว:</span>
                <span>{borrow.borrower.codeNumber}</span>
              </div>
            )}
            {borrow.borrower?.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">เบอร์โทรศัพท์:</span>
                <span>{borrow.borrower.phoneNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">หนังสือ:</span>
              <span className="font-semibold text-right line-clamp-1 max-w-[220px]">
                {borrow.book?.title}
              </span>
            </div>
          </div>

          {/* ตารางรายการค่าปรับ */}
          <div className="border rounded-sm overflow-hidden mb-4 text-xs">
            <table className="w-full text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr>
                  <th className="py-2 px-3">รายการ</th>
                  <th className="py-2 px-3 text-right">จำนวนเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {overdueFine > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-medium">ค่าปรับคืนหนังสือเกินกำหนด</div>
                      <div className="text-[10px] text-muted-foreground">
                        เกินกำหนด {overdueDays} วัน
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {overdueFine.toLocaleString()}
                    </td>
                  </tr>
                )}
                {damagedFine > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-medium">
                        {isLost ? "ค่าปรับหนังสือสูญหาย" : "ค่าชดใช้ความเสียหาย"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {isLost ? "กรณีหนังสือสูญหาย" : "กรณีหนังสือชำรุด"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {damagedFine.toLocaleString()}
                    </td>
                  </tr>
                )}
                {overdueFine === 0 && damagedFine === 0 && (
                  <tr>
                    <td className="py-2.5 px-3">ค่าธรรมเนียม/บริการ</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">0</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-muted/50 border-t font-semibold">
                <tr>
                  <td className="py-2.5 px-3 text-sm">ยอดชำระสุทธิ</td>
                  <td className="py-2.5 px-3 text-right text-base font-bold text-red-600 dark:text-red-400 font-mono">
                    {totalFine.toLocaleString()} บาท
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* สถานะชำระ & ลายเซ็นเจ้าหน้าที่ */}
          <div className="flex items-center justify-between border-t pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>ชำระเงินเรียบร้อยแล้ว</span>
            </div>
            <div className="text-right text-[11px] text-muted-foreground">
              <div>เจ้าหน้าที่ผู้รับชำระ</div>
              <div className="font-semibold text-foreground mt-0.5">
                {returnApproverName || "เจ้าหน้าที่ห้องสมุด"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer สำหรับกดพิมพ์หรือปิด (จะถูกซ่อนเวลาสั่ง Print ด้วย CSS) */}
        <DialogFooter className="p-4 bg-muted/20 border-t flex flex-row items-center justify-between gap-2 no-print">
          <Button variant="outline" size="sm" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบเสร็จ (Print)</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
