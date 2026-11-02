import { FileText, Lightbulb, ListChecks, MessageCircle, Trophy } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { T } from "@/lib/i18n";
import type { Activity, ActivityType, Lang } from "@/lib/types";

const icons = { summarize: FileText, explain: Lightbulb, quiz: ListChecks, quiz_done: Trophy, tutor: MessageCircle } as const;

function label(t: T, type: ActivityType) {
  return { summarize: t.actSummarize, explain: t.actExplain, quiz: t.actQuiz, quiz_done: t.actQuizDone, tutor: t.actTutor }[type];
}

interface Props {
  t: T;
  lang: Lang;
  items: Activity[];
  emptyText: string;
  // Called when a row is clicked. Rows are plain text when omitted.
  onOpen?: (a: Activity) => void;
}

export default function ActivityList({ t, lang, items, emptyText, onOpen }: Props) {
  if (items.length === 0) return <p className="rounded-xl border border-dashed border-line p-6 text-center text-muted">{emptyText}</p>;

  return (
    <ul className="divide-y divide-line">
      {items.map((a) => {
        const Icon = icons[a.type];
        const body = (
          <>
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-hl text-hl-ink">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block truncate text-sm">
                {label(t, a.type)} <bdi className="font-medium">{a.title}</bdi>
                {a.type === "quiz_done" && a.score !== undefined && a.total ? (
                  <bdi className="ms-2 font-semibold text-brand">
                    {a.score}/{a.total}
                  </bdi>
                ) : null}
              </span>
              <span className="block text-xs text-muted">{formatDateTime(a.at, lang)}</span>
            </span>
          </>
        );
        return (
          <li key={a.id}>
            {onOpen ? (
              <button type="button" onClick={() => onOpen(a)} className="flex w-full items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-sunken">
                {body}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-1 py-2.5">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
