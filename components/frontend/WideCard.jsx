"use client";
import React from "react";
import WideCardCarousel from "./WideCardCarousel";
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function WideCard({
  title,
  books,
  isLoading = false,
  href,
  actionTitle = "books.viewAll",
  showPopularity = false,
}) {
  const { t } = useLanguage();
  return (
    <section className="group/section relative mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md sm:p-5">
      <div className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-gradient-to-b from-red-700 to-red-300 opacity-80" />
      {isLoading ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="py-4 px-20" />
            <Skeleton className="py-4 px-10" />
          </div>
          <div className="mt-2 grid justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              <Skeleton className="w-28 h-36 rounded-sm" />
              <Skeleton className="w-28 h-36 rounded-sm" />
              <Skeleton className="hidden sm:block w-28 h-36 rounded-sm" />
              <Skeleton className="hidden sm:block w-28 h-36 rounded-sm" />
              <Skeleton className="hidden sm:block w-28 h-36 rounded-sm" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-4 flex w-full items-center justify-between gap-3">
            <div className="ml-2 flex items-center gap-3">
              <span className="h-9 w-1 rounded-full bg-red-800 dark:bg-red-500" />
              <h2 className="text-lg font-bold tracking-tight sm:text-xl">{t(title)}</h2>
            </div>
            <Link href={href} className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-red-900/15 bg-background/80 px-4 transition-all hover:-translate-y-0.5 hover:border-red-800/40 hover:bg-red-50 hover:text-red-900 dark:hover:bg-red-950 dark:hover:text-red-100"
              >
                {t(actionTitle)}
              </Button>
            </Link>
          </div>
          <div className="">
            {books && books.length > 0 ? ( // ถ้ามีข้อมูลหนังสือ ให้แสดง Carousel
              <WideCardCarousel books={books} showPopularity={showPopularity} />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed bg-muted/20">
                <div className="text-zinc-500">{t("books.noBooks")}</div>
              </div> // ถ้าไม่มีข้อมูลหนังสือ ให้แสดงข้อความว่าไม่มีข้อมูล
            )}
          </div>
        </div>
      )}
    </section>
  );
}
