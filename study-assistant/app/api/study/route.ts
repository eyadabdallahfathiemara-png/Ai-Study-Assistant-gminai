import { NextResponse } from "next/server";
import { APICallError, NoObjectGeneratedError, RetryError } from "ai";
import { chooseTask, hasApiKey, keyEnvName, runTask } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { studyRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 60_000;

function fail(code: string, message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: { code, message } }, { status, headers });
}

export async function POST(req: Request) {
  // 1. Server configuration check (the key never leaves the server).
  if (!hasApiKey()) {
    return fail("missing_key", `The server is missing ${keyEnvName()}.`, 500);
  }

  // 2. Rate limit by client IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return fail("rate_limited", "Too many requests. Please wait a moment.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  // 3. Size check and validation.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("too_large", "Request is too large.", 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail("bad_json", "Invalid JSON body.", 400);
  }

  const parsed = studyRequestSchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request.";
    return fail("invalid_request", message, 400);
  }
  const body = parsed.data;

  // 4. Run the study task with a real model call.
  try {
    if (body.task === "auto") {
      const task = await chooseTask(body.request);
      const result = await runTask(task, {
        lesson: body.lesson,
        language: body.language,
        question: body.request,
        history: body.history,
      });
      return NextResponse.json(result);
    }

    const result = await runTask(body.task, {
      lesson: body.lesson,
      language: body.language,
      question: body.task === "tutor" ? body.question : undefined,
      history: body.task === "tutor" ? body.history : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    // Log details on the server only; send a safe message to the client.
    console.error("Study API error:", err);
    // The AI SDK wraps repeated failures in a RetryError; look at the real cause inside it.
    const cause = RetryError.isInstance(err) ? err.lastError : err;
    if (APICallError.isInstance(cause)) {
      const text = `${cause.message} ${cause.responseBody ?? ""}`.toLowerCase();
      const status = cause.statusCode;
      if (/api key|api_key|unauthenticated|permission_denied/.test(text) || status === 401 || status === 403) {
        return fail("auth", "The AI API key is invalid or not allowed.", 502);
      }
      if (/credit|quota|billing|resource_exhausted|rate limit/.test(text) || status === 429) {
        return fail("quota", "AI credits, quota or rate limit reached.", 502);
      }
      if (status === 404) return fail("model", "The configured model was not found.", 502);
    }
    if (NoObjectGeneratedError.isInstance(err)) {
      return fail("bad_output", "The AI returned an unreadable answer. Try again.", 502);
    }
    const message = err instanceof Error && err.message.includes("invalid quiz") ? err.message : "Something went wrong. Please try again.";
    return fail("server_error", message, 500);
  }
}
