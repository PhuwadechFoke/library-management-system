"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Clock3,
  Medal,
  UsersRound,
} from "lucide-react";
import { getData } from "@/lib/getData";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

const COLORS = ["#b91c1c", "#d97706", "#0f766e", "#2563eb", "#7c3aed"];

function StatCard({ icon: Icon, label, value, tone = "red", hint }) {
  const toneStyles = {
    red: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
    amber:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-800/[0.04] transition-transform duration-500 group-hover:scale-150 dark:bg-white/[0.03]" />
      <CardContent className="relative flex items-center gap-4 p-5 sm:p-6">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles[tone]} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {Number(value || 0).toLocaleString()}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-muted/40 to-transparent px-5 py-4 sm:px-6">
        <CardTitle className="flex items-center gap-3 text-base font-semibold sm:text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-800/10 text-red-800 dark:bg-red-300/10 dark:text-red-300">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-3 pb-4 pt-5 sm:h-80 sm:px-5">
        {children}
      </CardContent>
    </Card>
  );
}

export default function StatisticsPage() {
  const { language, t } = useLanguage();
  const displayDate = new Intl.DateTimeFormat(
    language === "th" ? "th-TH" : "en-US",
    { dateStyle: "medium" }
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-statistics"],
    queryFn: () => getData("all/statistics"),
  });

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-destructive">
        {t("stats.loadError")}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <HeadTitleBreadcrumb icon={BarChart3} />
        <Skeleton className="h-36 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    );
  }

  const popularBooks = Array.isArray(data.popularBooks) ? data.popularBooks : [];
  const frequentBorrowers = Array.isArray(data.frequentBorrowers)
    ? data.frequentBorrowers
    : [];
  const overdueBooks = Array.isArray(data.overdueBooks) ? data.overdueBooks : [];

  return (
    <div className="space-y-5 pb-8">
      <HeadTitleBreadcrumb icon={BarChart3} />

      <section className="relative isolate overflow-hidden rounded-3xl border border-red-950/10 bg-gradient-to-br from-white via-orange-50/80 to-red-50/80 p-5 shadow-sm dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-red-950/30 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full border border-red-900/10 dark:border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-14 -z-10 h-44 w-44 rounded-full border border-red-900/10 dark:border-white/10" />
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-white/70 px-3 py-1 text-xs font-semibold text-red-800 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:text-red-200">
          <Activity className="h-3.5 w-3.5" />
          {t("stats.overview")}
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("สถิติห้องสมุด")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {t("stats.description")}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <StatCard
            icon={BookOpen}
            label={t("stats.totalBorrows")}
            value={data.totalBorrows}
            hint={t("stats.borrowCount")}
          />
          <StatCard
            icon={Clock3}
            label={t("stats.overdue")}
            value={data.overdueCount}
            tone="amber"
            hint={t("stats.overdueHint")}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t("stats.popularChart")} icon={Medal}>
          {popularBooks.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularBooks}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  horizontal={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  dataKey="title"
                  type="category"
                  width={95}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) =>
                    value.length > 14 ? `${value.slice(0, 13)}…` : value
                  }
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.55)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    boxShadow: "0 12px 30px rgb(0 0 0 / 0.12)",
                  }}
                  formatter={(value) => [
                    `${value} ${t("stats.times")}`,
                    t("stats.borrowCount"),
                  ]}
                />
                <Bar
                  dataKey="borrowCount"
                  name={t("stats.borrowCount")}
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                >
                  {popularBooks.map((book, index) => (
                    <Cell key={book.id} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label={t("common.noData")} />
          )}
        </ChartCard>

        <ChartCard title={t("stats.frequentChart")} icon={UsersRound}>
          {frequentBorrowers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={frequentBorrowers}
                margin={{ top: 8, right: 8, left: -18, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="displayName"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.55)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    boxShadow: "0 12px 30px rgb(0 0 0 / 0.12)",
                  }}
                  formatter={(value) => [
                    `${value} ${t("stats.times")}`,
                    t("stats.borrowCount"),
                  ]}
                />
                <Bar
                  dataKey="borrowCount"
                  name={t("stats.borrowCount")}
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                >
                  {frequentBorrowers.map((borrower, index) => (
                    <Cell
                      key={`${borrower.displayName}-${index}`}
                      fill={COLORS[(index + 2) % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label={t("common.noData")} />
          )}
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ListCard
          title="หนังสือยอดนิยม"
          icon={Medal}
          items={popularBooks}
          empty={t("stats.noBorrows")}
          render={(book, index) => (
            <Link
              href={`/books/${book.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-800/20 hover:bg-red-50/60 hover:shadow-sm dark:hover:bg-red-950/20"
            >
              <span className="flex min-w-0 items-center gap-3">
                <RankBadge index={index} />
                <span className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-red-800 dark:group-hover:text-red-200">
                  {book.title}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {book.borrowCount} {t("stats.times")}
              </span>
            </Link>
          )}
        />
        <ListCard
          title="ผู้ยืมบ่อย"
          icon={UsersRound}
          items={frequentBorrowers}
          empty={t("stats.noBorrows")}
          render={(borrower, index) => (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
              <span className="flex min-w-0 items-center gap-3">
                <RankBadge index={index} />
                <span className="line-clamp-1 text-sm font-medium">
                  {borrower.displayName}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {borrower.borrowCount} {t("stats.times")}
              </span>
            </div>
          )}
        />
      </section>

      <ListCard
        className="border-red-900/10 dark:border-red-200/10"
        title="รายการค้างคืน"
        icon={AlertTriangle}
        items={overdueBooks}
        empty={t("stats.noOverdue")}
        render={(book) => (
          <Link
            href={`/books/${book.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-red-900/10 bg-red-50/50 p-3 transition-all duration-200 hover:border-red-800/25 hover:bg-red-50 dark:border-red-200/10 dark:bg-red-950/20 dark:hover:bg-red-950/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-red-800 dark:group-hover:text-red-200">
                {book.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("stats.dueDate")}{" "}
                {displayDate.format(new Date(book.dueDate))}
              </p>
            </div>
            <span className="w-fit shrink-0 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
              {t("stats.overdueBy")} {book.daysOverdue} {t("stats.days")}
            </span>
          </Link>
        )}
      />
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
      <BarChart3 className="h-8 w-8 opacity-40" />
      {label}
    </div>
  );
}

function RankBadge({ index }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
        index === 0
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {index === 0 ? <Medal className="h-4 w-4" /> : `#${index + 1}`}
    </span>
  );
}

function ListCard({ title, icon: Icon, items, render, empty, className = "" }) {
  const { t } = useLanguage();

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-muted/40 to-transparent px-5 py-4 sm:px-6">
        <CardTitle className="flex items-center gap-3 text-base font-semibold sm:text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-800/10 text-red-800 dark:bg-red-300/10 dark:text-red-300">
            <Icon className="h-4 w-4" />
          </span>
          {t(title)}
          <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 p-4 sm:p-5">
        {items.length ? (
          items.map((item, index) => (
            <div key={item.id || `${item.displayName}-${index}`}>
              {render(item, index)}
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border/70 py-8 text-center text-sm text-muted-foreground">
            {empty}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
