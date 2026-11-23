"use client";

import Link from "next/link";
import { CalendarClock, CheckCircle2, ClipboardList, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

function localDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isActiveBorrow(borrow) {
  return !borrow.isReturned && borrow.status !== "RETURNED" && borrow.status !== "LOST";
}

export default function TodayTasks({
  borrows,
  reservations,
  isLoading,
  error,
}) {
  const { t } = useLanguage();

  if (isLoading) return <Skeleton className="h-60 w-full rounded-2xl" />;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          {t("dashboard.tasksLoadError")}: {error.message}
        </CardContent>
      </Card>
    );
  }

  const todayKey = localDateKey(new Date());
  const activeBorrows = (Array.isArray(borrows) ? borrows : []).filter(isActiveBorrow);
  const overdueBorrows = activeBorrows.filter((borrow) => {
    const dueDateKey = localDateKey(borrow.dueDate);
    return dueDateKey && dueDateKey < todayKey;
  });
  const dueTodayBorrows = activeBorrows.filter(
    (borrow) => localDateKey(borrow.dueDate) === todayKey
  );
  const pendingReservations = Array.isArray(reservations) ? reservations : [];

  const tasks = [
    {
      key: "dashboard.overdueTasks",
      hint: "dashboard.overdueHint",
      count: overdueBorrows.length,
      icon: Clock,
      href: "/dashboard/history",
      tone: "border-red-500/20 bg-red-500/[0.04] text-red-700 dark:text-red-300",
      entries: overdueBorrows.slice(0, 2).map((borrow) => borrow.bookTitle || borrow.book?.title),
    },
    {
      key: "dashboard.dueTodayTasks",
      hint: "dashboard.dueTodayHint",
      count: dueTodayBorrows.length,
      icon: CalendarClock,
      href: "/dashboard/history",
      tone: "border-amber-500/20 bg-amber-500/[0.04] text-amber-700 dark:text-amber-300",
      entries: dueTodayBorrows.slice(0, 2).map((borrow) => borrow.bookTitle || borrow.book?.title),
    },
    {
      key: "dashboard.reservationTasks",
      hint: "dashboard.reservationHint",
      count: pendingReservations.length,
      icon: ClipboardList,
      href: "/dashboard/reservations",
      tone: "border-sky-500/20 bg-sky-500/[0.04] text-sky-700 dark:text-sky-300",
      entries: pendingReservations.slice(0, 2).map((reservation) => reservation.bookTitle || reservation.book?.title),
    },
  ];

  const totalTasks = tasks.reduce((sum, task) => sum + task.count, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border/60 px-5 py-4 sm:px-6">
        <div>
          <CardTitle className="text-base sm:text-lg">{t("dashboard.todayTasks")}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.todayTasksDescription")}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {totalTasks} {t("common.items")}
        </span>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 md:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <Link
              key={task.key}
              href={task.href}
              className={`group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${task.tone}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{t(task.key)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t(task.hint)}</p>
                </div>
                <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{task.count}</p>
              {task.count > 0 && (
                <div className="mt-2 space-y-1">
                  {task.entries.filter(Boolean).map((title, index) => (
                    <p key={`${title}-${index}`} className="truncate text-xs text-muted-foreground">
                      {title}
                    </p>
                  ))}
                  {task.count > task.entries.length && (
                    <p className="text-xs text-muted-foreground">
                      {t("dashboard.moreTasks").replace("{count}", String(task.count - task.entries.length))}
                    </p>
                  )}
                </div>
              )}
            </Link>
          );
        })}
        {totalTasks === 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300 md:col-span-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {t("dashboard.noTasks")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
