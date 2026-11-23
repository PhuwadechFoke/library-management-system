"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar, Autoplay } from "swiper/modules";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    imageUrl: "/Bibliophile-amico.png",
    title: "banner.title",
    description: "banner.description",
    tag: "Library Management",
    accent: "from-red-50 via-white to-orange-50",
  },
  {
    imageUrl: "/Bibliophile-bro.png",
    title: "banner.reading",
    description: "banner.newBooks",
    tag: "New Books",
    accent: "from-orange-50 via-white to-red-50",
  },
];

export default function Banner() {
  const { t } = useLanguage();
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      scrollbar={{
        hide: true,
      }}
      rewind={true}
      autoplay={{
        delay: 8000,
        disableOnInteraction: false,
      }}
      modules={[Scrollbar, Autoplay]}
      className="mb-5 overflow-hidden rounded-3xl border border-zinc-200/80 bg-card shadow-xl shadow-red-950/5 dark:border-zinc-800 sm:mb-6"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={`${slide.imageUrl}-${i}`}>
          <section
            className={`relative min-h-[340px] overflow-hidden bg-gradient-to-br ${slide.accent} px-4 py-4 sm:min-h-[330px] sm:px-8 sm:py-7 lg:min-h-[350px] lg:px-12 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900`}
          >
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-red-900/10 dark:border-white/10 sm:h-72 sm:w-72" />
            <div className="pointer-events-none absolute -right-4 -top-12 h-44 w-44 rounded-full border border-red-900/10 dark:border-white/10 sm:h-52 sm:w-52" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/75 to-transparent dark:from-zinc-950/80 dark:to-transparent" />
            <div className="relative z-10 grid items-center gap-3 sm:min-h-[270px] sm:gap-6 md:grid-cols-[1fr_0.82fr]">
              <div className="banner-copy max-w-xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-white/75 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-red-800 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-red-300 sm:mb-3 sm:px-3 sm:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_0_4px_rgba(185,28,28,0.12)] sm:h-2 sm:w-2" />
                  {t(slide.tag)}
                </div>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
                  {t(slide.title)}
                </h1>
                <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-5 text-zinc-600 sm:mt-3 sm:text-sm sm:leading-6 lg:text-base dark:text-zinc-300">
                  {t(slide.description)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
                  <Link href="/books">
                    <Button className="group h-9 rounded-full bg-red-800 px-3 text-xs text-white shadow-md shadow-red-900/20 transition-all hover:-translate-y-0.5 hover:bg-red-900 hover:shadow-lg dark:bg-red-700 dark:hover:bg-red-600 sm:h-10 sm:px-4 sm:text-sm">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                      {t("banner.browseBooks")}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:ml-2 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                  <Link href="/books/new-books">
                    <Button
                      variant="outline"
                      className="h-9 rounded-full border-red-900/15 bg-white/70 px-3 text-xs text-zinc-800 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-red-800/40 hover:bg-white sm:h-10 sm:px-4 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Search className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                      {t("banner.discoverBooks")}
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 hidden max-w-md grid-cols-3 gap-2 text-center text-xs text-zinc-700 sm:grid sm:text-sm dark:text-zinc-300">
                  <div className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-900/70">
                    <div className="text-base font-bold text-red-800 dark:text-red-400">24/7</div>
                    <div>{t("banner.available")}</div>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-900/70">
                    <div className="text-base font-bold text-sky-800 dark:text-sky-400">{t("common.easy")}</div>
                    <div>{t("banner.search")}</div>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-900/70">
                    <div className="text-base font-bold text-zinc-800 dark:text-zinc-300">{t("common.fast")}</div>
                    <div>{t("banner.status")}</div>
                  </div>
                </div>
              </div>
              <div className="banner-art relative mx-auto flex h-28 w-full max-w-[190px] items-end justify-center sm:h-56 sm:max-w-sm md:h-64">
                <div className="absolute bottom-2 h-16 w-4/5 rounded-[50%] bg-zinc-900/10 blur-2xl sm:bottom-3 sm:h-24" />
                <Image
                  src={slide.imageUrl}
                  alt={`Banner ${i + 1}`}
                  width={720}
                  height={560}
                  priority={i === 0}
                  className="relative h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.04]"
                />
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
