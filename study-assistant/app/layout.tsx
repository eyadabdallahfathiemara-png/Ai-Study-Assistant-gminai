import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/lib/app-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Study Assistant",
  description: "Summaries, explanations, quizzes and an AI tutor for your lessons.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Runs before the page paints so the saved theme and language apply without a flash.
const initScript = `
try {
  var p = JSON.parse(localStorage.getItem("study-assistant:prefs") || "{}");
  var d = document.documentElement;
  var dark = p.theme ? p.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) d.classList.add("dark");
  if (p.lang === "ar") { d.lang = "ar"; d.dir = "rtl"; }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="min-h-screen bg-canvas text-ink"><AppProvider>{children}</AppProvider></body>
    </html>
  );
}
