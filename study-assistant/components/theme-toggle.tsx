"use client";

import { Moon, Sun } from "lucide-react";
import { useApp } from "@/lib/app-context";

export default function ThemeToggle() {
  const { t, theme, toggleTheme } = useApp();
  const label = theme === "dark" ? t.themeLight : t.themeDark;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink hover:bg-sunken"
    >
      {theme === "dark" ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </button>
  );
}
