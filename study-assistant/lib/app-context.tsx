"use client";

// Shared app state for every page: language, theme, saved lessons, activity, and the
// lesson currently being studied. All AI calls go through the existing /api/study route.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, callStudy } from "./api-client";
import { makeId } from "./id";
import { dict, type T } from "./i18n";
import {
  clearStudyData,
  loadActivity,
  loadPrefs,
  loadSessions,
  saveActivity,
  savePrefs,
  saveSessions,
} from "./storage";
import type {
  Activity,
  ChatMessage,
  Explanation,
  Lang,
  Quiz,
  QuizAttempt,
  Session,
  StudyResult,
  StudyTask,
  Summary,
  Theme,
} from "./types";

export type StudyTab = "results" | "quiz" | "tutor";

interface AppState {
  t: T;
  lang: Lang;
  theme: Theme;
  name: string;
  ready: boolean;
  toggleLang: () => void;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  setName: (n: string) => void;

  sessions: Session[];
  activity: Activity[];

  sessionId: string | null;
  lesson: string;
  setLesson: (v: string) => void;
  summary?: Summary;
  explanation?: Explanation;
  quiz?: Quiz;
  chat: ChatMessage[];
  studyTab: StudyTab;
  setStudyTab: (t: StudyTab) => void;

  loading: StudyTask | "auto" | null;
  error: string | null;
  clearError: () => void;

  run: (task: StudyTask) => Promise<void>;
  runAgent: (request: string) => Promise<void>;
  sendChat: (question: string) => Promise<void>;
  clearChat: () => void;
  recordAttempt: (score: number, total: number) => void;

