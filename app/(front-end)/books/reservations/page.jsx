"use client";
import React, { useEffect, useState } from "react";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import { PaginationDemo } from "@/components/frontend/PaginationDemo";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 20;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDays, setSelectedDays] = useState({});
  const [reservingBookId, setReservingBookId] = useState(null);
  const { data: session } = useSession();
  const id = session?.user?.id;
  const router = useRouter();

  const {
    data: books,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booksAll"],
    queryFn: () => getData("all/books"),
  });

  useEffect(() => {
    if (!id) {
      router.push("/login");
    }
  }, [id, router]);

  // กรองหนังสือที่ค้นหา
  const filteredBooks = books
    ? books.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDaysChange = (bookId, value) => {
    setSelectedDays((prev) => ({ ...prev, [bookId]: value }));
  };

  const reserveBook = async (book) => {
    if (!id) {
      router.push("/login");
      return;
    }

    if (book.remaining <= 0) {
      toast.error("หนังสือเล่มนี้ไม่มีคงเหลือ");
      return;
    }

    const numberOfDays = selectedDays[book.id] || 3;
    setReservingBookId(book.id);

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

      toast.success(`จอง "${book.title}" สำเร็จ (${numberOfDays} วัน)`);
      router.push("/books/my-books");
    } catch (error) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการจองหนังสือ");
    } finally {
      setReservingBookId(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <HeadTitleBreadcrumb icon={BookOpenCheck} />
        <div className="border bg-card py-4 px-4 rounded-sm">
          <Skeleton className="w-full h-10 mb-4 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-28 h-36 rounded-sm mb-2" />
                <Skeleton className="w-20 h-4 rounded-sm mb-1" />
                <Skeleton className="w-24 h-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeadTitleBreadcrumb icon={BookOpenCheck} />
      <div className="border bg-card py-4 px-4 rounded-sm">
        {/* ช่องค้นหา */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาหนังสือที่ต้องการจอง..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-md border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* จำนวนผลลัพธ์ */}
        <div className="mb-3 text-sm text-muted-foreground">
          พบ {filteredBooks.length} รายการ
          {searchTerm && ` สำหรับ "${searchTerm}"`}
        </div>

        {/* รายการหนังสือแบบ Card Grid */}
        {currentBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentBooks.map((book) => (
              <div
                key={book.id}
                className="group flex flex-col items-center rounded-lg border bg-background p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* รูปปกหนังสือ */}
                <div className="relative mb-2">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={200}
                    height={100}
                    loading="lazy"
                    className="object-cover w-28 h-36 rounded-sm group-hover:scale-105 transition-all duration-300"
                  />
                  {/* Badge คงเหลือ */}
                  <span
                    className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ${
                      book.remaining > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {book.remaining > 0 ? book.remaining : "หมด"}
                  </span>
                </div>

                {/* ชื่อหนังสือ */}
                <p className="text-sm font-medium line-clamp-1 text-center w-full mb-0.5">
                  {book.title}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 text-center w-full mb-2">
                  {book.author || "-"}
                </p>

                {/* เลือกจำนวนวัน */}
                <select
                  value={selectedDays[book.id] || 3}
                  onChange={(e) =>
                    handleDaysChange(book.id, parseInt(e.target.value))
                  }
                  className="w-full rounded-md border px-2 py-1 text-xs bg-background mb-2 text-center"
                  disabled={book.remaining <= 0}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>
                      ยืม {day} วัน
                    </option>
                  ))}
                </select>

                {/* ปุ่มจอง */}
                <button
                  onClick={() => reserveBook(book)}
                  disabled={book.remaining <= 0 || reservingBookId === book.id}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 ${
                    book.remaining <= 0
                      ? "opacity-40 cursor-not-allowed border-muted text-muted-foreground bg-muted"
                      : reservingBookId === book.id
                      ? "opacity-70 cursor-wait border-primary/30 text-foreground"
                      : "border-primary/30 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  }`}
                >
                  <BookOpenCheck className="h-3.5 w-3.5" />
                  {reservingBookId === book.id
                    ? "กำลังจอง..."
                    : book.remaining <= 0
                    ? "หนังสือหมด"
                    : "จองหนังสือ"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="text-center text-muted-foreground">
              <BookOpenCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>ไม่พบหนังสือที่ค้นหา</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <PaginationDemo
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
