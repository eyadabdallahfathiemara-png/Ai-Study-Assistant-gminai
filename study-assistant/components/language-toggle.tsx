"use client";

import { Languages } from "lucide-react";
import { useApp } from "@/lib/app-context";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { t, lang, toggleLang } = useApp();
  return (
    <button
      type="button"
      onClick={toggleLang}
      title={t.languageTip}
      lang={lang === "en" ? "ar" : "en"}
      className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:bg-sunken"
    >
      <Languages className="size-4" aria-hidden="true" />
      <span className={compact ? "sr-only" : ""}>{t.language}</span>
    </button>
  );
}
