"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ActivityList from "@/components/activity-list";
import PageHeader from "@/components/page-header";
import { useApp } from "@/lib/app-context";

export default function HistoryPage() {
  const { t, lang, sessions, activity, openSession, clearHistory } = useApp();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title={t.historyTitle}
        intro={t.historyIntro}
        actions={
          activity.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t.clearHistoryConfirm)) clearHistory();
              }}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:bg-sunken"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t.clearHistory}
            </button>
          )
        }
      />
      <div className="card p-4 sm:p-5">
        <ActivityList
          t={t}
          lang={lang}
          items={activity}
          emptyText={t.historyEmpty2}
          onOpen={(a) => {
            if (!sessions.some((s) => s.id === a.sessionId)) return;
            openSession(a.sessionId, a.type === "quiz" || a.type === "quiz_done" ? "quiz" : a.type === "tutor" ? "tutor" : "results");
            router.push("/study");
          }}
        />
      </div>
    </div>
  );
}
