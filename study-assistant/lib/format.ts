import type { Lang } from "./types";

export function formatDate(ts: number, lang: Lang): string {
  return new Date(ts).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(ts: number, lang: Lang): string {
  return new Date(ts).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
