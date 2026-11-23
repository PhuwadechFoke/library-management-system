import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeadDashboard({
  quantity,
  remaining,
  totalBooks,
  totalActive,
  borrowCount,
  pendingReservations = 0,
}) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="group w-full rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">{t("books.total")}</h1>
            <div className="text-3xl font-bold m-2">
              {quantity.toLocaleString()}
            </div>
            <div>{t("books.unit")}</div>
          </div>
        </div>
      </div>
      <div className="group w-full rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">{t("books.remaining")}</h1>
            <div className="text-3xl font-bold m-2">
              {remaining.toLocaleString()}
            </div>
            <div>{t("books.unit")}</div>
          </div>
        </div>
      </div>

      <div className="group w-full rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">{t("books.borrowed")}</h1>
            <div className="text-3xl font-bold m-2">{borrowCount}</div>
            <div>{t("books.unit")}</div>
          </div>
        </div>
      </div>
      <div className="group w-full rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium">{t("books.available")}</h1>
            <div className="text-3xl font-bold m-2">
              {totalActive.toLocaleString()} <span className="text-lg sm:text-3xl">/</span> {totalBooks.toLocaleString()}
            </div>
            <div>{t("books.unit")}</div>
          </div>
        </div>
      </div>
      <Link href="/dashboard/reservations" className="w-full cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-amber-500/20 hover:shadow-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-sm font-medium text-amber-600 dark:text-amber-400">{t("admin.pendingReservations")}</h1>
            <div className="text-3xl font-bold m-2 text-amber-600 dark:text-amber-400">
              {pendingReservations}
            </div>
            <div className="text-amber-600 dark:text-amber-400">{t("common.items")}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
