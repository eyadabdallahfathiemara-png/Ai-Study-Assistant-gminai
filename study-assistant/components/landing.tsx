"use client";

import Link from "next/link";
import { ArrowRight, FileText, Languages, Lightbulb, ListChecks, Lock, Mail, MessageCircle } from "lucide-react";
import { useApp } from "@/lib/app-context";
import Footer from "./footer";
import Navbar from "./navbar";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Landing() {
  const { t } = useApp();

  const tools = [
    { label: t.summarize, tip: t.summarizeTip, Icon: FileText },
    { label: t.explain, tip: t.explainTip, Icon: Lightbulb },
    { label: t.quiz, tip: t.quizTip, Icon: ListChecks },
    { label: t.tutor, tip: t.tutorTip, Icon: MessageCircle },
  ];

  const features = [
    { title: t.f1Title, text: t.f1Text, Icon: FileText },
    { title: t.f2Title, text: t.f2Text, Icon: Lightbulb },
    { title: t.f3Title, text: t.f3Text, Icon: ListChecks },
    { title: t.f4Title, text: t.f4Text, Icon: MessageCircle },
    { title: t.f5Title, text: t.f5Text, Icon: Languages },
    { title: t.f6Title, text: t.f6Text, Icon: Lock },
  ];

  const steps = [
    { title: t.s1Title, text: t.s1Text },
    { title: t.s2Title, text: t.s2Text },
    { title: t.s3Title, text: t.s3Text },
  ];

  const arrow = <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />;

  return (
    <>
      <Navbar />
      <main id="top">
        {/* Hero */}
        <section className="bg-gradient-to-b from-hl/60 to-transparent">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t.heroTitle}</h1>
              <p className="mt-4 max-w-xl text-lg text-muted">{t.heroText}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/study" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink shadow-sm hover:opacity-90">
                  {t.startLearning}
                  {arrow}
                </Link>
                <Link href="/dashboard" className="rounded-xl border border-line bg-surface px-5 py-3 font-medium hover:bg-sunken">
                  {t.viewDashboard}
                </Link>
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="font-semibold">{t.heroCardTitle}</h2>
              <ul className="mt-4 space-y-3">
                {tools.map(({ label, tip, Icon }) => (
                  <li key={label} className="flex items-start gap-3 rounded-xl bg-sunken p-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-medium">{label}</span>
                      <span className="block text-sm text-muted">{tip}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">{t.featuresTitle}</h2>
          <p className="mt-2 max-w-2xl text-muted">{t.featuresIntro}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, text, Icon }) => (
              <li key={title} className="card p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-hl text-hl-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works (a real sequence, so the steps are numbered) */}
        <section id="how-it-works" className="bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight">{t.howTitle}</h2>
            <p className="mt-2 text-muted">{t.howIntro}</p>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-semibold text-brand-ink">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">{t.aboutTitle}</h2>
          <p className="mt-3 text-muted">{t.aboutText1}</p>
          <p className="mt-3 text-muted">{t.aboutText2}</p>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="card flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t.contactTitle}</h2>
              <p className="mt-1 max-w-xl text-muted">{CONTACT_EMAIL ? t.contactText : t.contactNone}</p>
            </div>
            {CONTACT_EMAIL && (
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink hover:opacity-90">
                <Mail className="size-4" aria-hidden="true" />
                {t.contactButton}
              </a>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
