"use client";

import { useState } from "react";
import {
  LANGUAGES,
  THEMES,
  useTheme,
} from "../context/theme-context";

export default function ThemeLanguageSelector() {
  const {
    theme,
    language,
    setTheme,
    setLanguage,
  } = useTheme();

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const [themeOpen, setThemeOpen] =
    useState(false);

  const currentLanguage =
    LANGUAGES.find(
      (item) => item.code === language
    ) ?? LANGUAGES[0];

  const currentTheme =
    THEMES.find(
      (item) => item.name === theme
    ) ?? THEMES[0];

  function toggleLanguage() {
    setLanguageOpen((value) => !value);
    setThemeOpen(false);
  }

  function toggleTheme() {
    setThemeOpen((value) => !value);
    setLanguageOpen(false);
  }

  return (
    <div className="flex items-center gap-2">

      {/* =====================================================
          LANGUAGE
      ===================================================== */}

      <div className="relative">

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >
          <span className="text-base">
            🌐
          </span>

          <span>
            {currentLanguage.nativeLabel}
          </span>

          <span className="text-[10px]">
            ▼
          </span>
        </button>

        {languageOpen && (
          <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-2xl">

            <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
              Language
            </p>

            <div className="space-y-1">

              {LANGUAGES.map((item) => {
                const active =
                  item.code === language;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setLanguageOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--app-text)] hover:bg-[var(--app-bg-secondary)]"
                    }`}
                  >

                    <div>
                      <div className="font-semibold">
                        {item.nativeLabel}
                      </div>

                      <div className="mt-0.5 text-xs text-[var(--app-muted)]">
                        {item.label}
                      </div>
                    </div>

                    {active && (
                      <span className="text-sm">
                        ✓
                      </span>
                    )}

                  </button>
                );
              })}

            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          THEME
      ===================================================== */}

      <div className="relative">

        <button
          type="button"
          onClick={toggleTheme}
          className="flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >

          <span className="text-base">
            🎨
          </span>

          <span>
            {currentTheme.label}
          </span>

          <span className="text-[10px]">
            ▼
          </span>

        </button>

        {themeOpen && (
          <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-2xl">

            <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
              Theme
            </p>

            <div className="space-y-1">

              {THEMES.map((item) => {
                const active =
                  item.name === theme;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setTheme(item.name);
                      setThemeOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--app-text)] hover:bg-[var(--app-bg-secondary)]"
                    }`}
                  >

                    <span
                      className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span className="flex-1 font-semibold">
                      {item.label}
                    </span>

                    {active && (
                      <span className="text-sm">
                        ✓
                      </span>
                    )}

                  </button>
                );
              })}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}