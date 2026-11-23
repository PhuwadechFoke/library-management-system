"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { File, Menu } from "lucide-react";
import { BookText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/lib/sidebarLink";
import SwitchTheme from "@/components/SwitchTheme";
import LanguageSwitcher from "@/components/frontend/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { nameWebsite } from "@/lib/nameWebsite";

export default function HamburgerMenu() {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="เปิดเมนูนำทาง"
          className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-900/15 bg-white/75 text-red-900 shadow-sm shadow-red-950/5 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-red-800/30 hover:bg-red-50 hover:shadow-md hover:shadow-red-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700/50 focus-visible:ring-offset-2 active:translate-y-0 dark:border-white/10 dark:bg-zinc-900/75 dark:text-red-200 dark:hover:bg-red-950/50"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-red-700/10 to-amber-500/10 transition-transform duration-300 group-hover:scale-x-100" />
          <Menu className="relative h-5 w-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="rounded-r-3xl border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl"
      >
        <SheetHeader className={" relative"}>
          <SwitchTheme
            customClass="block sm:hidden absolute -top-3 -left-3"
            inSheet={true}
          />
          <LanguageSwitcher customClass="block sm:hidden absolute -top-3 -right-3" />
          <SheetTitle className="flex items-center justify-center border-b border-border/70 pb-3 text-base">
            <BookText className="mr-1 w-5 shrink-0" /> {nameWebsite}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center mt-4 relative">
          <div>
            {sidebarLinks.map((item, i) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/books" && pathname.startsWith(`${item.href}/`));

              return (
                <Link href={item.href} key={i} className="flex flex-col">
                  <SheetClose>
                    <div
                      className={
                        isActive
                          ? "flex border-l-4 pl-2.5 mb-5 font-bold border-zinc-600 text-zinc-700 dark:text-zinc-400"
                          : "flex mb-4"
                      }
                    >
                      <Icon className="mr-2 w-4" />
                      <span>{t(item.title)}</span>
                    </div>
                  </SheetClose>
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
      </SheetContent>
    </Sheet>
  );
}
