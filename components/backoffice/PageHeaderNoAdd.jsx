import React from "react";
import Heading from "./Heading";
import { Skeleton } from "../ui/skeleton";

export default function PageHeaderNoAdd({ loading, heading, children }) {
  if (loading) {
    return (
      <Skeleton className="sm:flex items-center justify-between py-6 sm:py-8 px-6 sm:px-12 mb-2"></Skeleton>
    );
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 sm:py-6 px-6 border rounded-sm sm:px-12 mb-2 bg-card">
      <Heading title={heading} className="mb-0" />
      {children && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
