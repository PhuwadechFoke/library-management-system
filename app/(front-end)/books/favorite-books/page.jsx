"use client";
import React, { useEffect, useState } from "react";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import HorizontalCard from "@/components/frontend/HorizontalCard";
import { PaginationDemo } from "@/components/frontend/PaginationDemo";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, Heart, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 20;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDays, setSelectedDays] = useState({});
  const { data: session } = useSession();
  const id = session?.user?.id;
  const router = useRouter();

  const {
    data: favoriteBook,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorite_books"],
    queryFn: () => getData(`all/books/favoriteBook/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) {
      router.push("/login");
    }
  }, [id, router]);

  const books = favoriteBook?.map((item) => item.book);
  const totalPages = books ? Math.ceil(books.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books ? books.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDaysChange = (bookId, value) => {
    setSelectedDays((prev) => ({ ...prev, [bookId]: value }));
  };

  const reserveBook = async (book) => {
    if (!id) {
      router.push("/login");
      return;
    }

    const numberOfDays = selectedDays[book.id] || 3;

    try {
      const response = await fetch("/api/all/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, bookId: book.id, numberOfDays }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถจองหนังสือได้");
      }

      toast.success(`จอง ${book.title} สำเร็จ (${numberOfDays} วัน)`);
      router.push("/books/my-books");
    } catch (error) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการจองหนังสือ");
    }
  };

  return (
    <div className="">
      <HeadTitleBreadcrumb icon={Heart} />
      <div className="border bg-card py-2 px-4 rounded-sm">
        <HorizontalCard books={currentBooks} isLoading={isLoading} />
        {totalPages > 1 ? (
          <PaginationDemo
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        ) : null}
        {books?.length > 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">จองหนังสือจากรายการโปรด</h3>
            </div>
            <div className="flex flex-col gap-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-3"
                >
                  <span className="flex-1 min-w-[150px] text-sm font-medium">
                    {book.title}
                  </span>
                  <select
                    value={selectedDays[book.id] || 3}
                    onChange={(e) => handleDaysChange(book.id, parseInt(e.target.value))}
                    className="rounded-md border px-2 py-1.5 text-sm bg-background"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        ยืม {day} วัน
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => reserveBook(book)}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                  >
                    <BookOpenCheck className="h-4 w-4" />
                    จอง
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}