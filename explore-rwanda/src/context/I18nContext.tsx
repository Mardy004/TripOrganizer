import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_LANGUAGE } from "../config";
import type { Language } from "../config";
import { translations } from "../translations";
import type { TranslationKey } from "../translations";

type Vars = Record<string, string | number>;

type I18n = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
};

const STORAGE_KEY = "er.lang";
const Ctx = createContext<I18n | null>(null);

const readStored = (): Language => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "rw") return v;
  } catch {
    /* storage unavailable - fall back to default */
  }
  return DEFAULT_LANGUAGE;
};

/** Pure translate function - exported so it can be tested without React. */
export function translate(lang: Language, key: TranslationKey, vars?: Vars): string {
  const dict = translations[lang] as Record<string, string>;
  const fallback = translations.en as Record<string, string>;
  let k: string = key;
  if (vars && vars.n === 1 && `${key}.one` in dict) k = `${key}.one`;
  const template = dict[k] ?? fallback[k] ?? key;
  return vars ? template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`)) : template;
}

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Language }) {
  const [lang, setLangState] = useState<Language>(() => initial ?? readStored());

  useEffect(() => {
    document.documentElement.lang = lang === "rw" ? "rw" : "en";
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: TranslationKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
