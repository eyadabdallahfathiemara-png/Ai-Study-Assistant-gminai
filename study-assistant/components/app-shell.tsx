"use client";

import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useApp } from "@/lib/app-context";
import LanguageToggle from "./language-toggle";
import Sidebar from "./sidebar";
import ThemeToggle from "./theme-toggle";

// Frame for all signed-in-style pages: sidebar + top bar. (There is no real sign-in.)
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t, ready, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // In RTL the "close" panel icon should point the other way.
  const flip = lang === "ar" ? "rtl:-scale-x-100" : "";

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-canvas/90 px-4 py-2 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.openMenu}
            aria-controls="sidebar"
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg border border-line bg-surface lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t.expand : t.collapse}
            title={collapsed ? t.expand : t.collapse}
            aria-controls="sidebar"
            aria-expanded={!collapsed}
            className="hidden size-9 place-items-center rounded-lg border border-line bg-surface lg:grid"
          >
            {collapsed ? (
              <PanelLeftOpen className={`size-5 ${flip}`} aria-hidden="true" />
            ) : (
              <PanelLeftClose className={`size-5 ${flip}`} aria-hidden="true" />
            )}
          </button>
          <div className="ms-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4 sm:p-6">
          {ready ? children : <p className="py-20 text-center text-muted">{t.loadingApp}</p>}
        </main>
      </div>
    </div>
  );
}
