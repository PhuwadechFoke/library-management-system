"use client";
import React, { useEffect, useState } from "react";
import { BookText, File } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/lib/sidebarLink";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="hidden sm:block sticky top-20 h-72 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <Skeleton className="w-full h-8 mb-2 rounded-sm" />
        <Skeleton className="w-full h-56 rounded-sm" />
      </div>
    );
  return (
    <div className="sticky top-20 rounded-2xl border border-border/70 bg-card/80 px-3 py-3 shadow-sm backdrop-blur-sm">
      <h2
        className="mb-2 flex cursor-pointer items-center justify-start rounded-xl border-b border-border/70 px-2 pb-3 pt-1 text-base font-bold text-custom-text transition-colors hover:text-red-700 dark:hover:text-red-300"
        onClick={() => router.push("/home")}
      >
        <BookText className="mr-1 w-4 " /> UDVC
      </h2>
      <div className="mt-2">
        {sidebarLinks.map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/books" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              href={item.href}
              key={i}
              className={
                isActive
                  ? "my-1 flex items-center rounded-xl border border-red-900/10 bg-red-50/80 px-3 py-2 font-semibold text-red-900 shadow-sm dark:border-red-200/10 dark:bg-red-950/40 dark:text-red-200"
                  : "mb-1 flex items-center rounded-xl px-3 py-2 text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted/70 hover:text-foreground"
              }
            >
              <Icon className="mr-1 w-4 " />
              <span>{t(item.title)}</span>
            </Link>
          );
        })}
        <Link
          href="/คู่มือการใช้งานเว็บไซต์การยืม.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={"flex mb-1 cursor-pointer"}
        >
          <File className="mr-1 w-4 " />
          <span>{t("nav.manual")}</span>
        </Link>
      </div>
    </div>
  );
}
