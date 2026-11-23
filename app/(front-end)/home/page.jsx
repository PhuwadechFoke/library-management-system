"use client";
import WideCard from "@/components/frontend/WideCard";
import React from "react";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
export default function page() {
  const {
    data: booksAll,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["booksAll"],
    queryFn: () => getData("all/books"),
  });

  const {
    data: booksNewBooks,
    isLoading: isLoadingNewBooks,
    error: errorNewBooks,
  } = useQuery({
    queryKey: ["booksNewBooks"],
    queryFn: () => getData("all/books/new-books"),
  });

  const {
    data: popularBooks,
    isLoading: isLoadingPopularBooks,
    error: errorPopularBooks,
  } = useQuery({
    queryKey: ["popularBooks"],
    queryFn: () => getData("all/books/popular"),
  });

  if (errorAll || errorNewBooks || errorPopularBooks) {
    return <div>เกิดข้อผิดพลาดในการโหลดรายการหนังสือ</div>;
  }

  return (
    <div className="space-y-4 pb-4">
        <WideCard
          title={"books.allTitle"}
          books={booksAll}
          isLoading={isLoadingAll}
          href="/books"
        />
        <WideCard
          title={"books.newTitle"}
          books={booksNewBooks}
          isLoading={isLoadingNewBooks}
          href="/books/new-books"
        />
        <WideCard
          title={"books.popularTitle"}
          books={popularBooks}
          isLoading={isLoadingPopularBooks}
          href="/statistics"
          actionTitle="books.viewPopularity"
          showPopularity
        />
    </div>
  );
}
