"use client";
import React from "react";
import { SquareLibrary } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CategorySidebar() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    data: categories = [], // ตั้งค่าเริ่มต้นเป็นอาร์เรย์ว่างเพื่อป้องกันข้อผิดพลาด
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: [`categoriesAll`],
    queryFn: () => getData(`all/categories`),
  });

  if (categoriesError) return <div>Error: {categoriesError.message}</div>;

  return (
    <div className="sticky top-20">
      {isCategoriesLoading ? (
        <div className="h-72 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm">
          <Skeleton className="w-full h-8 mb-2 rounded-sm" />
          <Skeleton className="w-full h-56 rounded-sm" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-card/80 px-3 py-3 shadow-sm backdrop-blur-sm">
          <h2
            className="mb-2 flex cursor-pointer items-center rounded-xl border-b border-border/70 px-2 pb-3 pt-1 text-base font-bold text-custom-text transition-colors hover:text-red-700 dark:hover:text-red-300"
            onClick={() => router.push("/books/categories-books")}
          >
            <SquareLibrary className="mr-1 w-4" /> {t("nav.categories")}
          </h2>
          <div className="mt-2 grid">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  href={`/books/categories-books/${category.slug}`}
                  key={category.id}
                  className="flex items-center rounded-xl px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted/70 hover:text-foreground"
                >
                  <span className="line-clamp-1">{category.title}</span>
                </Link>
              ))
            ) : (
              <div className="flex justify-center items-center h-60">
                <div className="text-zinc-500">{t("common.noCategories")}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
