"use client";

import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import HorizontalCard from "@/components/frontend/HorizontalCard";
import { PaginationDemo } from "@/components/frontend/PaginationDemo";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Building2, CheckCircle2, Layers3 } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 20;

export default function DepartmentDetailPage({ params: { slug } }) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: department,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`department_${slug}`],
    queryFn: () => getData(`all/departments/${slug}`),
  });

  const books = department?.book || [];
  const totalRemaining = useMemo(
    () => books.reduce((sum, book) => sum + (book.remaining || 0), 0),
    [books]
  );
  const totalQuantity = useMemo(
    () => books.reduce((sum, book) => sum + (book.quantity || 0), 0),
    [books]
  );

  if (error) return <div>ไม่สามารถโหลดข้อมูลแผนกได้</div>;

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, endIndex);
  const coverImage = department?.imageUrl || "/Bibliophile-amico.png";

  return (
    <div>
      <HeadTitleBreadcrumb icon={Building2} />

      <section className="mb-3 overflow-hidden rounded-md border bg-card">
        {isLoading ? (
          <Skeleton className="h-72 rounded-md" />
        ) : (
          <div className="grid gap-5 bg-gradient-to-br from-red-50 via-white to-sky-50 p-5 sm:p-8 md:grid-cols-[1fr_240px] md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-red-200 bg-white/80 px-3 py-1 text-xs font-medium text-red-800 shadow-sm">
                <Building2 className="mr-2 h-4 w-4" />
                หนังสือประจำแผนก
              </div>
              <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
                {department?.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                {department?.description ||
                  "รวมหนังสือและแหล่งเรียนรู้ของแผนก เลือกดูรายละเอียดหนังสือและตรวจสอบจำนวนคงเหลือก่อนทำรายการยืม"}
              </p>

              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-md border bg-white/75 p-3 shadow-sm">
                  <div className="flex items-center text-zinc-500">
                    <BookOpen className="mr-2 h-4 w-4" />
                    รายการหนังสือ
                  </div>
                  <div className="mt-1 text-2xl font-bold text-red-800">{books.length}</div>
                </div>
                <div className="rounded-md border bg-white/75 p-3 shadow-sm">
                  <div className="flex items-center text-zinc-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    พร้อมยืม
                  </div>
                  <div className="mt-1 text-2xl font-bold text-sky-800">{totalRemaining}</div>
                </div>
                <div className="rounded-md border bg-white/75 p-3 shadow-sm">
                  <div className="flex items-center text-zinc-500">
                    <Layers3 className="mr-2 h-4 w-4" />
                    จำนวนทั้งหมด
                  </div>
                  <div className="mt-1 text-2xl font-bold text-zinc-800">{totalQuantity}</div>
                </div>
              </div>
            </div>

            <div className="mx-auto flex h-52 w-full max-w-60 items-center justify-center rounded-md bg-white/70 shadow-sm">
              <Image
                src={coverImage}
                alt={department?.title || "Department"}
                width={240}
                height={220}
                className="h-48 w-52 object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        )}
      </section>

      <div className="rounded-md border bg-card px-4 py-4">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold text-zinc-900">รายการหนังสือในแผนก</h2>
          {!isLoading ? (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {books.length} เล่ม
            </span>
          ) : null}
        </div>

        <HorizontalCard
           books={currentBooks}
            isLoading={isLoading}
           basePath="/books/departments/book"
          />

        {totalPages > 1 ? (
          <PaginationDemo
            totalPages={totalPages}
            handlePageChange={setCurrentPage}
            currentPage={currentPage}
          />
        ) : null}
      </div>
    </div>
  );
}
