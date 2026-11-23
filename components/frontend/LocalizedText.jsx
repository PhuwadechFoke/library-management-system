"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LocalizedText({ children, value }) {
  const { t } = useLanguage();
  return t(value ?? children);
}
