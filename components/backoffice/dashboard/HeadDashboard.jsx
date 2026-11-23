"use client";

import {
  BookCopy,
  BookOpenCheck,
  BookUp,
  ClipboardList,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const metrics = [
  {
    key: "dashboard.totalCopies",
    valueKey: "quantity",
    icon: BookCopy,
    tone: "text-sky-700 bg-sky-500/10 dark:text-sky-300",
  },
  {
    key: "dashboard.availableCopies",
    valueKey: "remaining",
    icon: BookOpenCheck,
    tone: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    key: "dashboard.currentBorrows",
    valueKey: "activeBorrows",
    icon: BookUp,
    tone: "text-violet-700 bg-violet-500/10 dark:text-violet-300",
  },
  {
    key: "dashboard.pendingReservations",
    valueKey: "pendingReservations",
    icon: ClipboardList,
    tone: "text-amber-700 bg-amber-500/10 dark:text-amber-300",
  },
];

export default function HeadDashboard({
  quantity,
  remaining,
  activeBorrows,
  pendingReservations,
}) {
  const { t } = useLanguage();
  const values = { quantity, remaining, activeBorrows, pendingReservations };

  return (
    <section
      aria-label={t("dashboard.overview")}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map(({ key, valueKey, icon: Icon, tone }) => (
        <article
          key={key}
          className="group rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{t(key)}</p>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">
            {Number(values[valueKey] || 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("books.unit")}</p>
        </article>
      ))}
    </section>
  );
}
