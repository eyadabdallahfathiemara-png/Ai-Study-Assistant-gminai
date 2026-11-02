"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import type { T } from "@/lib/i18n";

interface Props {
  t: T;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClear: () => void;
}

export default function AiChat({ t, messages, loading, error, onSend, onClear }: Props) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  const submit = () => {
    const value = text.trim();
    if (!value || loading) return;
    setText("");
    onSend(value);
  };

  return (
    <section className="card flex h-[70vh] min-h-96 flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <h2 className="font-semibold">{t.tutorName}</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={messages.length === 0 || loading}
          className="rounded-md px-2 py-1 text-sm text-muted hover:bg-sunken disabled:opacity-40"
        >
          {t.clearChat}
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.length === 0 && !loading && <p className="m-auto max-w-sm pt-10 text-center text-muted">{t.chatEmpty}</p>}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 ${
                m.role === "user" ? "bg-brand text-brand-ink" : "bg-sunken"
              }`}
            >
              <span className="sr-only">{m.role === "user" ? t.you : t.tutorName}: </span>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start" role="status">
            <div className="rounded-2xl bg-sunken px-4 py-2 text-muted">
              <span className="sr-only">{t.working}</span>
              <span aria-hidden="true" className="inline-flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-muted" />
                <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:120ms]" />
                <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="alert" className="mx-4 mb-2 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-2 border-t border-line p-3">
        <label htmlFor="chat-input" className="sr-only">
          {t.chatPlaceholder}
        </label>
        <textarea
          id="chat-input"
          value={text}
          rows={1}
          maxLength={1000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter adds a new line.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t.chatPlaceholder}
          className="min-w-0 flex-1 resize-none rounded-lg border border-line bg-canvas px-3 py-2"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || !text.trim()}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.send}
        </button>
      </div>
    </section>
  );
}
