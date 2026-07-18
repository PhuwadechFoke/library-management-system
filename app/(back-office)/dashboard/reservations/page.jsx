"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeaderNoAdd from "@/components/backoffice/PageHeaderNoAdd";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { makePutRequest } from "@/lib/apiRequest";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();
  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getData("admin/reservations"),
    refetchInterval: 3000, // ดึงข้อมูลใหม่ทุก 3 วินาที (real-time)
  });

  // เมื่อเข้าหน้านี้ ให้ mark ทุกรายการที่ยังไม่อ่านเป็น "อ่านแล้ว"
  React.useEffect(() => {
    if (reservations?.length) {
      const unread = reservations.filter((r) => !r.isRead);
      unread.forEach((r) => {
        makePutRequest(
          `api/admin/reservations/${r.id}`,
          {},
          "",
          () => {},
          () => {},
          dispatch
        );
      });
    }
  }, [reservations, dispatch]);

  return (
    <div>
      <PageHeaderNoAdd loading={isLoading} heading="การจองหนังสือ" />
      <div className="py-2">
        {isLoading ? (
          <Skeleton className="w-full h-96 mb-2" />
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error.message}</div>
        ) : (
          <DataTable
            data={reservations || []}
            columns={columns}
            filterKeys={["book.title", "user.fullName"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;