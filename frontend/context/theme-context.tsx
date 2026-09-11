"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeName =
  | "cyan"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "white";

export type Language =
  | "en"
  | "hi"
  | "as"
  | "bn"
  | "kn";

export type ThemeConfig = {
  name: ThemeName;
  label: string;
  color: string;
  light: boolean;
};

export const THEMES: ThemeConfig[] = [
  {
    name: "cyan",
    label: "Cyan",
    color: "#22d3ee",
    light: false,
  },
  {
    name: "blue",
    label: "Blue",
    color: "#60a5fa",
    light: false,
  },
  {
    name: "violet",
    label: "Violet",
    color: "#a78bfa",
    light: false,
  },
  {
    name: "emerald",
    label: "Emerald",
    color: "#34d399",
    light: false,
  },
  {
    name: "amber",
    label: "Amber",
    color: "#fbbf24",
    light: false,
  },
  {
    name: "rose",
    label: "Rose",
    color: "#fb7185",
    light: false,
  },
  {
    name: "white",
    label: "White",
    color: "#f8fafc",
    light: true,
  },
];

export const LANGUAGES: {
  code: Language;
  label: string;
  nativeLabel: string;
}[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
  },
  {
    code: "as",
    label: "Assamese",
    nativeLabel: "অসমীয়া",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
  },
];

type ThemeContextType = {
  theme: ThemeName;
  language: Language;
  setTheme: (theme: ThemeName) => void;
  setLanguage: (language: Language) => void;
  themeConfig: ThemeConfig;
};

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemeName>("cyan");

  const [language, setLanguageState] =
    useState<Language>("en");

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "retinascreen-theme"
      ) as ThemeName | null;

    const savedLanguage =
      localStorage.getItem(
        "retinascreen-language"
      ) as Language | null;

    if (
      savedTheme &&
      THEMES.some(
        (item) => item.name === savedTheme
      )
    ) {
      setThemeState(savedTheme);
    }

    if (
      savedLanguage &&
      LANGUAGES.some(
        (item) => item.code === savedLanguage
      )
    ) {
      setLanguageState(savedLanguage);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.documentElement.setAttribute(
      "data-language",
      language
    );

    localStorage.setItem(
      "retinascreen-theme",
      theme
    );

    localStorage.setItem(
      "retinascreen-language",
      language
    );
  }, [theme, language, mounted]);

  const themeConfig =
    THEMES.find(
      (item) => item.name === theme
    ) ?? THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        language,
        setTheme: setThemeState,
        setLanguage: setLanguageState,
        themeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}