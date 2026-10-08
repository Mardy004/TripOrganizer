import type { TranslationKey } from "../translations";

/** Accepts local (0788 123 456) and international (+250 788 123 456) numbers; digits only after cleaning. */
export const isValidPhone = (value: string): boolean => /^\+?\d{9,13}$/.test(value.replace(/[\s-]/g, ""));

export const isValidEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value.trim());

/**
 * Validation stores translation keys (not text), so error messages follow the language switcher
 * even after the error appeared.
 */
export type FieldError = { key: Extract<TranslationKey, `error.${string}`>; n?: number };
export type Errors<T> = Partial<Record<keyof T, FieldError>>;

export const required = (value: string): FieldError | undefined =>
  value.trim() ? undefined : { key: "error.required" };

export const phone = (value: string): FieldError | undefined => {
  if (!value.trim()) return { key: "error.required" };
  return isValidPhone(value) ? undefined : { key: "error.phone" };
};

export const optionalEmail = (value: string): FieldError | undefined =>
  !value.trim() || isValidEmail(value) ? undefined : { key: "error.email" };

export const minLength = (value: string, n: number): FieldError | undefined =>
  value.trim().length >= n ? undefined : { key: "error.minLength", n };

export const hasErrors = (errors: Record<string, unknown>): boolean => Object.values(errors).some(Boolean);
