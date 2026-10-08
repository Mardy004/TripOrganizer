import { useState } from "react";
import type { FormEvent } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import type { User } from "../../types";
import { hasErrors, optionalEmail, phone, required } from "../../utils/validation";
import type { Errors } from "../../utils/validation";
import { Button } from "../common/Button";
import { FormField } from "../common/FormField";

type Values = { fullName: string; phone: string; email: string; consent: boolean };
type Props = { onCreated?: (user: User) => void; idPrefix?: string };

/** Collects only what an account needs: name and phone required, email optional. */
export function AccountForm({ onCreated, idPrefix = "acct" }: Props) {
  const { t } = useI18n();
  const { createAccount } = useAccount();
  const [values, setValues] = useState<Values>({ fullName: "", phone: "", email: "", consent: false });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors<Values> = {
      fullName: required(values.fullName),
      phone: phone(values.phone),
      email: optionalEmail(values.email),
      consent: values.consent ? undefined : { key: "error.consent" },
    };
    setErrors(found);
    if (hasErrors(found)) {
      const first = (Object.keys(found) as (keyof Values)[]).find((k) => found[k]);
      if (first) document.getElementById(`${idPrefix}-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const user = await createAccount({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || undefined,
    });
    setBusy(false);
    onCreated?.(user);
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <FormField id={`${idPrefix}-fullName`} label={t("field.fullName")} required error={errors.fullName}>
        {(c) => (
          <input
            {...c}
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        )}
      </FormField>
      <FormField id={`${idPrefix}-phone`} label={t("field.phone")} hint={t("field.phoneHint")} required error={errors.phone}>
        {(c) => (
          <input
            {...c}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        )}
      </FormField>
      <FormField id={`${idPrefix}-email`} label={t("field.email")} hint={t("field.emailHint")} optional error={errors.email}>
        {(c) => (
          <input
            {...c}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        )}
      </FormField>

      <div className={`field field--check ${errors.consent ? "field--error" : ""}`}>
        <label className="check">
          <input
            id={`${idPrefix}-consent`}
            type="checkbox"
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined}
            onChange={(e) => set("consent", e.target.checked)}
          />
          <span>{t("reg.accountConsent")}</span>
        </label>
        {errors.consent && (
          <p className="field__error" id={`${idPrefix}-consent-error`} role="alert">
            {t(errors.consent.key)}
          </p>
        )}
      </div>

      <p className="t-caption">{t("common.requiredNote")}</p>
      <Button type="submit" size="lg" block disabled={busy}>
        {busy ? t("reg.creating") : t("reg.createAccount")}
      </Button>
      <p className="t-caption form__demo">{t("reg.demoNote")}</p>
    </form>
  );
}
