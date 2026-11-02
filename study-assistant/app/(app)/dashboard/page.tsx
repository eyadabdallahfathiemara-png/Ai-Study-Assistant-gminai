"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ActivityList from "@/components/activity-list";
import DashboardCards from "@/components/dashboard-cards";
import PageHeader from "@/components/page-header";
import StudySessionCard from "@/components/study-session-card";
import { useApp } from "@/lib/app-context";

export default function DashboardPage() {
  const { t, lang, name, sessions, activity, openSession, deleteSession, newSession } = useApp();
  const router = useRouter();
  const greeting = name.trim() ? t.welcomeBackName.replace("{name}", name.trim()) : t.welcomeBack;

  const open = (id: string) => {
    openSession(id);
    router.push("/study");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting}
        intro={t.dashSubtitle}
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

      <DashboardCards t={t} sessions={sessions} />

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card p-4 sm:p-5 lg:col-span-2" aria-labelledby="recent-activity">
          <div className="flex items-center justify-between">
            <h2 id="recent-activity" className="font-semibold">
              {t.recentActivity}
            </h2>
            {activity.length > 0 && (
              <Link href="/history" className="text-sm text-brand hover:underline">
                {t.viewAll}
              </Link>
            )}
          </div>
          <div className="mt-2">
            <ActivityList
              t={t}
              lang={lang}
              items={activity.slice(0, 6)}
              emptyText={t.noActivity}
              onOpen={(a) => sessions.some((s) => s.id === a.sessionId) && open(a.sessionId)}
            />
          </div>
        </section>

        <section className="lg:col-span-3" aria-labelledby="my-sessions">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="my-sessions" className="font-semibold">
              {t.mySessions}
            </h2>
            {sessions.length > 0 && (
              <Link href="/lessons" className="text-sm text-brand hover:underline">
                {t.viewAll}
              </Link>
            )}
          </div>
          {sessions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-6 text-center text-muted">{t.noSessions}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {sessions.slice(0, 4).map((s) => (
                <StudySessionCard key={s.id} t={t} lang={lang} session={s} onOpen={() => open(s.id)} onDelete={() => deleteSession(s.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
