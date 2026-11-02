import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { T } from "@/lib/i18n";
import type { Lang, Session } from "@/lib/types";

interface Props {
  t: T;
  lang: Lang;
  session: Session;
  onOpen: () => void;
  onDelete?: () => void;
}

export default function StudySessionCard({ t, lang, session, onOpen, onDelete }: Props) {
  const badges = [
    session.summary && t.hasSummary,
    session.explanation && t.hasExplanation,
    session.quiz && t.hasQuiz,
    session.chat.length > 0 && t.hasChat,
  ].filter(Boolean) as string[];

  return (
    <article className="card flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 font-semibold">{session.title}</h3>
        {onDelete && (
          <button
            type="button"
            title={t.delete}
            aria-label={`${t.delete}: ${session.title}`}
            onClick={() => {
              if (window.confirm(t.deleteConfirm)) onDelete();
            }}
            className="rounded-md p-1.5 text-muted hover:bg-sunken hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-1 line-clamp-3 text-sm text-muted">{session.lesson}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {badges.map((b) => (
          <span key={b} className="rounded-full bg-hl px-2.5 py-0.5 text-xs font-medium text-hl-ink">
            {b}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 pt-1">
        <span className="text-xs text-muted">{formatDate(session.createdAt, lang)}</span>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-ink hover:opacity-90"
        >
          {t.open}
        </button>
      </div>
    </article>
  );
}
