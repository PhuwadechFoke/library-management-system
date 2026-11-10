"use client";

import { useQuery } from "@tanstack/react-query";
import FormHeader from "@/components/backoffice/FormHeader";
import UserForm from "@/components/backoffice/form/UserForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";

export default function UpdateUser({ params: { id } }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getData(`admin/users/${id}`),
    retry: false,
  });

  if (error) {
    return <div className="p-4">เกิดข้อผิดพลาด: {error.message}</div>;
  }

  return (
    <div>
      <FormHeader title="แก้ไขข้อมูลผู้ใช้งาน" loading={isLoading} />
      {isLoading ? (
        <Skeleton className="mb-2 h-96 w-full" />
      ) : user?.message ? (
        <div className="p-4">{user.message}</div>
      ) : (
        <UserForm updateData={user} />
      )}
    </div>
  );
}
