import type { ReactNode } from "react";
import { useI18n } from "../../context/I18nContext";
import type { FieldError } from "../../utils/validation";

type ControlProps = { id: string; "aria-invalid"?: true; "aria-describedby"?: string; required?: boolean };

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: FieldError;
  required?: boolean;
  optional?: boolean;
  children: (control: ControlProps) => ReactNode;
};

/** Label + hint + error wrapper that wires up aria attributes for any control. */
export function FormField({ id, label, hint, error, required, optional, children }: Props) {
  const { t } = useI18n();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
        {optional && <span className="field__opt"> ({t("common.optional")})</span>}
      </label>
      {hint && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, required })}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {t(error.key, error.n !== undefined ? { n: error.n } : undefined)}
        </p>
      )}
    </div>
  );
}
