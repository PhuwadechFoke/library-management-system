"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/th";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { isLoading } from "@/redux/slices/loadingFullScreenSlice";
moment.locale("th");

const statusMap = {
  PENDING: { label: "รอดำเนินการ", className: "border-yellow-500 text-yellow-600 dark:text-yellow-400" },
  CONFIRMED: { label: "ยืนยันแล้ว", className: "border-blue-500 text-blue-600 dark:text-blue-400" },
  COMPLETED: { label: "เสร็จสิ้น", className: "border-green-500 text-green-600 dark:text-green-400" },
  CANCELLED: { label: "ยกเลิก", className: "border-red-500 text-red-600 dark:text-red-400" },
};

export default function Page({ params: { id } }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getData(`admin/orders/${id}`),
  });

  if (orderError) return <div className="p-6">Error: {orderError.message}</div>;

  const handleUpdateStatus = async (newStatus) => {
    const statusLabels = {
      CONFIRMED: "ยืนยัน",
      COMPLETED: "ดำเนินการเสร็จสิ้น",
      CANCELLED: "ยกเลิก",
    };

    Swal.fire({
      title: "คุณแน่ใจมั้ย?",
      text: `คุณต้องการ${statusLabels[newStatus]}คำสั่งซื้อนี้ใช่หรือไม่!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "CANCELLED" ? "#d33" : "#3085d6",
      cancelButtonColor: "#999",
      confirmButtonText: "ใช่ ยืนยัน!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(isLoading(true));
        try {
          const res = await fetch(`/api/admin/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            toast.error(errorData.message || "เกิดข้อผิดพลาด");
            dispatch(isLoading(false));
            return;
          }

          toast.success(`อัปเดตสถานะเป็น "${statusLabels[newStatus]}" สำเร็จ`);
          queryClient.invalidateQueries({ queryKey: ["order", id] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          dispatch(isLoading(false));
        } catch (err) {
          toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
          dispatch(isLoading(false));
        }
      }
    });
  };

  const currentStatus = order?.status;
  const statusConfig = statusMap[currentStatus] || { label: currentStatus, className: "" };
  const isFinalStatus = currentStatus === "COMPLETED" || currentStatus === "CANCELLED";

  return (
    <div>
      {isOrderLoading || !order ? (
        <div className="p-6">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="w-full h-96" />
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center py-4 sm:py-6 px-6 border rounded-sm sm:px-12 mb-2">
            <h2 className="text-xl font-semibold">
              รายละเอียดคำสั่งซื้อ
            </h2>
            <button
              className="hover:text-red-500 transition-all"
              onClick={() => router.back()}
            >
              <X />
            </button>
          </div>

          <div className="grid sm:grid-cols-12 gap-2 sm:gap-5">
            {/* ข้อมูลคำสั่งซื้อ */}
            <div className="sm:col-span-8 py-4 sm:py-6 px-6 border rounded-sm">
              <div className="text-lg font-semibold text-center mb-3">
                ข้อมูลคำสั่งซื้อ
              </div>
              <div className="space-y-2">
                <p>
                  <strong>เลขที่คำสั่งซื้อ :</strong> {order.orderNumber}
                </p>
                <p>
                  <strong>สถานะ :</strong>{" "}
                  <Badge variant="outline" className={statusConfig.className}>
                    {statusConfig.label}
                  </Badge>
                </p>
                <p>
                  <strong>วันที่สร้าง :</strong>{" "}
                  {moment(order.createdAt).format("lll")}
                </p>
                <p>
                  <strong>อัปเดตล่าสุด :</strong>{" "}
                  {moment(order.updatedAt).format("lll")}
                </p>
                {order.note && (
                  <p>
                    <strong>หมายเหตุ :</strong> {order.note}
                  </p>
                )}
                <p className="text-lg font-semibold mt-4">
                  <strong>ยอดรวมทั้งหมด :</strong>{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {order.totalAmount?.toLocaleString() || 0}
                  </span>{" "}
                  บาท
                </p>
              </div>
            </div>

            {/* ข้อมูลผู้เกี่ยวข้อง */}
            <div className="sm:col-span-4 space-y-2 sm:space-y-5">
              <div className="py-4 sm:py-6 px-6 border rounded-sm">
                <div className="text-lg font-semibold mb-3 text-center">
                  ข้อมูลผู้สร้าง / สมาชิก
                </div>
                <p>
                  <strong>ผู้สร้างคำสั่งซื้อ :</strong> {order.orderById}
                </p>
                <p>
                  <strong>ผู้จัดจำหน่าย :</strong> {order.supplierName || "ไม่ระบุ"}
                </p>
                {order.supplierContact && (
                  <p><strong>ติดต่อ :</strong> {order.supplierContact}</p>
                )}
              </div>
            </div>
          </div>

          {/* รายการหนังสือ */}
          <div className="my-2 py-4 sm:py-6 px-6 border rounded-sm">
            <div className="text-lg font-semibold text-center mb-4">
              รายการหนังสือ ({order.items?.length || 0} รายการ)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">ชื่อหนังสือ</th>
                    <th className="text-left py-2 px-3">ผู้แต่ง</th>
                    <th className="text-right py-2 px-3">จำนวน</th>
                    <th className="text-right py-2 px-3">ราคา/เล่ม</th>
                    <th className="text-right py-2 px-3">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3">{item.book?.title || "-"}</td>
                      <td className="py-2 px-3">{item.book?.author || "-"}</td>
                      <td className="py-2 px-3 text-right">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">
                        {item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {item.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan={5} className="py-2 px-3 text-right">
                      ยอดรวม :
                    </td>
                    <td className="py-2 px-3 text-right">
                      {order.totalAmount?.toLocaleString()} บาท
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ปุ่มเปลี่ยนสถานะ */}
          {!isFinalStatus && (
            <div className="my-2 py-4 sm:py-6 px-6 border rounded-sm">
              <div className="flex flex-wrap justify-end gap-2">
                {currentStatus === "PENDING" && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus("CONFIRMED")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      ยืนยันคำสั่งซื้อ
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus("CANCELLED")}
                      variant="destructive"
                    >
                      ยกเลิกคำสั่งซื้อ
                    </Button>
                  </>
                )}
                {currentStatus === "CONFIRMED" && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus("COMPLETED")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      ดำเนินการเสร็จสิ้น
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus("CANCELLED")}
                      variant="destructive"
                    >
                      ยกเลิกคำสั่งซื้อ
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
