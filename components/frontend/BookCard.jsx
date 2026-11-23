"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BookCard({ book, basePath = "/books" }) {
  const { t } = useLanguage();
  const isAvailable =
    book.availabilityStatus === "AVAILABLE" ||
    (book.availabilityStatus == null && book.remaining > 0);

  return (
    <Link
      passHref
      href={`${basePath}/${book.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-800/25 hover:bg-card hover:shadow-xl hover:shadow-red-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
    >
      <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted/40 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <Image
          src={book.imageUrl}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 25vw, 18vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
            isAvailable
              ? "bg-emerald-50/95 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-200"
              : "bg-red-50/95 text-red-800 dark:bg-red-950/90 dark:text-red-200"
          }`}
        >
          {isAvailable ? t("books.availableNow") : t("books.unavailable")}
        </span>
        <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1 text-xs font-medium text-white">
            <Eye className="h-3.5 w-3.5" />
            {t("common.viewDetails")}
          </span>
        </span>
      </div>
      <div className="mt-3 flex flex-1 items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground/90 transition-colors group-hover:text-red-800 dark:group-hover:text-red-300">
          {book.title}
        </p>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-800" />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("books.remaining")}: {book.remaining ?? 0}
      </p>
    </Link>
  );
}