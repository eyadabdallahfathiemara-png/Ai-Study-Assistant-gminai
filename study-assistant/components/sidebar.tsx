"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, History, Home, LayoutDashboard, ListChecks, Plus, Settings, Sparkles, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import Logo from "./logo";

interface Props {
  open: boolean; // mobile drawer
  collapsed: boolean; // desktop icon-only mode
  onClose: () => void;
}

export default function Sidebar({ open, collapsed, onClose }: Props) {
  const { t, newSession } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { href: "/dashboard", label: t.pageDashboard, Icon: LayoutDashboard },
    { href: "/study", label: t.pageStudy, Icon: Sparkles },
    { href: "/lessons", label: t.pageLessons, Icon: BookOpen },
    { href: "/quizzes", label: t.pageQuizzes, Icon: ListChecks },
    { href: "/history", label: t.pageHistory, Icon: History },
    { href: "/settings", label: t.pageSettings, Icon: Settings },
  ];

  // Labels stay visible in the mobile drawer; on desktop they hide when collapsed.
  const label = collapsed ? "lg:sr-only" : "";
  const row = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${collapsed ? "lg:justify-center lg:px-0" : ""}`;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        id="sidebar"
        aria-label={t.appName}
        className={`fixed inset-y-0 start-0 z-40 flex w-72 flex-col gap-4 overflow-y-auto border-e border-line bg-surface p-4 transition-all lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:rtl:translate-x-0 ${
          collapsed ? "lg:w-[4.75rem] lg:px-2" : "lg:w-72"
        } ${open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Logo name={t.appName} href="/dashboard" hideName={collapsed} />
          <button type="button" onClick={onClose} aria-label={t.closeMenu} className="rounded-md p-1.5 lg:hidden">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          title={t.newStudySession}
          onClick={() => {
            newSession();
            onClose();
            router.push("/study");
          }}
          className={`${row} bg-brand text-brand-ink hover:opacity-90`}
        >
          <Plus className="size-5 shrink-0" aria-hidden="true" />
          <span className={label}>{t.newStudySession}</span>
        </button>

        <nav aria-label={t.appName}>
          <ul className="space-y-1">
            {items.map(({ href, label: text, Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={text}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`${row} ${active ? "bg-hl text-hl-ink" : "text-ink hover:bg-sunken"}`}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    <span className={label}>{text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-line pt-3">
          <Link href="/" title={t.backHome} className={`${row} text-muted hover:bg-sunken`}>
            <Home className="size-5 shrink-0" aria-hidden="true" />
            <span className={label}>{t.backHome}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
