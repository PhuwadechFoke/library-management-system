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

  const reserveBook = async (book) => {
    if (!id) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/all/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, bookId: book.id }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถจองหนังสือได้");
      }

      toast.success(`จอง ${book.title} สำเร็จ`);
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
            <div className="flex flex-wrap gap-2">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => reserveBook(book)}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  จอง {book.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
