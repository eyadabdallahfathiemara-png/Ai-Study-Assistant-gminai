"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import LanguageToggle from "./language-toggle";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const { t } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.navHome },
    { href: "/#features", label: t.navFeatures },
    { href: "/#about", label: t.navAbout },
    { href: "/#contact", label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo name={t.appName} />

        <nav aria-label={t.appName} className="ms-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-sunken hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/dashboard" className="hidden rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-ink hover:opacity-90 sm:block">
            {t.getStarted}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={t.openMenuNav}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid size-9 place-items-center rounded-lg border border-line bg-surface md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={t.appName} className="border-t border-line bg-canvas px-4 pb-4 md:hidden">
          <ul className="space-y-1 pt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-sunken">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dashboard" className="mt-2 block rounded-xl bg-brand px-4 py-2.5 text-center font-medium text-brand-ink">
                {t.getStarted}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
