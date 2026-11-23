import React from "react";
import Heading from "./Heading";
import { Skeleton } from "../ui/skeleton";

export default function PageHeaderNoAdd({ loading, heading, children }) {
  if (loading) {
    return (
      <Skeleton className="mb-4 h-20 rounded-2xl"></Skeleton>
    );
  }
  return (
    <div className="admin-page-header relative mb-4 flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 px-5 py-5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:px-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-700 via-orange-500 to-amber-300" />
      <Heading title={heading} className="mb-0" />
      {children && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
