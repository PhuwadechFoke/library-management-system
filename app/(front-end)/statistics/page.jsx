"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, Clock3, Medal, UsersRound } from "lucide-react";
import { getData } from "@/lib/getData";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const thaiDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" });
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function StatCard({ icon: Icon, label, value, tone = "text-primary" }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><Icon className={`h-9 w-9 ${tone}`} /><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div></CardContent></Card>;
}

export default function StatisticsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["public-statistics"], queryFn: () => getData("all/statistics") });
  if (error) return <p className="p-4 text-destructive">ไม่สามารถโหลดสถิติได้</p>;
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-72 w-full" /></div>;

  return <div>
    <HeadTitleBreadcrumb icon={BarChart3} />
    <section className="rounded-lg border bg-card p-5"><h1 className="text-2xl font-bold">สถิติห้องสมุด</h1><p className="mt-1 text-sm text-muted-foreground">ข้อมูลการยืมหนังสือและรายการที่ค้างคืน</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><StatCard icon={BookOpen} label="รายการยืมทั้งหมด" value={data.totalBorrows} /><StatCard icon={Clock3} label="รายการค้างคืน" value={data.overdueCount} tone="text-destructive" /></div>
    </section>

    {/* ส่วนของกราฟ (Charts) */}
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Medal className="h-5 w-5" />หนังสือยอดนิยม (กราฟ)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {data.popularBooks.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popularBooks} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="borrowCount" name="จำนวนครั้งที่ยืม" radius={[0, 4, 4, 0]}>
                  {data.popularBooks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">ไม่มีข้อมูล</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><UsersRound className="h-5 w-5" />ผู้ยืมบ่อย (กราฟ)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {data.frequentBorrowers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.frequentBorrowers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="displayName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrowCount" name="จำนวนครั้งที่ยืม" radius={[4, 4, 0, 0]}>
                  {data.frequentBorrowers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">ไม่มีข้อมูล</div>
          )}
        </CardContent>
      </Card>
    </div>

    {/* ส่วนของรายการ (Lists) */}
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ListCard title="หนังสือยอดนิยม" icon={Medal} items={data.popularBooks} render={(book, index) => <Link href={`/books/${book.slug}`} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted"><span className="line-clamp-1"><b className="mr-2">#{index + 1}</b>{book.title}</span><span className="ml-3 shrink-0 text-sm text-muted-foreground">{book.borrowCount} ครั้ง</span></Link>} empty="ยังไม่มีข้อมูลการยืม" />
      <ListCard title="ผู้ยืมบ่อย" icon={UsersRound} items={data.frequentBorrowers} render={(borrower, index) => <div className="flex items-center justify-between rounded-md border p-3"><span className="line-clamp-1"><b className="mr-2">#{index + 1}</b>{borrower.displayName}</span><span className="ml-3 shrink-0 text-sm text-muted-foreground">{borrower.borrowCount} ครั้ง</span></div>} empty="ยังไม่มีข้อมูลการยืม" />
    </div>
    <ListCard className="mt-4" title="รายการค้างคืน" icon={Clock3} items={data.overdueBooks} render={(book) => <Link href={`/books/${book.slug}`} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted"><div><p className="font-medium">{book.title}</p><p className="text-sm text-muted-foreground">กำหนดคืน {thaiDate.format(new Date(book.dueDate))}</p></div><span className="ml-3 shrink-0 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">เกิน {book.daysOverdue} วัน</span></Link>} empty="ไม่มีรายการค้างคืน" />
  </div>;
}

function ListCard({ title, icon: Icon, items, render, empty, className = "" }) {
  return <Card className={className}><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Icon className="h-5 w-5" />{title}</CardTitle></CardHeader><CardContent className="space-y-3">{items.length ? items.map((item, index) => <div key={item.id || `${item.displayName}-${index}`}>{render(item, index)}</div>) : <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>}</CardContent></Card>;
}
