"use client";
import React, { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

export default function CarouselBook({ book }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const images = (Array.isArray(book?.imageUrls) ? book.imageUrls : []).filter(
    Boolean
  );
  const bookImages =
    images.length > 0 ? images : book?.imageUrl ? [book.imageUrl] : [];
  const loopImages = bookImages.length > 4;

  return (
    <>
      <Swiper
        loop={loopImages}
        spaceBetween={10}
        navigation={true}
        centeredSlides={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-red-50/70 via-card to-orange-50/60 p-4 shadow-sm dark:from-red-950/20 dark:via-card dark:to-orange-950/10 sm:p-6"
      >
        <div className="flex justify-center h-full w-full">
          {bookImages.map((item, i) => {
            return (
              <SwiperSlide key={i} className="">
                <Image
                  src={item}
                  alt={item}
                  width={320}
                  height={420}
                  priority={i === 0}
                  className="mx-auto h-64 w-full max-w-56 rounded-xl object-contain drop-shadow-xl transition-transform duration-500 hover:scale-[1.03] sm:h-80"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={loopImages}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4 px-1"
      >
        {bookImages.map((item, i) => {
          return (
            <SwiperSlide key={i} className="w-full">
              <Image
                src={item}
                alt={item}
                width={40}
                height={40}
                className="h-16 w-12 rounded-lg object-cover ring-1 ring-border/70 transition-all hover:scale-105 hover:ring-red-800/50"
                loading="lazy"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
