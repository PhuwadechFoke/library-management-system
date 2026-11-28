"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const highlights = [
  { value: "01", label: "landing.featureSearch", icon: Search },
  { value: "02", label: "landing.featureBorrow", icon: BookOpen },
  { value: "03", label: "landing.featureTrack", icon: Sparkles },
];

export default function ParticlesDemo() {
  const { t } = useLanguage();

  return (
    <section className="landing-hero relative isolate flex min-h-[calc(100dvh-8rem)] w-full items-center overflow-hidden rounded-[2rem] border border-red-950/10 bg-gradient-to-br from-orange-50 via-white to-red-50 shadow-2xl shadow-red-950/10 dark:border-white/10 dark:from-zinc-950 dark:via-zinc-900 dark:to-red-950/50">
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="landing-glow landing-glow-one pointer-events-none absolute" />
      <div className="landing-glow landing-glow-two pointer-events-none absolute" />
      <span className="landing-dot landing-dot-one pointer-events-none absolute" />
      <span className="landing-dot landing-dot-two pointer-events-none absolute" />
      <span className="landing-dot landing-dot-three pointer-events-none absolute" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-14">
        <div className="landing-copy max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-white/75 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-red-900 shadow-sm backdrop-blur dark:border-red-200/10 dark:bg-zinc-900/70 dark:text-red-200 sm:text-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {t("landing.eyebrow")}
          </div>

          <h1 className="landing-heading text-4xl font-black leading-[1.15] tracking-tight text-zinc-950 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="landing-title-main block">{t("landing.title")}</span>
            <span className="landing-title-accent mt-1 block bg-gradient-to-r from-red-800 via-red-600 to-amber-500 bg-clip-text text-transparent dark:from-red-300 dark:via-orange-300 dark:to-amber-200">
              {t("landing.titleAccent")}
            </span>
          </h1>

          <p className="landing-description mt-5 max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            {t("landing.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/home"
              className="landing-cta-primary group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-red-900 hover:shadow-xl hover:shadow-red-900/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
            >
              <BookOpen className="h-5 w-5" />
              {t("landing.enter")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/books"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-900/15 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-red-800/35 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-zinc-900/65 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:text-base"
            >
              <Search className="h-4 w-4" />
              {t("banner.browseBooks")}
            </Link>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            {highlights.map(({ value, label, icon: Icon }, index) => (
              <div
                className="landing-feature rounded-2xl border border-white/80 bg-white/65 p-3 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-red-800/20 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/55 sm:p-4"
                key={value}
                style={{ animationDelay: `${180 + index * 100}ms` }}
              >
                <Icon className="mb-3 h-4 w-4 text-red-800 dark:text-red-300 sm:h-5 sm:w-5" />
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-800/70 dark:text-red-200/70">
                  {value}
                </div>
                <div className="mt-1 text-xs font-medium leading-5 text-zinc-700 dark:text-zinc-200 sm:text-sm">
                  {t(label)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-art relative mx-auto flex w-full max-w-lg items-center justify-center py-3 sm:py-6 lg:py-10">
          <div className="landing-art-ring absolute aspect-square w-[82%] rounded-full border border-red-900/10 dark:border-white/10" />
          <div className="landing-art-ring landing-art-ring-inner absolute aspect-square w-[66%] rounded-full border border-amber-600/15 dark:border-amber-200/10" />
          <div className="landing-image-wrap relative flex aspect-square w-full items-center justify-center">
            <Image
              src="/library-reading.svg"
              width={720}
              height={720}
              priority
              alt="นักศึกษาอ่านหนังสือในห้องสมุด"
              className="landing-illustration relative z-10 h-full w-full object-contain drop-shadow-2xl"
            />
          </div>
          <div className="landing-float-card landing-float-card-top absolute right-0 top-[15%] flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-3 py-2.5 shadow-xl shadow-red-950/10 backdrop-blur dark:border-white/10 dark:bg-zinc-900/80 sm:right-2 sm:px-4 sm:py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <BookOpen className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-zinc-900 dark:text-white sm:text-sm">
                {t("landing.ready")}
              </span>
              <span className="mt-0.5 block text-[10px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                {t("landing.libraryOnline")}
              </span>
            </span>
            <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          </div>
          <div className="landing-float-card landing-float-card-bottom absolute bottom-[13%] left-0 flex items-center gap-2 rounded-2xl border border-white/80 bg-white/85 px-3 py-2 shadow-xl shadow-red-950/10 backdrop-blur dark:border-white/10 dark:bg-zinc-900/80 sm:left-1 sm:px-4 sm:py-3">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 sm:text-sm">
              {t("landing.readingStarts")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
