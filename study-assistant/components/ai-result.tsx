import type { Explanation, Summary } from "@/lib/types";
import type { T } from "@/lib/i18n";
import CopyButton from "./copy-button";

function List({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2 list-disc space-y-1.5 ps-5 marker:text-brand">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const h3 = "mt-5 text-sm font-semibold text-muted";

function summaryText(t: T, s: Summary) {
  return [
    s.title,
    "",
    s.overview,
    "",
    `${t.keyPoints}:`,
    ...s.keyPoints.map((p) => `- ${p}`),
    ...(s.terms.length ? ["", `${t.terms}:`, ...s.terms.map((x) => `- ${x.term}: ${x.definition}`)] : []),
  ].join("\n");
}

function explanationText(t: T, e: Explanation) {
  return [
    e.title,
    "",
    e.explanation,
    ...(e.examples.length ? ["", `${t.examples}:`, ...e.examples.map((x) => `- ${x}`)] : []),
    ...(e.commonMistakes.length ? ["", `${t.mistakes}:`, ...e.commonMistakes.map((x) => `- ${x}`)] : []),
  ].join("\n");
}

export function SummaryCard({ t, summary }: { t: T; summary: Summary }) {
  return (
    <article className="card p-4 sm:p-6" aria-label={t.summaryTitle}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand">{t.summaryTitle}</p>
          <h2 className="text-xl font-semibold">{summary.title}</h2>
        </div>
        <CopyButton t={t} text={summaryText(t, summary)} />
      </div>
      <h3 className={h3}>{t.overview}</h3>
      <p className="mt-1">{summary.overview}</p>
      <h3 className={h3}>{t.keyPoints}</h3>
      <List items={summary.keyPoints} />
      {summary.terms.length > 0 && (
        <>
          <h3 className={h3}>{t.terms}</h3>
          <dl className="mt-2 space-y-2">
            {summary.terms.map((term, i) => (
              <div key={i} className="rounded-lg bg-sunken px-3 py-2">
                <dt className="font-medium">{term.term}</dt>
                <dd className="text-muted">{term.definition}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </article>
  );
}

export function ExplanationCard({ t, explanation }: { t: T; explanation: Explanation }) {
  return (
    <article className="card p-4 sm:p-6" aria-label={t.explanationTitle}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand">{t.explanationTitle}</p>
          <h2 className="text-xl font-semibold">{explanation.title}</h2>
        </div>
        <CopyButton t={t} text={explanationText(t, explanation)} />
      </div>
      <p className="mt-3 whitespace-pre-line">{explanation.explanation}</p>
      {explanation.examples.length > 0 && (
        <>
          <h3 className={h3}>{t.examples}</h3>
          <List items={explanation.examples} />
        </>
      )}
      {explanation.commonMistakes.length > 0 && (
        <>
          <h3 className={h3}>{t.mistakes}</h3>
          <List items={explanation.commonMistakes} />
        </>
      )}
    </article>
  );
}

// Shows whichever results exist for the current lesson.
export default function AIResult({ t, summary, explanation }: { t: T; summary?: Summary; explanation?: Explanation }) {
  return (
    <div className="space-y-4">
      {summary && <SummaryCard t={t} summary={summary} />}
      {explanation && <ExplanationCard t={t} explanation={explanation} />}
    </div>
  );
}
