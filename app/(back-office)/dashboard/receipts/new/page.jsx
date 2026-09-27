"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import FormHeader from "@/components/backoffice/FormHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getData } from "@/lib/getData";

export default function NewReceiptPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => getData("admin/orders") });
  const confirmedOrders = useMemo(() => orders?.filter((order) => order.status === "CONFIRMED") || [], [orders]);
  const selectedOrder = confirmedOrders.find((order) => order.id === orderId);
  const receive = async (event) => {
    event.preventDefault();
    if (!session?.user?.id) return toast.error("ไม่พบผู้รับเข้า");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/receipts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, receivedById: session.user.id, note }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success("รับหนังสือเข้าและอัปเดตสต็อกแล้ว"); router.push("/dashboard/receipts");
    } catch (error) { toast.error(error.message || "ไม่สามารถรับหนังสือเข้าได้"); }
    finally { setSubmitting(false); }
  };
  if (isLoading) return <><FormHeader title="รับหนังสือเข้า" loading /><Skeleton className="h-96 w-full" /></>;
  return <div><FormHeader title="รับหนังสือเข้า" /><form onSubmit={receive} className="space-y-5 rounded-sm border p-4 sm:p-6"><label className="block text-sm font-medium">ใบสั่งซื้อที่ยืนยันแล้ว<select className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 text-sm" value={orderId} onChange={(event) => setOrderId(event.target.value)} required><option value="">เลือกใบสั่งซื้อ</option>{confirmedOrders.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} — {order.supplierName || "ไม่ระบุผู้จัดจำหน่าย"}</option>)}</select></label>
    {selectedOrder && <div className="rounded-md bg-muted p-4 text-sm"><p className="font-semibold">รายการที่จะเพิ่มเข้าสต็อก</p><ul className="mt-2 list-disc pl-5">{selectedOrder.items.map((item) => <li key={item.id}>{item.book.title} × {item.quantity} เล่ม</li>)}</ul></div>}
    {!confirmedOrders.length && <p className="text-sm text-muted-foreground">ยังไม่มีใบสั่งซื้อที่ยืนยันแล้ว กรุณายืนยันใบสั่งซื้อก่อนรับเข้า</p>}
    <label className="block text-sm font-medium">หมายเหตุการรับเข้า<Textarea className="mt-1" value={note} onChange={(event) => setNote(event.target.value)} /></label><div className="flex justify-end"><Button type="submit" disabled={!orderId || submitting}>{submitting ? "กำลังบันทึก..." : "ยืนยันรับเข้า"}</Button></div>
  </form></div>;
}
