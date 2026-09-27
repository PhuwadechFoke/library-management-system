"use client";

import Link from "next/link";
import moment from "moment";
import "moment/locale/th";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/backoffice/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";

moment.locale("th");

export default function ReceiptsPage() {
  const { data: receipts, isLoading } = useQuery({ queryKey: ["receipts"], queryFn: () => getData("admin/receipts") });
  return <div><PageHeader loading={isLoading} heading="รายการรับเข้าหนังสือ" linkTitle="รับหนังสือเข้า" href="/dashboard/receipts/new" />
    {isLoading ? <Skeleton className="h-96 w-full" /> : <div className="overflow-x-auto rounded-sm border"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-3">เลขที่ใบสั่งซื้อ</th><th className="p-3">ผู้จัดจำหน่าย</th><th className="p-3">รายการ</th><th className="p-3">วันที่รับเข้า</th></tr></thead><tbody>{receipts?.length ? receipts.map((receipt) => <tr key={receipt.id} className="border-b"><td className="p-3"><Link className="text-blue-600 hover:underline" href={`/dashboard/orders/${receipt.orderId}`}>{receipt.order.orderNumber}</Link></td><td className="p-3">{receipt.order.supplierName || "ไม่ระบุ"}</td><td className="p-3">{receipt.order.items.map((item) => `${item.book.title} × ${item.quantity}`).join(", ")}</td><td className="p-3">{moment(receipt.receivedAt).format("lll")}</td></tr>) : <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">ยังไม่มีรายการรับเข้า</td></tr>}</tbody></table></div>}
  </div>;
}
