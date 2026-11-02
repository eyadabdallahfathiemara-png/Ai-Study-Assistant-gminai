"use client";

import AIChat from "@/components/ai-chat";
import AIResult from "@/components/ai-result";
import PageHeader from "@/components/page-header";
import QuizCard from "@/components/quiz-card";
import StudyInput from "@/components/study-input";
import { useApp, type StudyTab } from "@/lib/app-context";

export default function StudyPage() {
  const app = useApp();
  const { t, lesson, summary, explanation, quiz, chat, loading, error, studyTab, setStudyTab } = app;
  const hasLesson = lesson.trim().length >= 20;
  const empty = "rounded-xl border border-dashed border-line p-8 text-center text-muted";

  const tabs: { id: StudyTab; label: string }[] = [
    { id: "results", label: t.tabResults },
    { id: "quiz", label: t.tabQuiz },
    { id: "tutor", label: t.tabTutor },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title={t.pageStudy} intro={t.welcomeText} />

      <StudyInput
        t={t}
        lesson={lesson}
        onLessonChange={app.setLesson}
        loading={loading}
        onAction={app.run}
        onAgent={app.runAgent}
      />

      <div aria-live="polite">
        {loading && loading !== "tutor" && (
          <p role="status" className="rounded-xl bg-sunken px-4 py-3 text-muted">
            {t.working}
          </p>
        )}
        {error && studyTab !== "tutor" && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-danger">
            {error}
          </p>
        )}
      </div>

      <div role="tablist" aria-label={t.pageStudy} className="flex gap-1 rounded-xl bg-sunken p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={studyTab === tab.id}
            aria-controls="study-panel"
            onClick={() => setStudyTab(tab.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              studyTab === tab.id ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="study-panel" role="tabpanel" aria-labelledby={`tab-${studyTab}`}>
        {studyTab === "results" &&
          (summary || explanation ? <AIResult t={t} summary={summary} explanation={explanation} /> : <div className={empty}>{t.emptyStudy}</div>)}

        {studyTab === "quiz" &&
          (quiz ? (
            <QuizCard
              key={quiz.questions[0]?.question}
              t={t}
              quiz={quiz}
              loading={loading === "quiz"}
              onNewQuiz={() => app.run("quiz")}
              onComplete={app.recordAttempt}
            />
          ) : (
            <div className={empty}>
              <p>{loading === "quiz" ? t.working : t.emptyQuiz}</p>
            </div>
          ))}

        {studyTab === "tutor" &&
          (hasLesson ? (
            <AIChat
              t={t}
              messages={chat}
              loading={loading === "tutor"}
              error={error}
              onSend={app.sendChat}
              onClear={app.clearChat}
            />
          ) : (
            <div className={empty}>{t.needLesson}</div>
          ))}
      </div>

      <p className="pt-2 text-center text-xs text-muted">{t.disclaimer}</p>
    </div>
  );
}
