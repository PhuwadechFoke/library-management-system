"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar, Autoplay } from "swiper/modules";
import Image from "next/image";

const slides = [
  {
    imageUrl: "/Bibliophile-amico.png",
    title: "ห้องสมุดออนไลน์",
    description: "ค้นหา ยืม และติดตามหนังสือเล่มโปรดได้สะดวกในที่เดียว",
    tag: "Library Management",
    accent: "from-red-50 via-white to-sky-50",
  },
  {
    imageUrl: "/Bibliophile-bro.png",
    title: "เปิดโลกการอ่าน",
    description: "รวมหนังสือใหม่และหนังสือยอดนิยม พร้อมให้เลือกอ่านทุกวัน",
    tag: "New Books",
    accent: "from-sky-50 via-white to-red-50",
  },
];

export default function Banner() {
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
      className="mb-4 overflow-hidden rounded-md border bg-card shadow-sm"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={`${slide.imageUrl}-${i}`}>
          <section
            className={`relative min-h-64 overflow-hidden bg-gradient-to-br ${slide.accent} px-5 py-6 sm:min-h-[360px] sm:px-10 lg:px-14`}
          >
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/75 to-transparent" />
            <div className="relative z-10 grid min-h-52 items-center gap-6 sm:min-h-[300px] md:grid-cols-[1fr_0.9fr]">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex rounded-full border border-red-200 bg-white/75 px-3 py-1 text-xs font-medium text-red-800 shadow-sm backdrop-blur">
                  {slide.tag}
                </div>
                <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-600 sm:text-base">
                  {slide.description}
                </p>
                <div className="mt-6 grid max-w-md grid-cols-3 gap-2 text-center text-xs text-zinc-700 sm:text-sm">
                  <div className="rounded-md border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                    <div className="text-lg font-bold text-red-800">24/7</div>
                    <div>ใช้งานได้</div>
                  </div>
                  <div className="rounded-md border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                    <div className="text-lg font-bold text-sky-800">ง่าย</div>
                    <div>ค้นหาหนังสือ</div>
                  </div>
                  <div className="rounded-md border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                    <div className="text-lg font-bold text-zinc-800">เร็ว</div>
                    <div>ตรวจสอบสถานะ</div>
                  </div>
                </div>
              </div>
              <div className="relative mx-auto flex h-44 w-full max-w-sm items-end justify-center sm:h-72 md:h-80">
                <div className="absolute bottom-3 h-24 w-4/5 rounded-[50%] bg-zinc-900/10 blur-2xl" />
                <Image
                  src={slide.imageUrl}
                  alt={`Banner ${i + 1}`}
                  width={720}
                  height={560}
                  priority={i === 0}
                  className="relative h-full w-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
