# AI Study Assistant

A beginner-friendly study platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and the **Vercel AI SDK**. Paste a lesson, then summarize it, get a beginner-friendly explanation, take a 5-question quiz, or chat with an AI tutor. It has a landing page, a student dashboard and several study pages. Works in **English and Arabic (RTL)**, with light and dark mode.

## Quick start

Requires Node.js 18.18 or newer.

```bash
npm install
cp .env.example .env.local      # Windows PowerShell: copy .env.example .env.local
```

Open `.env.local` and paste your own key. The default provider is **Google Gemini**, which has a free tier:

1. Create a key at https://aistudio.google.com/apikey (a Google account is enough).
2. Put it in `.env.local`:

```
AI_PROVIDER=gemini
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.5-flash
```

Free-tier models, limits and country availability are set by Google and change over time; check the Gemini API pricing and rate-limit pages. Free-tier requests may be used by Google to improve its products, so do not paste private material. If `gemini-2.5-flash` is not free for your account, try `GEMINI_MODEL=gemini-2.5-flash-lite`.

To use OpenAI instead (a paid API with its own credits):

```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Then run:

```bash
npm run dev
```

Open http://localhost:3000. Restart the server whenever you change `.env.local`.

Use no quotes or spaces around the key. Never commit `.env.local` (it is already in `.gitignore`) and never put a real key in `.env.example`.

## Pages

| URL | Page | What it does |
| --- | --- | --- |
| `/` | Home (landing) | Navbar, hero, features, How It Works, About, Contact, footer. **Get Started** goes to the dashboard and **Start Learning** goes to the study page. |
| `/dashboard` | Dashboard | Greeting, stat cards, Recent Activity, My Study Sessions, New Study Session. |
| `/study` | AI Study Assistant | Lesson input, the four AI actions, the "let the AI choose" box, results with Copy, interactive quiz, tutor chat. |
| `/lessons` | My Lessons | Every saved lesson, with search, open and delete. |
| `/quizzes` | My Quizzes | Quizzes generated from your lessons, attempts, best and last score, retake. |
| `/history` | Study History | Timeline of summaries, quizzes and tutor questions. Click an entry to reopen it. |
| `/settings` | Settings | Language, theme, optional display name, delete all saved data. |

There is **no login**. The app never asks for a password and does not claim to protect your data with an account. Everything is stored in your own browser (LocalStorage). The dashboard numbers are computed only from what is saved there, so a new browser starts at zero.

The Contact section shows an email button only when you set `NEXT_PUBLIC_CONTACT_EMAIL` in `.env.local` (rebuild or restart after changing it). Without it, the section says no contact email is configured.

## Checks and production build

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run build       # production build
npm start           # run the production build
```

## What each file does

| File | Purpose |
| --- | --- |
| `app/api/study/route.ts` | The only API endpoint. Checks the key, rate limits, validates input, runs the task, returns safe errors. |
| `app/page.tsx` | Landing page (uses `components/landing.tsx`). |
| `app/(app)/layout.tsx` | Wraps the app pages in the sidebar and top bar. The `(app)` folder does not appear in URLs. |
| `app/(app)/*/page.tsx` | The dashboard, study, lessons, quizzes, history and settings pages. |
| `lib/app-context.tsx` | Shared state for every page: language, theme, saved lessons, activity log, the lesson being studied, and the AI actions. |
| `lib/ai.ts` | Real model calls with the AI SDK (Gemini or OpenAI, chosen by `AI_PROVIDER`): `generateObject` (structured JSON) and `generateText` (chat). Also the agent that picks a task. |
| `lib/validation.ts` | Zod schemas and input size limits. |
| `lib/rate-limit.ts` | Simple in-memory limiter: 20 requests per minute per IP. |
| `lib/storage.ts` | Safe LocalStorage read/write. Corrupted data is ignored, not fatal. |
| `lib/i18n.ts` | All English and Arabic text. |
| `lib/types.ts`, `lib/format.ts`, `lib/api-client.ts` | Shared types, date formatting, and the browser helper that calls `/api/study`. |

### Components

| Component | Used for |
| --- | --- |
| `navbar.tsx`, `footer.tsx`, `landing.tsx`, `logo.tsx` | Landing page. |
| `sidebar.tsx`, `app-shell.tsx`, `page-header.tsx` | App layout. The sidebar collapses on desktop and slides in on mobile. |
| `dashboard-cards.tsx`, `activity-list.tsx`, `study-session-card.tsx` | Dashboard, lessons and history pages. |
| `study-input.tsx`, `ai-result.tsx`, `quiz-card.tsx`, `ai-chat.tsx`, `copy-button.tsx` | The study page. |
| `theme-toggle.tsx`, `language-toggle.tsx` | Light/dark and Arabic/English switches. |

## How the AI agent works

1. The four buttons call a task directly.
2. The "Or tell the AI what you need" box sends your sentence to the model, which picks `summarize`, `explain`, `quiz` or `tutor`. The server then runs that task.
3. Quiz answers are scored in the browser against the `correctIndex` the model returned; each question has a stored explanation shown in the review.

## Security notes

- The API key (`GOOGLE_GENERATIVE_AI_API_KEY` or `OPENAI_API_KEY`) is only read in server code (`lib/ai.ts` imports `server-only`).
- Lesson text is wrapped in `<lesson>` tags and the system prompt tells the model to treat it as data and ignore instructions inside it. This reduces prompt-injection risk but cannot remove it completely.
- Inputs are limited (lesson 12,000 characters, question 1,000, chat history 12 messages, request body 60 KB).
- The in-memory rate limiter resets on restart and is not shared across serverless instances. Before a public deployment, use a shared store (for example Upstash Redis) or your host's rate limiting.
- AI answers can be wrong. The app shows a reminder; check important facts with a teacher or textbook.

## Troubleshooting

Real errors are printed in the terminal where `npm run dev` runs, on a line starting with `Study API error:`.

| Message or symptom | Fix |
| --- | --- |
| "The server has no AI API key" | Add the key for your provider to `.env.local` (see above), then restart `npm run dev`. |
| "The AI API key is invalid or not allowed" | Copy the key again; no quotes or spaces. Make sure `AI_PROVIDER` matches the key you pasted. |
| "free quota, credits or rate limit were reached" | Gemini: wait a minute (free tier has per-minute and per-day limits). OpenAI: add credits on the billing page. |
| "The configured model was not found" | Check `GEMINI_MODEL` or `OPENAI_MODEL` spelling and that your account can use it. |
| "Too many requests" | You hit the app's own limit of 20 per minute. Wait a minute. |
| "The AI returned an unreadable answer" | Try again, or use a stronger model. |
| `crypto.randomUUID is not a function` | Open the app at `http://localhost:3000`, not by IP address. (This version also has a fallback.) |
| `npm error ENOENT ... package.json` | You are in the wrong folder. `cd` into the folder that contains `package.json`. |
| History disappeared | LocalStorage is per browser and is cleared by private mode or "clear site data". |
| Port 3000 in use | `npm run dev -- -p 3001` |

## Limits of this first version

- Study history lives only in your browser (no accounts, no database).
- Quiz progress is not saved mid-quiz; the quiz itself and your final scores are saved with the lesson.
- Opening one lesson replaces the lesson currently in the study page; start a New Study Session to keep them separate.
- Only Gemini and OpenAI are wired up. Other providers need another `@ai-sdk/...` package and a branch in `lib/ai.ts`.
