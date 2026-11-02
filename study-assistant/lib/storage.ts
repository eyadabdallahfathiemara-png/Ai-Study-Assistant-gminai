// Safe LocalStorage helpers. Corrupted or missing data never crashes the app.
import { z } from "zod";
import type { Activity, Lang, Session, Theme } from "./types";

const SESSIONS_KEY = "study-assistant:sessions";
const PREFS_KEY = "study-assistant:prefs";
const ACTIVITY_KEY = "study-assistant:activity";
const MAX_ACTIVITY = 100;
const MAX_SESSIONS = 30;

const chatSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string() });
const sessionSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  title: z.string(),
  lesson: z.string(),
  summary: z
    .object({
      title: z.string(),
      overview: z.string(),
      keyPoints: z.array(z.string()),
      terms: z.array(z.object({ term: z.string(), definition: z.string() })),
    })
    .optional(),
  explanation: z
    .object({
      title: z.string(),
      explanation: z.string(),
      examples: z.array(z.string()),
      commonMistakes: z.array(z.string()),
    })
    .optional(),
  quiz: z
    .object({
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
          correctIndex: z.number().int().min(0).max(3),
          explanation: z.string(),
        }),
      ),
    })
    .optional(),
  chat: z.array(chatSchema),
  quizAttempts: z.array(z.object({ score: z.number(), total: z.number(), at: z.number() })).optional(),
});

const activitySchema = z.object({
  id: z.string(),
  type: z.enum(["summarize", "explain", "quiz", "quiz_done", "tutor"]),
  sessionId: z.string(),
  title: z.string(),
  at: z.number(),
  score: z.number().optional(),
  total: z.number().optional(),
});

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // storage blocked or JSON corrupted
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the app keeps working, history just isn't saved.
  }
}

export function loadSessions(): Session[] {
  const data = read(SESSIONS_KEY);
  if (!Array.isArray(data)) return [];
  // Keep only entries that match the expected shape.
  const valid: Session[] = [];
  for (const item of data) {
    const parsed = sessionSchema.safeParse(item);
    if (parsed.success) valid.push(parsed.data as Session);
  }
  return valid.sort((a, b) => b.createdAt - a.createdAt);
}

export function saveSessions(sessions: Session[]) {
  write(SESSIONS_KEY, sessions.slice(0, MAX_SESSIONS));
}

export interface Prefs {
  lang: Lang;
  theme: Theme;
  name: string; // optional display name; there are no accounts
}

export function loadPrefs(): Partial<Prefs> {
  const data = read(PREFS_KEY) as Partial<Prefs> | null;
  const out: Partial<Prefs> = {};
  if (data?.lang === "en" || data?.lang === "ar") out.lang = data.lang;
  if (data?.theme === "light" || data?.theme === "dark") out.theme = data.theme;
  if (typeof data?.name === "string") out.name = data.name.slice(0, 40);
  return out;
}

export function savePrefs(prefs: Prefs) {
  write(PREFS_KEY, prefs);
}

export function loadActivity(): Activity[] {
  const data = read(ACTIVITY_KEY);
  if (!Array.isArray(data)) return [];
  const valid: Activity[] = [];
  for (const item of data) {
    const parsed = activitySchema.safeParse(item);
    if (parsed.success) valid.push(parsed.data);
  }
  return valid.sort((a, b) => b.at - a.at);
}

export function saveActivity(activity: Activity[]) {
  write(ACTIVITY_KEY, activity.slice(0, MAX_ACTIVITY));
}

// Removes saved lessons and activity but keeps language/theme/name.
export function clearStudyData() {
  try {
    window.localStorage.removeItem(SESSIONS_KEY);
    window.localStorage.removeItem(ACTIVITY_KEY);
  } catch {
    // ignore blocked storage
  }
}
