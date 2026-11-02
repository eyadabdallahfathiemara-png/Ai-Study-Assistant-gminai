import { BookOpen, FileText, ListChecks, Trophy } from "lucide-react";
import type { T } from "@/lib/i18n";
import type { Session } from "@/lib/types";

// Every number is computed from the sessions saved in this browser.
export default function DashboardCards({ t, sessions }: { t: T; sessions: Session[] }) {
  const attempts = sessions.flatMap((s) => s.quizAttempts ?? []);
  const average =
    attempts.length > 0
      ? Math.round((attempts.reduce((sum, a) => sum + (a.total ? a.score / a.total : 0), 0) / attempts.length) * 100)
      : null;

  const cards = [
    { label: t.statLessons, value: String(sessions.length), Icon: BookOpen },
    { label: t.statSummaries, value: String(sessions.filter((s) => s.summary).length), Icon: FileText },
    { label: t.statQuizzes, value: String(attempts.length), Icon: ListChecks },
    { label: t.statAverage, value: average === null ? "—" : `${average}%`, Icon: Trophy },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, Icon }) => (
        <div key={label} className="card p-4">
          <span className="grid size-9 place-items-center rounded-lg bg-hl text-hl-ink">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <dd className="mt-3 text-3xl font-semibold tabular-nums">{value}</dd>
          <dt className="text-sm text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
