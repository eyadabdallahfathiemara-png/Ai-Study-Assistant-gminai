import { z } from "zod";

// Input limits keep costs and abuse under control.
export const MAX_LESSON_CHARS = 12000;
export const MAX_QUESTION_CHARS = 1000;
export const MAX_HISTORY_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 4000;

const lesson = z.string().trim().min(20, "Lesson is too short").max(MAX_LESSON_CHARS);
const language = z.enum(["en", "ar"]);

const chatMessage = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(MAX_MESSAGE_CHARS),
});

// One request schema per task. "task" decides which one applies.
export const studyRequestSchema = z.discriminatedUnion("task", [
  z.object({ task: z.literal("summarize"), lesson, language }),
  z.object({ task: z.literal("explain"), lesson, language }),
  z.object({ task: z.literal("quiz"), lesson, language }),
  z.object({
    task: z.literal("tutor"),
    lesson,
    language,
    question: z.string().trim().min(1, "Question is empty").max(MAX_QUESTION_CHARS),
    history: z.array(chatMessage).max(MAX_HISTORY_MESSAGES).default([]),
  }),
  z.object({
    // "auto": the AI agent picks the best task from the student's request.
    task: z.literal("auto"),
    lesson,
    language,
    request: z.string().trim().min(1).max(MAX_QUESTION_CHARS),
    history: z.array(chatMessage).max(MAX_HISTORY_MESSAGES).default([]),
  }),
]);

export type StudyRequest = z.infer<typeof studyRequestSchema>;
