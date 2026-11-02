"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";
import Logo from "./logo";

export default function Footer() {
  const { t } = useApp();
  const explore = [
    { href: "/", label: t.navHome },
    { href: "/#features", label: t.navFeatures },
    { href: "/#about", label: t.navAbout },
    { href: "/#contact", label: t.navContact },
  ];
  const app = [
    { href: "/dashboard", label: t.pageDashboard },
    { href: "/study", label: t.pageStudy },
    { href: "/lessons", label: t.pageLessons },
    { href: "/quizzes", label: t.pageQuizzes },
    { href: "/settings", label: t.pageSettings },
  ];
  const col = "space-y-2 text-sm";
  const link = "text-muted hover:text-ink hover:underline";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Logo name={t.appName} />
          <p className="mt-3 max-w-xs text-sm text-muted">{t.footerTagline}</p>
        </div>
        <nav aria-label={t.footerExplore}>
          <h2 className="mb-3 text-sm font-semibold">{t.footerExplore}</h2>
          <ul className={col}>
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.footerApp}>
          <h2 className="mb-3 text-sm font-semibold">{t.footerApp}</h2>
          <ul className={col}>
            {app.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-sm text-muted">
        © {new Date().getFullYear()} {t.appName}. {t.rights}
      </p>
    </footer>
  );
}
