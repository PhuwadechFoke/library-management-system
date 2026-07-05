"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import DepartmentBookForm from "@/components/backoffice/form/DepartmentBookForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";

export default function UpdateDepartmentBook({ params: { id } }) {
  const {
    data: departmentBook,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`departmentBook_${id}`],
    queryFn: () => getData(`admin/department-books/${id}`),
  });

  if (isLoading)
    return (
      <div className="w-full mb-4 border bg-card rounded-sm">
        <Skeleton className="w-full h-96 mb-2 " />
      </div>
    );
  if (error) return <div>เกิดข้อผิดพลาด: {error.message}</div>;

  return (
    <div>
      <FormHeader title="แก้ไขหนังสือแผนก" loading={false} />
      <DepartmentBookForm updateData={departmentBook} loading={false} />
    </div>
  );
}