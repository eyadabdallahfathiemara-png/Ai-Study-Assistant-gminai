"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { useApp } from "@/lib/app-context";
import { formatDate } from "@/lib/format";

export default function QuizzesPage() {
  const { t, lang, sessions, openSession } = useApp();
  const router = useRouter();
  const withQuiz = sessions.filter((s) => s.quiz);

  return (
    <div>
      <PageHeader title={t.quizzesTitle} intro={t.quizzesIntro} />

      {withQuiz.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">{t.quizzesEmpty}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {withQuiz.map((s) => {
            const attempts = s.quizAttempts ?? [];
            const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : null;
            const last = attempts.length ? attempts[attempts.length - 1] : null;
            const total = s.quiz?.questions.length ?? 0;
            return (
              <li key={s.id} className="card flex flex-col p-4">
                <h2 className="line-clamp-2 font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {total} {t.questionsCount} · {formatDate(s.createdAt, lang)}
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-sunken p-2">
                    <dd className="font-semibold tabular-nums">{attempts.length}</dd>
                    <dt className="text-xs text-muted">{t.attempts}</dt>
                  </div>
                  <div className="rounded-lg bg-sunken p-2">
                    <dd className="font-semibold tabular-nums" dir="ltr">
                      {best === null ? "—" : `${best}/${total}`}
                    </dd>
                    <dt className="text-xs text-muted">{t.bestScore}</dt>
                  </div>
                  <div className="rounded-lg bg-sunken p-2">
                    <dd className="font-semibold tabular-nums" dir="ltr">
                      {last ? `${last.score}/${last.total}` : "—"}
                    </dd>
                    <dt className="text-xs text-muted">{t.lastScore}</dt>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    openSession(s.id, "quiz");
                    router.push("/study");
                  }}
                  className="mt-4 self-end rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-ink hover:opacity-90"
                >
                  {attempts.length ? t.retakeQuiz : t.takeQuiz}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