  newSession: () => void;
  openSession: (id: string, tab?: StudyTab) => void;
  deleteSession: (id: string) => void;
  clearHistory: () => void;
  clearAllData: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- Preferences ---
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  // --- Saved data ---
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);

  // --- The session being studied ---
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState(0);
  const [lesson, setLesson] = useState("");
  const [summary, setSummary] = useState<Summary | undefined>();
  const [explanation, setExplanation] = useState<Explanation | undefined>();
  const [quiz, setQuiz] = useState<Quiz | undefined>();
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [studyTab, setStudyTab] = useState<StudyTab>("results");

  const [loading, setLoading] = useState<StudyTask | "auto" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = dict[lang];

  // Load preferences and saved data once, in the browser.
  useEffect(() => {
    const prefs = loadPrefs();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setLang(prefs.lang ?? "en");
    setTheme(prefs.theme ?? (prefersDark ? "dark" : "light"));
    setName(prefs.name ?? "");
    setSessions(loadSessions());
    setActivity(loadActivity());
    setReady(true);
  }, []);

  // Apply language, direction and theme to <html>, and remember them.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.classList.toggle("dark", theme === "dark");
    savePrefs({ lang, theme, name });
  }, [lang, theme, name, ready]);

  useEffect(() => {
    if (ready) saveSessions(sessions);
  }, [sessions, ready]);

  useEffect(() => {
    if (ready) saveActivity(activity);
  }, [activity, ready]);

  // Keep the saved copy of the current session up to date.
  useEffect(() => {
    if (!ready || !sessionId) return;
    const session: Session = {
      id: sessionId,
      createdAt,
      title: summary?.title || lesson.trim().slice(0, 60) || "…",
      lesson,
      summary,
      explanation,
      quiz,
      chat,
      quizAttempts: attempts,
    };
    setSessions((prev) =>
      [session, ...prev.filter((s) => s.id !== sessionId)].sort((a, b) => b.createdAt - a.createdAt),
    );
  }, [ready, sessionId, createdAt, lesson, summary, explanation, quiz, chat, attempts]);

  const log = useCallback((entry: Omit<Activity, "id" | "at">) => {
    setActivity((prev) => [{ ...entry, id: makeId(), at: Date.now() }, ...prev].slice(0, 100));
  }, []);

  const errorMessage = useCallback(
    (e: unknown) => {
      const code = e instanceof ApiError ? e.code : "server_error";
      return t.errors[code] ?? t.errors.server_error;
    },
    [t],
  );

  const adopt = (id: string) => {
    setSessionId(id);
    setCreatedAt((c) => c || Date.now());
  };

  const snippet = () => lesson.trim().slice(0, 60);

  const applyResult = (result: StudyResult, sid: string, question?: string) => {
    adopt(sid);
    switch (result.type) {
      case "summarize":
        setSummary(result.data);
        setStudyTab("results");
        log({ type: "summarize", sessionId: sid, title: result.data.title });
        break;
      case "explain":
        setExplanation(result.data);
        setStudyTab("results");
        log({ type: "explain", sessionId: sid, title: result.data.title });
        break;
      case "quiz":
        setQuiz(result.data);
        setAttempts([]); // a new quiz starts with a clean score history
        setStudyTab("quiz");
        log({ type: "quiz", sessionId: sid, title: summary?.title || snippet() });
        break;
      case "tutor":
        setChat((c) => [
          ...c,
          ...(question ? [{ role: "user" as const, content: question }] : []),
          { role: "assistant", content: result.data.answer },
        ]);
        setStudyTab("tutor");
        log({ type: "tutor", sessionId: sid, title: question?.slice(0, 60) || snippet() });
        break;
    }
  };

  const run = async (task: StudyTask) => {
    if (loading) return;
    setError(null);
    if (task === "tutor") {
      setStudyTab("tutor");
      return;
    }
    const sid = sessionId ?? makeId();
    setLoading(task);
    try {
      applyResult(await callStudy({ task, lesson, language: lang }), sid);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  const runAgent = async (request: string) => {
    if (loading) return;
    setError(null);
    const sid = sessionId ?? makeId();
    setLoading("auto");
    try {
      applyResult(
        await callStudy({ task: "auto", lesson, language: lang, request, history: chat.slice(-12) }),
        sid,
        request,
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  const sendChat = async (question: string) => {
    if (loading || lesson.trim().length < 20) return;
    setError(null);
    const sid = sessionId ?? makeId();
    adopt(sid);
    const history = chat.slice(-12).map((m) => ({ ...m, content: m.content.slice(0, 4000) }));
    setChat((c) => [...c, { role: "user", content: question }]);
    setLoading("tutor");
    try {
      const result = await callStudy({ task: "tutor", lesson, language: lang, question, history });
      if (result.type === "tutor") {
        setChat((c) => [...c, { role: "assistant", content: result.data.answer }]);
        log({ type: "tutor", sessionId: sid, title: question.slice(0, 60) });
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  const recordAttempt = (score: number, total: number) => {
    if (!sessionId) return;
    setAttempts((a) => [...a, { score, total, at: Date.now() }]);
    log({ type: "quiz_done", sessionId, title: summary?.title || snippet(), score, total });
  };

  const newSession = () => {
    setSessionId(null);
    setCreatedAt(0);
    setLesson("");
    setSummary(undefined);
    setExplanation(undefined);
    setQuiz(undefined);
    setChat([]);
    setAttempts([]);
    setError(null);
    setStudyTab("results");
  };

  const openSession = (id: string, tab: StudyTab = "results") => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    setSessionId(s.id);
    setCreatedAt(s.createdAt);
    setLesson(s.lesson);
    setSummary(s.summary);
    setExplanation(s.explanation);
    setQuiz(s.quiz);
    setChat(s.chat);
    setAttempts(s.quizAttempts ?? []);
    setError(null);
    setStudyTab(tab);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setActivity((prev) => prev.filter((a) => a.sessionId !== id));
    if (id === sessionId) newSession();
  };

  const clearHistory = () => setActivity([]);

  const clearAllData = () => {
    clearStudyData();
    setSessions([]);
    setActivity([]);
    newSession();
  };

  const value = useMemo<AppState>(
    () => ({
      t, lang, theme, name, ready,
      toggleLang: () => setLang((l) => (l === "en" ? "ar" : "en")),
      toggleTheme: () => setTheme((x) => (x === "dark" ? "light" : "dark")),
      setLang, setTheme, setName,
      sessions, activity,
      sessionId, lesson, setLesson, summary, explanation, quiz, chat, studyTab, setStudyTab,
      loading, error, clearError: () => setError(null),
      run, runAgent, sendChat, clearChat: () => { setChat([]); setError(null); }, recordAttempt,
      newSession, openSession, deleteSession, clearHistory, clearAllData,
    }),
    // The action functions are recreated each render on purpose; they read the latest state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, lang, theme, name, ready, sessions, activity, sessionId, lesson, summary, explanation, quiz, chat, studyTab, loading, error, attempts, createdAt],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
