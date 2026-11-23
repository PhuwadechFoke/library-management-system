"use client";
import React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function FormHeader({ title, loading = false }) {
  const router = useRouter();
  const { t } = useLanguage();
  if (loading) {
    return (
      <Skeleton className="mb-4 h-20 rounded-2xl"></Skeleton>
    );
  }
  return (
    <div className="admin-page-header mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-card/85 px-5 py-4 shadow-sm backdrop-blur-sm sm:px-7">
      <h2 className="text-xl font-bold tracking-tight">{t(title)}</h2>
      <button
        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"
        onClick={() => router.back()}
      >
        <X />
      </button>
    </div>
  );
}
