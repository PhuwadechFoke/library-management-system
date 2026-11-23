"use client";

import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, ArrowRight, CheckCircle2, Images } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { getBookStockStatus, LOW_STOCK_THRESHOLD } from "@/lib/bookStock";

function BookThumbnail({ book }) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl =
    book.imageUrl ||
    (Array.isArray(book.imageUrls) ? book.imageUrls[0] : null);

  return (
    <span className="relative flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-muted/60 shadow-sm">
      {imageUrl && !hasImageError ? (
        <Image
          src={imageUrl}
          alt={book.title || ""}
          fill
          sizes="44px"
          className="object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <Images className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      )}
    </span>
  );
}

export default function LowStockBooks({ books, isLoading, error }) {
  const { t } = useLanguage();

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          {t("stock.loadError")}: {error.message}
        </CardContent>
      </Card>
    );
  }

  const lowStockBooks = (Array.isArray(books) ? books : [])
    .map((book) => ({ ...book, stockStatus: getBookStockStatus(book.remaining) }))
    .filter((book) => book.stockStatus === "out" || book.stockStatus === "low")
    .sort((a, b) => Number(a.remaining) - Number(b.remaining));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border/60 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-base sm:text-lg">{t("stock.alertTitle")}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("stock.thresholdNote")} · {LOW_STOCK_THRESHOLD} {t("books.unit")}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/books"
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium text-custom-text transition-colors hover:bg-red-500/10"
        >
          {t("stock.manage")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {lowStockBooks.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/5 px-4 py-5 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{t("stock.allHealthy")}</span>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {lowStockBooks.slice(0, 6).map((book) => {
              const isOutOfStock = book.stockStatus === "out";
              return (
                <li key={book.id}>
                  <Link
                    href={`/dashboard/books/update/${book.id}`}
                    className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/60 sm:px-3"
                  >
                    <BookThumbnail book={book} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium transition-colors group-hover:text-custom-text">
                        {book.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {isOutOfStock ? t("stock.out") : t("stock.low")}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isOutOfStock
                          ? "bg-red-500/10 text-red-700 dark:text-red-300"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {book.remaining} {t("books.unit")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {lowStockBooks.length > 6 && (
          <Link
            href="/dashboard/books"
            className="mt-2 block rounded-lg px-3 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            {t("stock.moreItems").replace("{count}", String(lowStockBooks.length - 6))}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
