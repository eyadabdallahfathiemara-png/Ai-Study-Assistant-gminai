"use client";

import { useState } from "react";
import { FileText, Lightbulb, ListChecks, MessageCircle, Sparkles } from "lucide-react";
import { MAX_LESSON_CHARS } from "@/lib/validation";
import type { StudyTask } from "@/lib/types";
import type { T } from "@/lib/i18n";

interface Props {
  t: T;
  lesson: string;
  onLessonChange: (value: string) => void;
  loading: StudyTask | "auto" | null;
  onAction: (task: StudyTask) => void;
  onAgent: (request: string) => void;
}

export default function StudyInput({ t, lesson, onLessonChange, loading, onAction, onAgent }: Props) {
  const [request, setRequest] = useState("");
  const busy = loading !== null;
  const tooShort = lesson.trim().length < 20;

  const actions = [
    { task: "summarize", label: t.summarize, tip: t.summarizeTip, Icon: FileText },
    { task: "explain", label: t.explain, tip: t.explainTip, Icon: Lightbulb },
    { task: "quiz", label: t.quiz, tip: t.quizTip, Icon: ListChecks },
    { task: "tutor", label: t.tutor, tip: t.tutorTip, Icon: MessageCircle },
  ] as const;

  return (
    <section className="card p-4 sm:p-6">
      <label htmlFor="lesson" className="block text-sm font-medium">
        {t.lessonLabel}
      </label>
      <textarea
        id="lesson"
        value={lesson}
        maxLength={MAX_LESSON_CHARS}
        onChange={(e) => onLessonChange(e.target.value)}
        placeholder={t.lessonPlaceholder}
        rows={9}
        className="mt-1 w-full resize-y rounded-xl border border-line bg-canvas p-3 text-base"
      />
      <p className="mt-1 text-end text-xs text-muted" aria-live="off">
        {lesson.length.toLocaleString()} / {MAX_LESSON_CHARS.toLocaleString()} {t.chars}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <button
            key={a.task}
            type="button"
            title={a.tip}
            disabled={busy || tooShort}
            onClick={() => onAction(a.task)}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-brand-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <a.Icon className="size-4 shrink-0" aria-hidden="true" />
            {loading === a.task ? t.working : a.label}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <label htmlFor="agent" className="block text-sm font-medium">
          {t.agentLabel}
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="agent"
            value={request}
            maxLength={500}
            onChange={(e) => setRequest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !busy && !tooShort && request.trim()) onAgent(request.trim());
            }}
            placeholder={t.agentPlaceholder}
            className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-3 py-2"
          />
          <button
            type="button"
            title={t.agentTip}
            disabled={busy || tooShort || !request.trim()}
            onClick={() => onAgent(request.trim())}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-sunken px-4 py-2 text-sm font-medium transition-colors hover:bg-line disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {loading === "auto" ? t.working : t.agentGo}
          </button>
        </div>
      </div>
    </section>
  );
}
