"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import PageHeader from "@/components/page-header";
import StudySessionCard from "@/components/study-session-card";
import { useApp } from "@/lib/app-context";

export default function LessonsPage() {
  const { t, lang, sessions, openSession, deleteSession, newSession } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = q ? sessions.filter((s) => `${s.title} ${s.lesson}`.toLowerCase().includes(q)) : sessions;

  return (
    <div>
      <PageHeader
        title={t.lessonsTitle}
        intro={t.lessonsIntro}
        actions={
          <button
            type="button"
            onClick={() => {
              newSession();
              router.push("/study");
            }}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-brand-ink hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t.newStudySession}
          </button>
        }
      />

      {sessions.length > 0 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="lesson-search" className="sr-only">
            {t.searchPlaceholder}
          </label>
          <input
            id="lesson-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-line bg-surface py-2 pe-3 ps-9"
          />
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">{t.lessonsEmpty}</p>
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">{t.noMatches}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <StudySessionCard
              key={s.id}
              t={t}
              lang={lang}
              session={s}
              onOpen={() => {
                openSession(s.id);
                router.push("/study");
              }}
              onDelete={() => deleteSession(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
