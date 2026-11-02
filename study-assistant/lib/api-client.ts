// Browser-side helper that calls our own /api/study route.
import type { ChatMessage, Lang, StudyResult, StudyTask } from "./types";

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

type Payload =
  | { task: Exclude<StudyTask, "tutor">; lesson: string; language: Lang }
  | { task: "tutor"; lesson: string; language: Lang; question: string; history: ChatMessage[] }
  | { task: "auto"; lesson: string; language: Lang; request: string; history: ChatMessage[] };

export async function callStudy(payload: Payload): Promise<StudyResult> {
  let res: Response;
  try {
    res = await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("network", "network");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(json?.error?.code ?? "server_error", json?.error?.message ?? "Error");
  }
  return json as StudyResult;
}
