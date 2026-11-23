"use client";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import { useRouter } from "next/navigation";

export default function HeadTitleBreadcrumb({ icon }) {
  const Icon = icon;
  const router = useRouter();
  return (
    <div className="mb-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex justify-between items-center w-full h-full ">
        <Breadcrumb />
        <Icon
          onClick={() => router.replace(`/home`)}
          className=" border-custom-border text-custom-text dark:text-zinc-400 cursor-pointer"
        ></Icon>
      </div>
    </div>
  );
}
