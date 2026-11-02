"use client";

import { useState } from "react";
import type { Quiz as QuizData } from "@/lib/types";
import type { T } from "@/lib/i18n";

interface Props {
  t: T;
  quiz: QuizData;
  loading: boolean;
  onNewQuiz: () => void;
  onComplete: (score: number, total: number) => void;
}

export default function QuizCard({ t, quiz, loading, onNewQuiz, onComplete }: Props) {
  const total = quiz.questions.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [done, setDone] = useState(false);

  const restart = () => {
    setIndex(0);
    setAnswers(Array(total).fill(null));
    setDone(false);
  };

  const score = quiz.questions.filter((q, i) => answers[i] === q.correctIndex).length;
  const box = "card p-4 sm:p-6";

  if (done) {
    return (
      <section className={box} aria-labelledby="score-heading">
        <h2 id="score-heading" className="text-xl font-semibold">
          {t.yourScore}
        </h2>
        <p className="mt-1 text-4xl font-semibold" role="status">
          {score} / {total}
        </p>

        <h3 className="mt-6 text-sm font-semibold text-muted">{t.review}</h3>
        <ol className="mt-2 space-y-4">
          {quiz.questions.map((q, i) => {
            const right = answers[i] === q.correctIndex;
            return (
              <li key={i} className="rounded-lg border border-line p-3">
                <p className="font-medium">
                  {i + 1}. {q.question}
                </p>
                <p className={`mt-2 text-sm ${right ? "text-good" : "text-danger"}`}>
                  {right ? "✓ " : "✗ "}
                  {t.yourAnswer}: {answers[i] === null ? "—" : q.options[answers[i] as number]}
                </p>
                {!right && (
                  <p className="text-sm text-good">
                    {t.correctAnswer}: {q.options[q.correctIndex]}
                  </p>
                )}
                <p className="mt-2 rounded-md bg-sunken px-3 py-2 text-sm text-muted">{q.explanation}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restart}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-ink hover:opacity-90"
          >
            {t.restartQuiz}
          </button>
          <button
            type="button"
            onClick={onNewQuiz}
            disabled={loading}
            className="rounded-lg border border-line bg-sunken px-4 py-2 text-sm font-medium hover:bg-line disabled:opacity-40"
          >
            {loading ? t.working : t.newQuiz}
          </button>
        </div>
      </section>
    );
  }

  const q = quiz.questions[index];
  const selected = answers[index];
  const last = index === total - 1;

  return (
    <section className={box}>
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {t.question} {index + 1} {t.of} {total}
        </span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
          <div className="h-full bg-brand transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-lg font-semibold">{q.question}</legend>
        <div className="mt-3 space-y-2">
          {q.options.map((opt, i) => {
            const checked = selected === i;
            return (
              <label
                key={i}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                  checked ? "border-transparent bg-hl text-hl-ink" : "border-line hover:bg-sunken"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={checked}
                  onChange={() => setAnswers((prev) => prev.map((a, k) => (k === index ? i : a)))}
                  className="mt-1.5 accent-[var(--brand)]"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex((n) => n - 1)}
          disabled={index === 0}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-sunken disabled:opacity-0"
        >
          <span aria-hidden="true" className="rtl:hidden">←</span><span aria-hidden="true" className="hidden rtl:inline">→</span>
          <span className="sr-only">{t.previous}</span>
        </button>
        <button
          type="button"
          disabled={selected === null}
          onClick={() => {
            if (!last) return setIndex((n) => n + 1);
            setDone(true);
            onComplete(quiz.questions.filter((qq, i) => answers[i] === qq.correctIndex).length, total);
          }}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-brand-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {last ? t.finish : t.next}
        </button>
      </div>
    </section>
  );
}
