import { useI18n } from "../../context/I18nContext";
import type { Origin } from "../../types";

export const ORIGINS: Origin[] = ["Kigali", "Rubavu", "Musanze", "Mahoko", "Other"];

type Props = { value: Origin; onChange: (origin: Origin) => void; idPrefix?: string };

/** Large tap-friendly radio chips. Starting location is a core concept of the product. */
export function OriginSelector({ value, onChange, idPrefix = "origin" }: Props) {
  const { t } = useI18n();
  return (
    <fieldset className="origin">
      <legend className="origin__legend">{t("cost.originTitle")}</legend>
      <p className="t-small t-muted origin__help">{t("cost.originHelp")}</p>
      <div className="origin__options">
        {ORIGINS.map((o) => (
          <label key={o} className={`chip ${value === o ? "chip--on" : ""}`}>
            <input type="radio" name={idPrefix} value={o} checked={value === o} onChange={() => onChange(o)} />
            {t(`origin.${o}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
