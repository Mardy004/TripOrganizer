import { useState } from "react";
import type { FormEvent } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { organizerService } from "../../services";
import type { OrganizerRequest, OrganizerRequestResult, OrganizerType } from "../../types";
import { hasErrors, required } from "../../utils/validation";
import type { Errors } from "../../utils/validation";
import { AccountForm } from "../account/AccountForm";
import { Button } from "../common/Button";
import { FormField } from "../common/FormField";
import { Icon } from "../common/Icon";

type Step = "type" | "details" | "review" | "done";
const STEPS: Step[] = ["type", "details", "review", "done"];
const GROUP_SIZES = ["1", "2", "3", "4"] as const;

type Values = Omit<OrganizerRequest, "type">;
const empty: Values = {
  location: "",
  experience: "",
  areas: "",
  groupSize: "",
  companyName: "",
  companyInfo: "",
  agreed: false,
};

function Progress({ step }: { step: Step }) {
  const { t } = useI18n();
  const labels: Record<Step, string> = {
    type: t("apply.step.type"),
    details: t("apply.step.details"),
    review: t("apply.step.review"),
    done: t("apply.step.done"),
  };
  const current = STEPS.indexOf(step);
  return (
    <ol className="progress" aria-label="Progress">
      {STEPS.map((s, i) => (
        <li key={s} className={i < current ? "is-done" : i === current ? "is-current" : ""} aria-current={i === current ? "step" : undefined}>
          <span className="progress__dot">{i < current ? <Icon name="check" size={14} /> : i + 1}</span>
          <span className="progress__label">{labels[s]}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Visual flow only: Choose type → Application → Review → Pending verification. Nothing is verified,
 * stored or granted here; approval is an admin/backend concern.
 */
export function OrganizerApplication() {
  const { t } = useI18n();
  const { user } = useAccount();
  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<OrganizerType>("individual");
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<OrganizerRequestResult | null>(null);

  if (!user) {
    return (
      <div className="reg-gate">
        <h2 className="t-h2">{t("apply.gateTitle")}</h2>
        <p className="t-lead">{t("apply.gateText")}</p>
        <AccountForm idPrefix="apply-acct" />
      </div>
    );
  }

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateDetails = (): boolean => {
    const found: Errors<Values> = {
      location: required(values.location),
      experience: required(values.experience),
      areas: required(values.areas),
      groupSize: required(values.groupSize),
      companyName: type === "company" ? required(values.companyName ?? "") : undefined,
      companyInfo: type === "company" ? required(values.companyInfo ?? "") : undefined,
    };
    setErrors(found);
    if (hasErrors(found)) {
      const first = (Object.keys(found) as (keyof Values)[]).find((k) => found[k]);
      if (first) document.getElementById(`ap-${first}`)?.focus();
      return false;
    }
    return true;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.agreed) {
      setErrors({ agreed: { key: "error.consent" } });
      return;
    }
    setBusy(true);
    const res = await organizerService.submitRequest({ ...values, type });
    setBusy(false);
    setResult(res);
    setStep("done");
  };

  const groupLabel = (v: string) => (v ? t(`apply.groupSize.${v as (typeof GROUP_SIZES)[number]}`) : "");

  return (
    <div className="apply">
      <Progress step={step} />

      {step === "type" && (
        <section>
          <h2 className="t-h2">{t("apply.typeTitle")}</h2>
          <div className="choice-grid" role="radiogroup" aria-label={t("apply.typeTitle")}>
            {(["individual", "company"] as OrganizerType[]).map((ty) => (
              <label key={ty} className={`choice ${type === ty ? "is-on" : ""}`}>
                <input type="radio" name="org-type" checked={type === ty} onChange={() => setType(ty)} />
                <Icon name={ty === "company" ? "building" : "user"} size={28} />
                <span className="choice__title">{t(ty === "company" ? "apply.type.company" : "apply.type.individual")}</span>
                <span className="t-small t-muted">
                  {t(ty === "company" ? "apply.type.companyText" : "apply.type.individualText")}
                </span>
              </label>
            ))}
          </div>
          <div className="apply__nav">
            <Button size="lg" onClick={() => setStep("details")}>
              {t("common.continue")}
            </Button>
          </div>
        </section>
      )}

      {step === "details" && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (validateDetails()) setStep("review");
          }}
        >
          <h2 className="t-h2">{t(type === "company" ? "apply.type.company" : "apply.type.individual")}</h2>
          {type === "company" && (
            <>
              <FormField id="ap-companyName" label={t("apply.field.companyName")} required error={errors.companyName}>
                {(c) => <input {...c} type="text" value={values.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} />}
              </FormField>
              <FormField
                id="ap-companyInfo"
                label={t("apply.field.companyInfo")}
                hint={t("apply.field.companyInfoHint")}
                required
                error={errors.companyInfo}
              >
                {(c) => <textarea {...c} rows={3} value={values.companyInfo ?? ""} onChange={(e) => set("companyInfo", e.target.value)} />}
              </FormField>
            </>
          )}
          <FormField id="ap-location" label={t("apply.field.location")} required error={errors.location}>
            {(c) => <input {...c} type="text" value={values.location} onChange={(e) => set("location", e.target.value)} />}
          </FormField>
          <FormField
            id="ap-experience"
            label={t("apply.field.experience")}
            hint={t("apply.field.experienceHint")}
            required
            error={errors.experience}
          >
            {(c) => <textarea {...c} rows={4} value={values.experience} onChange={(e) => set("experience", e.target.value)} />}
          </FormField>
          <FormField id="ap-areas" label={t("apply.field.areas")} required error={errors.areas}>
            {(c) => <input {...c} type="text" value={values.areas} onChange={(e) => set("areas", e.target.value)} />}
          </FormField>
          <FormField id="ap-groupSize" label={t("apply.field.groupSize")} required error={errors.groupSize}>
            {(c) => (
              <select {...c} value={values.groupSize} onChange={(e) => set("groupSize", e.target.value)}>
                <option value="">{t("apply.select")}</option>
                {GROUP_SIZES.map((g) => (
                  <option key={g} value={g}>
                    {t(`apply.groupSize.${g}`)}
                  </option>
                ))}
              </select>
            )}
          </FormField>
          <p className="t-caption">{t("common.requiredNote")}</p>
          <div className="apply__nav">
            <Button variant="ghost" onClick={() => setStep("type")}>
              {t("common.back")}
            </Button>
            <Button type="submit" size="lg">
              {t("common.next")}
            </Button>
          </div>
        </form>
      )}

      {step === "review" && (
        <form noValidate onSubmit={submit}>
          <h2 className="t-h2">{t("apply.reviewTitle")}</h2>
          <dl className="summary">
            <div>
              <dt>{t("apply.step.type")}</dt>
              <dd>{t(type === "company" ? "apply.type.company" : "apply.type.individual")}</dd>
            </div>
            {type === "company" && (
              <div>
                <dt>{t("apply.field.companyName")}</dt>
                <dd>{values.companyName}</dd>
              </div>
            )}
            <div>
              <dt>{t("apply.contact")}</dt>
              <dd>
                {user.fullName} · {user.phone}
                {user.email ? ` · ${user.email}` : ""}
              </dd>
            </div>
            <div>
              <dt>{t("apply.field.location")}</dt>
              <dd>{values.location}</dd>
            </div>
            <div>
              <dt>{t("apply.field.experience")}</dt>
              <dd>{values.experience}</dd>
            </div>
            <div>
              <dt>{t("apply.field.areas")}</dt>
              <dd>{values.areas}</dd>
            </div>
            <div>
              <dt>{t("apply.field.groupSize")}</dt>
              <dd>{groupLabel(values.groupSize)}</dd>
            </div>
          </dl>
          <div className={`field field--check ${errors.agreed ? "field--error" : ""}`}>
            <label className="check">
              <input
                id="ap-agreed"
                type="checkbox"
                checked={values.agreed}
                aria-invalid={errors.agreed ? true : undefined}
                onChange={(e) => set("agreed", e.target.checked)}
              />
              <span>{t("apply.agree")}</span>
            </label>
            {errors.agreed && (
              <p className="field__error" role="alert">
                {t(errors.agreed.key)}
              </p>
            )}
          </div>
          <p className="t-caption">{t("apply.demoNote")}</p>
          <div className="apply__nav">
            <Button variant="ghost" onClick={() => setStep("details")}>
              {t("common.edit")}
            </Button>
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? t("apply.submitting") : t("apply.submit")}
            </Button>
          </div>
        </form>
      )}

      {step === "done" && result && (
        <div className="form-success" role="status">
          <p className="t-label">{t("reg.reference", { ref: result.reference })}</p>
          <h2 className="t-h2">{t("apply.doneTitle")}</h2>
          <p className="t-lead">{t("apply.doneText")}</p>
          <ol className="status-track">
            <li className="is-done">{t("apply.status.submitted")}</li>
            <li className="is-current">{t("apply.status.review")}</li>
            <li>{t("apply.status.decision")}</li>
          </ol>
          <p className="notice">{t("apply.doneNote")}</p>
          <Button to="/trips" variant="secondary">
            {t("nav.trips")}
          </Button>
        </div>
      )}
    </div>
  );
}
