"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/scrollbar";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
export default function WideCardCarousel({ books, showPopularity = false }) {
  const booksLimited = books.slice(0, 8);
  const { t } = useLanguage();
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={10}
      breakpoints={{
        400: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        490: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        540: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        780: {
          slidesPerView: 5,
          spaceBetween: 0,
        },
      }}
      className="mb-6 mySwiper"
    >
      {booksLimited.map((book, i) => {

        return(
          <SwiperSlide key={i}>
          <Link
            href={`/books/${book.slug}`}
            className="group relative mx-1 flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-3 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-800/25 hover:bg-background hover:shadow-lg hover:shadow-red-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative overflow-hidden rounded-xl bg-muted/40 shadow-md ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-lg group-hover:ring-red-900/15 dark:ring-white/10">
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={200}
                height={100}
                loading="lazy"
                className="h-36 w-28 object-cover transition-transform duration-500 ease-out group-hover:scale-110 sm:h-40 sm:w-32"
              />
              {showPopularity && (
                <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow">
                  #{i + 1}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Eye className="h-4 w-4" />
                  {t("common.viewDetails")}
                </span>
              </span>
            </div>
            <p className="mt-3 mx-1 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground/90 transition-colors group-hover:text-red-800 dark:group-hover:text-red-300">{book.title}</p>
            {showPopularity && (
              <span className="mt-1 text-xs text-muted-foreground">
                {book.borrowCount} {t("stats.times")}
              </span>
            )}

          </Link>
        </SwiperSlide>
        )
      })}
    </Swiper>
  );
}
