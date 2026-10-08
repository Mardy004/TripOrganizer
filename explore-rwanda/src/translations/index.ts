import type { Language } from "../config";
import { en } from "./en";
import type { TranslationKey } from "./en";
import { rw } from "./rw";

export type { TranslationKey };
export { en };

export const translations: Record<Language, Record<TranslationKey, string>> = { en, rw };
