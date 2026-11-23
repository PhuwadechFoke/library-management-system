"use client";
import React, { useEffect, useState } from "react";
import {
  Album,
  Book,
  BookCheck,
  BookText,
  Heart,
  House,
  MessageSquareText,
  SquareLibrary,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import { adminSidebarLinks } from "@/lib/adminSidebarLinks";
import LanguageSwitcher from "@/components/frontend/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
// import { useRouter } from 'next/router';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="hidden h-72 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm sm:block lg:sticky lg:top-24">
        <Skeleton className="mb-3 h-8 rounded-lg" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  // const router = useRouter();
  return ( 
    <div className="admin-sidebar rounded-2xl border border-border/70 bg-card/80 px-3 py-3 shadow-sm backdrop-blur-sm lg:sticky lg:top-24">
      <h2 className="flex cursor-pointer items-center justify-start rounded-xl border-b border-border/70 px-2 pb-3 pt-1 text-base font-bold text-custom-text transition-colors hover:text-red-700 dark:hover:text-red-300"
         onClick={() => router.push("/home")}
      >
        <BookText className="mr-2 h-4 w-4" /> UDVC
      </h2>
      <div className="mt-2">
        {adminSidebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={i}
              className={`admin-sidebar-link my-1 flex items-center rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                item.href === pathname ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`))
                  ? "border border-red-900/10 bg-red-50/80 font-semibold text-red-900 shadow-sm dark:border-red-200/10 dark:bg-red-950/40 dark:text-red-200"
                  : "text-muted-foreground hover:translate-x-0.5 hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <Icon className="mr-2 h-4 w-4 shrink-0" />
              <span>{t(item.title)}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t flex justify-center">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
