"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";
import { useApp } from "@/lib/app-context";
import type { Lang, Theme } from "@/lib/types";

function Segmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-2 inline-flex gap-1 rounded-xl bg-sunken p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
              value === o.value ? "bg-surface text-brand shadow-sm" : "text-muted"
            }`}
          >
            <input type="radio" name={label} className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SettingsPage() {
  const { t, lang, theme, name, setLang, setTheme, setName, clearAllData } = useApp();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title={t.settingsTitle} intro={t.settingsIntro} />

      <section className="card space-y-5 p-4 sm:p-6" aria-labelledby="appearance">
        <h2 id="appearance" className="font-semibold">
          {t.appearance}
        </h2>
        <Segmented<Theme>
          label={t.themeLabel}
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: t.light },
            { value: "dark", label: t.dark },
          ]}
        />
        <Segmented<Lang>
          label={t.languageLabel}
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ]}
        />
        <div>
          <label htmlFor="display-name" className="text-sm font-medium">
            {t.nameLabel}
          </label>
          <input
            id="display-name"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            aria-describedby="name-help"
            className="mt-1 block w-full max-w-sm rounded-xl border border-line bg-canvas px-3 py-2"
          />
          <p id="name-help" className="mt-1 text-sm text-muted">
            {t.nameHelp}
          </p>
        </div>
      </section>

      <section className="card p-4 sm:p-6" aria-labelledby="data">
        <h2 id="data" className="font-semibold">
          {t.dataTitle}
        </h2>
        <p className="mt-1 text-muted">{t.dataText}</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t.clearDataConfirm)) {
              clearAllData();
              setNotice(t.dataCleared);
            }
          }}
          className="mt-4 rounded-xl border border-line px-4 py-2 text-sm font-medium text-danger hover:bg-danger-bg"
        >
          {t.clearData}
        </button>
        <p role="status" className="mt-2 text-sm text-good">
          {notice}
        </p>
      </section>
    </div>
  );
}
