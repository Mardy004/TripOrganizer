import { useState } from "react";
import type { FormEvent } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { tripService } from "../../services";
import type { Trip, TripRegistrationResult } from "../../types";
import { hasErrors, phone, required } from "../../utils/validation";
import type { Errors } from "../../utils/validation";
import { AccountForm } from "../account/AccountForm";
import { Button } from "../common/Button";
import { FormField } from "../common/FormField";
import { Icon } from "../common/Icon";

type Values = { idNumber: string; emergencyName: string; emergencyPhone: string; consent: boolean };

/**
 * Two-stage registration: (1) a short account if the visitor has none, (2) only the extra details
 * this particular trip needs. Collects only what is necessary for the action.
 */
export function RegistrationForm({ trip }: { trip: Trip }) {
  const { t } = useI18n();
  const { user } = useAccount();
  const [values, setValues] = useState<Values>({ idNumber: "", emergencyName: "", emergencyPhone: "", consent: false });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TripRegistrationResult | null>(null);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  if (result) {
    return (
      <div className="form-success" role="status">
        <Icon name="check" size={36} className="form-success__mark" />
        <h2 className="t-h2">{t("reg.successTitle")}</h2>
        <p className="t-lead">{t("reg.successText", { organizer: trip.organizerName })}</p>
        <p className="notice">{t("reg.successStatus")}</p>
        <p className="t-caption">{t("reg.reference", { ref: result.reference })}</p>
        <div className="form-success__actions">
          <Button to={`/trips/${trip.id}`} variant="secondary">
            {t("reg.backToTrip")}
          </Button>
          <Button to="/trips" variant="ghost">
            {t("nav.trips")}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="reg-gate">
        <h2 className="t-h2">{t("reg.required")}</h2>
        <p className="t-lead">{t("reg.requiredText")}</p>
        <ul className="checklist">
          <li>{t("reg.why.name")}</li>
          <li>{t("reg.why.phone")}</li>
          <li>{t("reg.why.email")}</li>
        </ul>
        <p className="t-caption">
          <strong>{t("reg.useTitle")}.</strong> {t("reg.useText")}
        </p>
        <AccountForm idPrefix="reg" />
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors<Values> = {
      idNumber: trip.requiresId ? required(values.idNumber) : undefined,
      emergencyName: required(values.emergencyName),
      emergencyPhone: phone(values.emergencyPhone),
      consent: values.consent ? undefined : { key: "error.consent" },
    };
    setErrors(found);
    if (hasErrors(found)) {
      const first = (Object.keys(found) as (keyof Values)[]).find((k) => found[k]);
      if (first) document.getElementById(`tr-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const res = await tripService.register({
      tripId: trip.id,
      idNumber: trip.requiresId ? values.idNumber.trim() : undefined,
      emergencyName: values.emergencyName.trim(),
      emergencyPhone: values.emergencyPhone.trim(),
    });
    setBusy(false);
    setResult(res);
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="notice notice--ok">
        <p>
          <strong>{t("reg.registeringAs")}</strong> {user.fullName} · {user.phone}
        </p>
      </div>
      <h2 className="t-h2">{t("reg.extraTitle")}</h2>

      {trip.requiresId && (
        <FormField id="tr-idNumber" label={t("field.idNumber")} hint={t("field.idHint")} required error={errors.idNumber}>
          {(c) => (
            <input {...c} type="text" autoComplete="off" value={values.idNumber} onChange={(e) => set("idNumber", e.target.value)} />
          )}
        </FormField>
      )}
      <FormField id="tr-emergencyName" label={t("field.emergencyName")} hint={t("field.emergencyHint")} required error={errors.emergencyName}>
        {(c) => (
          <input {...c} type="text" value={values.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
        )}
      </FormField>
      <FormField id="tr-emergencyPhone" label={t("field.emergencyPhone")} hint={t("field.phoneHint")} required error={errors.emergencyPhone}>
        {(c) => (
          <input
            {...c}
            type="tel"
            inputMode="tel"
            value={values.emergencyPhone}
            onChange={(e) => set("emergencyPhone", e.target.value)}
          />
        )}
      </FormField>

      <div className={`field field--check ${errors.consent ? "field--error" : ""}`}>
        <label className="check">
          <input
            id="tr-consent"
            type="checkbox"
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            onChange={(e) => set("consent", e.target.checked)}
          />
          <span>{t("reg.consent")}</span>
        </label>
        {errors.consent && (
          <p className="field__error" role="alert">
            {t(errors.consent.key)}
          </p>
        )}
      </div>

      <p className="t-caption">{t("common.requiredNote")}</p>
      <Button type="submit" size="lg" block disabled={busy}>
        {busy ? t("reg.submitting") : t("reg.submit")}
      </Button>
    </form>
  );
}
