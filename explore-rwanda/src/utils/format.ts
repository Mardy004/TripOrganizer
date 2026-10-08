import { CURRENCY } from "../config";
import type { CostRange, Language } from "../types";

const locales: Record<Language, string> = { en: "en-GB", rw: "rw" };

const num = (n: number): string => n.toLocaleString("en-US");

export const formatMoney = (amount: number, currency = CURRENCY): string => `${num(amount)} ${currency}`;

export const formatRange = ({ min, max }: CostRange, currency = CURRENCY): string =>
  min === max ? formatMoney(min, currency) : `${num(min)}–${num(max)} ${currency}`;

const toDate = (iso: string): Date => new Date(`${iso}T00:00:00`);

const safeDate = (iso: string, lang: Language, options: Intl.DateTimeFormatOptions): string => {
  try {
    return toDate(iso).toLocaleDateString(locales[lang], options);
  } catch {
    return toDate(iso).toLocaleDateString("en-GB", options);
  }
};

export const formatDate = (iso: string, lang: Language): string =>
  safeDate(iso, lang, { weekday: "long", day: "numeric", month: "long" });

export const formatDateShort = (iso: string, lang: Language): string =>
  safeDate(iso, lang, { day: "numeric", month: "short", year: "numeric" });

export const formatRating = (value: number): string => value.toFixed(1);

export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const yearOf = (isoOrYear: string): string => isoOrYear.slice(0, 4);

/** Formats a travel-time range, e.g. {min:150,max:180} → { unit:"hr", time:"2.5–3" }. */
export const formatTravel = (min: number, max: number): { unit: "min" | "hr"; time: string } => {
  const tidy = (n: number) => String(Math.round(n * 10) / 10);
  if (max < 60) return { unit: "min", time: min === max ? String(min) : `${min}–${max}` };
  const a = tidy(min / 60);
  const b = tidy(max / 60);
  return { unit: "hr", time: a === b ? a : `${a}–${b}` };
};
