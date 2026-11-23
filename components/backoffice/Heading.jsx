import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Heading({ title ,className }) {
  const { t } = useLanguage();
  return (
      <h2 className={`mb-3 text-center text-xl font-bold tracking-tight sm:mb-0 sm:text-left ${className}`} >{t(title)}</h2>
  );
}
  