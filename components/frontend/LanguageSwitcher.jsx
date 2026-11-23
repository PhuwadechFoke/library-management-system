"use client";
import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = ({ customClass = "" }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="outline"
        className={`${customClass} bg-custom-text dark:bg-custom-background border border-custom-border text-zinc-100 gap-1 transition-all duration-200`}
        onClick={toggleLanguage}
        aria-label={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
        title={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      >
        <Globe className="w-4 sm:w-3" />
        <span className="text-xs font-semibold">
          {language === "th" ? "TH" : "EN"}
        </span>
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
