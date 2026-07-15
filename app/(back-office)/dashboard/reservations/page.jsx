"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";

export default function ReservationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: () => getData("admin/reservations"),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-xl font-semibold">รายการจองหนังสือ</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          รายการจองจากผู้ใช้จะปรากฏที่นี่เพื่อให้แอดมินติดตามได้ทันที
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : error ? (
        <div className="rounded-xl border p-4 text-sm text-red-500">
          เกิดข้อผิดพลาด: {error.message}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="p-3">รายละเอียดการจอง</th>
                <th className="p-3">ผู้จอง</th>
                <th className="p-3">วันที่จอง</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item) => {
                  const book = item.book;
                  const bookImage =
                    book?.imageUrls?.[0] || book?.imageUrl || "/images/book-placeholder.png";

                  return (
                    <tr key={item.id} className="border-t align-top">
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={bookImage}
                            alt={book?.title || "หนังสือ"}
                            className="h-16 w-12 rounded-md object-cover shadow-sm"
                          />
                          <div className="space-y-1">
                            <div className="font-medium">{book?.title || "-"}</div>
                            <div className="text-xs text-muted-foreground">
                              {book?.author ? `ผู้แต่ง: ${book.author}` : "ไม่มีข้อมูลผู้แต่ง"}
                            </div>
                            {book?.category ? (
                              <div className="text-xs text-muted-foreground">
                                หมวดหมู่: {book.category}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">
                          {item.user?.fullName || item.user?.username || item.userId || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.user?.email || "-"}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-2">
                          <div>{new Date(item.createdAt).toLocaleString("th-TH")}</div>
                          {book?.id ? (
                            <Link
                              href={`/dashboard/books/borrow/${book.id}`}
                              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                              ไปยังการยืมหนังสือ
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">
                    ยังไม่มีรายการจองหนังสือ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
