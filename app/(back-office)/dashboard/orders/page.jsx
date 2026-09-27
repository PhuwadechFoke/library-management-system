"use client";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getData("admin/orders"),
  });

  return (
    <div>
      {/* Header */}
      <PageHeader
        loading={isOrdersLoading}
        heading="รายการสั่งซื้อหนังสือ"
        linkTitle="เพิ่มคำสั่งซื้อ"
        href="/dashboard/orders/new"
      />
      <div className="py-2">
        {isOrdersLoading ? (
          <Skeleton className="w-full h-96 mb-2 " />
        ) : (
          <DataTable
            data={orders}
            columns={columns}
            filterKeys={["orderNumber", "status"]}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
