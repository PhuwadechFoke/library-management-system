"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const {
    data: departmentBooks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departmentBooks"],
    queryFn: () => getData("admin/department-books"),
  });

  return (
    <div>
      <PageHeader
        loading={isLoading}
        heading="หนังสือของแผนก"
        linkTitle="เพิ่มหนังสือแผนก"
        href="/dashboard/department-books/new"
      />
      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error.message}</div>
        ) : (
          <DataTable
            data={departmentBooks || []}
            columns={columns}
            filterKeys={["title", "department"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;