"use client";
import CarouselBook from "@/components/frontend/CarouselBook";
import HeadTitleBreadcrumb from "@/components/frontend/HeadTitleBreadcrumb";
import WideCardCarousel from "@/components/frontend/WideCardCarousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { makeDeleteRequest, makePostRequest } from "@/lib/apiRequest";
import { getData } from "@/lib/getData";
import { queryClient } from "@/lib/react-query-client";
import { useQuery } from "@tanstack/react-query";
import { Heart, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { CoolMode } from "@/components/magicui/cool-mode";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LocalizedText from "@/components/frontend/LocalizedText";

export default function page({ params: { slug } }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    data: book,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: [`books_${slug}`],
    queryFn: () => getData(`all/books/${slug}`),
  });

  const {
    data: favoriteBooks,
    isLoading: isFavoriteBooksLoading,
    error: favoriteBooksError,
  } = useQuery({
    queryKey: [`favorite_books`],
    queryFn: () => getData(`all/books/favoriteBook/${userId}`),
    enabled: !!userId,
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: [`categories/${book?.category?.id}`],
    queryFn: () => getData(`all/categories/${book?.category?.id}`),
    enabled: !!book?.category?.id,
  });


  if (isBookLoading || isFavoriteBooksLoading || isCategoriesLoading) {
    return (
      <div className="bg-card py-4 px-4 rounded-sm w-full">
        <Skeleton className="w-full h-10 mb-2 " />
        <Skeleton className="w-full h-96 mb-2 " />
        <Skeleton className="w-full h-44 mb-2 " />
      </div>
    );
  }

  if (bookError || categoriesError || favoriteBooksError) {
    const errorMessage =
      bookError?.message ||
      categoriesError?.message ||
      favoriteBooksError?.message;
    return <div>Error: {errorMessage}</div>;
  }

  const isFavorite = favoriteBooks?.some((item) => item.bookId === book.id);

  const onSuccess = () => {
    queryClient.invalidateQueries(["favorite-books"]);
  };

  const addToFavorite = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    const data = {
      userId: userId,
      bookId: book.id,
    };
    if (isFavorite) {
      makeDeleteRequest(
        `api/all/books/favoriteBook`,
        data,
        "รายการโปรด",
        onSuccess,
        () => {},
        dispatch
      );
    } else {
      makePostRequest(
        `api/all/books/favoriteBook`,
        data,
        "รายการโปรด",
        onSuccess,
        () => {},
        dispatch
      );
    }
  };



  return (
    <div className="">
      <HeadTitleBreadcrumb icon={X} />
      <div className="w-full rounded-2xl border border-border/70 bg-card/85 p-3 shadow-sm backdrop-blur-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6 grid w-full grid-cols-12 gap-5 py-2 sm:gap-8">
          <div className="col-span-full w-full sm:col-span-5">
            <CarouselBook book={book} />
          </div>
          <div className="col-span-full grid w-full content-center px-2 sm:col-span-7 sm:px-8">
            <div className="mb-5 grid">
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-950/50 dark:text-red-200">
                {book.category.title}
              </span>
              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {book.title}
              </h1>
              <span className="mt-2 text-sm text-muted-foreground">
                ผู้แต่ง {book.author}
              </span>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-background/70 p-3">
                  <span className="block text-xs text-muted-foreground">ราคา</span>
                  <span className="mt-1 block text-lg font-bold text-red-800 dark:text-red-300">
                    {Number(book.price).toLocaleString("th-TH")} บาท
                  </span>
                </div>
                <div className="rounded-xl border bg-background/70 p-3">
                  <span className="block text-xs text-muted-foreground">จำนวนคงเหลือ</span>
                  <span className="mt-1 block text-lg font-bold">
                    {book.remaining} เล่ม
                  </span>
                </div>
              </div>
              <span
                className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  (book.availabilityStatus === "AVAILABLE" ||
                    (book.availabilityStatus == null && book.remaining > 0))
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                    : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                สถานะหนังสือ{" "}
                {book.availabilityStatus === "AVAILABLE" ||
                (book.availabilityStatus == null && book.remaining > 0)
                  ? "ว่าง"
                  : "ไม่ว่าง"}
              </span>
            </div>
            <div className="w-full flex sm:items-center sm:justify-start gap-2">
              <CoolMode
                options={
                  {
                  particle:
                    "https://e7.pngegg.com/pngimages/385/728/png-clipart-emoji-facebook-emoticon-heart-facebook-love-emoji-heart-illustration-miscellaneous-text-thumbnail.png",
                  particleCount: 10,
                }
              }
              >
                <Button
                  variant="outline"
                  onClick={() => addToFavorite()}
                  className={`w-full rounded-xl transition-all duration-200 hover:-translate-y-0.5 sm:w-auto ${
                    isFavorite ? "border-pink-600 bg-pink-600 text-white shadow-md shadow-pink-900/20 dark:bg-pink-800" : "hover:border-pink-500 hover:text-pink-600"
                  }`}
                >
                  <Heart />
                </Button>
              </CoolMode>
            </div>
          </div>
        </div>
        <div className="mb-2 w-full rounded-2xl border bg-background/50 p-4 sm:p-5">
          <h2 className="mb-2 text-lg font-bold"><LocalizedText value="รายละเอียด" /></h2>
          <span className="text-balance leading-7 text-muted-foreground">
            {book.description}
          </span>
        </div>
        {categories?.book?.filter((relatedBook) => relatedBook.id !== book.id)
          .length > 0 && (
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-4 px-4">
              <LocalizedText value="หนังสือที่เกี่ยวข้อง" />
            </h2>
            <WideCardCarousel
              books={categories?.book.filter(
                (relatedBook) => relatedBook.id !== book.id
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
