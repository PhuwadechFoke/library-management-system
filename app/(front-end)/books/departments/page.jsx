"use client";

import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Building2, LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const fallbackImages = ["/Bibliophile-amico.png", "/Bibliophile-bro.png"];

export default function DepartmentsPage() {
  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departmentsAll"],
    queryFn: () => getData("all/departments"),
  });

  if (error) return <div>ไม่สามารถโหลดข้อมูลแผนกได้</div>;

  const totalBooks =
    departments?.reduce((sum, department) => sum + (department.book?.length || 0), 0) || 0;

  return (
    <div>
      <HeadTitleBreadcrumb icon={Building2} />

      <section className="mb-3 overflow-hidden rounded-md border bg-card">
        <div className="grid gap-4 bg-gradient-to-br from-red-50 via-white to-sky-50 px-5 py-6 sm:px-8 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-red-200 bg-white/80 px-3 py-1 text-xs font-medium text-red-800 shadow-sm">
              <Building2 className="mr-2 h-4 w-4" />
              Department Books
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
              หนังสือของแผนก
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              เลือกดูหนังสือตามแผนก พร้อมจำนวนหนังสือ รายละเอียด และรายการหนังสือที่พร้อมให้ยืม
            </p>
            <div className="mt-5 grid max-w-md grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border bg-white/75 p-3 shadow-sm">
                <div className="flex items-center text-zinc-500">
                  <LibraryBig className="mr-2 h-4 w-4" />
                  จำนวนแผนก
                </div>
                <div className="mt-1 text-2xl font-bold text-red-800">
                  {departments?.length || 0}
                </div>
              </div>
              <div className="rounded-md border bg-white/75 p-3 shadow-sm">
                <div className="flex items-center text-zinc-500">
                  <BookOpen className="mr-2 h-4 w-4" />
                  หนังสือทั้งหมด
                </div>
                <div className="mt-1 text-2xl font-bold text-sky-800">{totalBooks}</div>
              </div>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <Image
              src="/Bibliophile-bro.png"
              alt="Department books"
              width={260}
              height={220}
              className="h-52 w-52 object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      <div className="rounded-md border bg-card p-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44 rounded-md" />
            ))}
          </div>
        ) : departments?.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {departments.map((department, index) => {
              const bookCount = department.book?.length || 0;
              const availableCount =
                department.book?.reduce((sum, book) => sum + (book.remaining || 0), 0) || 0;
              const imageUrl =
                department.imageUrl || fallbackImages[index % fallbackImages.length];

              return (
                <Link
                  key={department.id}
                  href={`/books/departments/${department.slug}`}
                  className="group overflow-hidden rounded-md border bg-white transition hover:-translate-y-0.5 hover:border-custom-border hover:shadow-md"
                >
                  <div className="grid min-h-44 grid-cols-[112px_1fr] gap-4 p-4">
                    <div className="flex h-32 w-28 items-center justify-center rounded-md bg-gradient-to-br from-red-50 to-sky-50">
                      <Image
                        src={imageUrl}
                        alt={department.title}
                        width={160}
                        height={160}
                        className="h-28 w-24 rounded-sm object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="line-clamp-2 text-lg font-semibold text-zinc-900">
                          {department.title}
                        </h2>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-custom-text" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {department.description || "รวมหนังสือและสื่อการเรียนรู้ประจำแผนก"}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md bg-zinc-50 p-2">
                          <div className="text-zinc-500">หนังสือ</div>
                          <div className="text-lg font-bold text-red-800">{bookCount}</div>
                        </div>
                        <div className="rounded-md bg-zinc-50 p-2">
                          <div className="text-zinc-500">พร้อมยืม</div>
                          <div className="text-lg font-bold text-sky-800">{availableCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center text-zinc-500">
            ยังไม่มีข้อมูลแผนก
          </div>
        )}
      </div>
    </div>
  );
}
