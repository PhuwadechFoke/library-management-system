"use client";
import React, { useEffect, useState } from "react";
import { BookText, File } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/lib/sidebarLink";
import { Skeleton } from "../ui/skeleton";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="hidden sm:block border bg-card h-72 py-2 px-4 rounded-sm sticky top-20">
        <Skeleton className="w-full h-8 mb-2 rounded-sm" />
        <Skeleton className="w-full h-56 rounded-sm" />
      </div>
    );
  return (
    <div className=" border bg-card py-2 px-4 rounded-sm sticky top-20 ">
      <h2
        className="text-lg font-bold flex items-center justify-start border-b pb-2 text-custom-text cursor-pointer"
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
                  ? "flex items-center border-l-4 pl-2 my-1.5 font-medium border-custom-border text-custom-text dark:text-zinc-400"
                  : "flex items-center mb-1 rounded-md px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              }
            >
              <Icon className="mr-1 w-4 " />
              <span>{item.title}</span>
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
          <span>คู่มือใช้งาน</span>
        </Link>
      </div>
    </div>
  );
}
