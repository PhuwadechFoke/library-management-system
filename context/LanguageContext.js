"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "@/lib/translations";

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("th");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored === "en" || stored === "th") {
      setLanguage(stored);
    }
    setHydrated(true);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [hydrated, language]);

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
