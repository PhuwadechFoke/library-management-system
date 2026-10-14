import React from "react";
import Heading from "./Heading";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function PageHeader({
  loading,
  heading,
  linkTitle,
  href,
  children,
}) {
  if (loading) {
    return (
      <Skeleton className="sm:flex items-center justify-between py-6 sm:py-8 px-6 sm:px-12 mb-2"></Skeleton>
    );
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 sm:py-6 px-6 border rounded-sm sm:px-12 mb-2 bg-card">
      <Heading title={heading} className="mb-0" />
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {children}
        {linkTitle && href && (
          <Link href={href} className="w-full sm:w-auto">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span>{linkTitle}</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
