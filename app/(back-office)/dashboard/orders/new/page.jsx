"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import FormHeader from "@/components/backoffice/FormHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";

export default function NewOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [bookId, setBookId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: books, isLoading: booksLoading } = useQuery({ queryKey: ["order-books"], queryFn: () => getData("admin/books") });

  const submit = async (event) => {
    event.preventDefault();
    if (!session?.user?.id) return toast.error("ไม่พบข้อมูลผู้ดูแล");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderById: session.user.id, supplierName, supplierContact, note, items: [{ bookId, quantity: Number(quantity) }] }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success("เพิ่มคำสั่งซื้อเรียบร้อย"); router.push("/dashboard/orders");
    } catch (error) { toast.error(error.message || "ไม่สามารถเพิ่มคำสั่งซื้อได้"); }
    finally { setSubmitting(false); }
  };

  if (booksLoading) return <><FormHeader title="เพิ่มคำสั่งซื้อ" loading /><Skeleton className="h-96 w-full" /></>;
  return <div><FormHeader title="เพิ่มคำสั่งซื้อ" /><form onSubmit={submit} className="w-full space-y-5 rounded-sm border p-4 sm:p-6 md:p-8">
    <label className="block text-sm font-medium">ชื่อร้าน / ผู้จัดจำหน่าย<Input className="mt-1" value={supplierName} onChange={(event) => setSupplierName(event.target.value)} placeholder="เช่น บริษัท/ร้านหนังสือ" required /></label>
    <label className="block text-sm font-medium">ข้อมูลติดต่อผู้จัดจำหน่าย<Input className="mt-1" value={supplierContact} onChange={(event) => setSupplierContact(event.target.value)} placeholder="โทรศัพท์, อีเมล หรือผู้ติดต่อ" /></label>
    <label className="block text-sm font-medium">หนังสือ<select className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 text-sm" value={bookId} onChange={(event) => setBookId(event.target.value)} required><option value="">เลือกหนังสือ</option>{books?.map((book) => <option key={book.id} value={book.id}>{book.title} — {book.price?.toLocaleString()} บาท</option>)}</select></label>
    <label className="block text-sm font-medium">จำนวน (เล่ม)<Input className="mt-1" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
    <label className="block text-sm font-medium">หมายเหตุ<Textarea className="mt-1" value={note} onChange={(event) => setNote(event.target.value)} /></label>
    <div className="flex justify-end"><Button type="submit" disabled={submitting}>{submitting ? "กำลังบันทึก..." : "บันทึกคำสั่งซื้อ"}</Button></div>
  </form></div>;
}
