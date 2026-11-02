"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { T } from "@/lib/i18n";

export default function CopyButton({ t, text }: { t: T; text: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
    } catch {
      setState("fail"); // clipboard blocked (for example on plain http)
    }
    setTimeout(() => setState("idle"), 2000);
  };

  const label = state === "ok" ? t.copied : state === "fail" ? t.copyFailed : t.copy;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-sm text-muted hover:bg-sunken hover:text-ink"
      >
        {state === "ok" ? <Check className="size-4 text-good" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {label}
      </button>
      {/* Announces the result to screen readers without changing the button's name. */}
      <span className="sr-only" role="status">
        {state === "idle" ? "" : label}
      </span>
    </>
  );
}
