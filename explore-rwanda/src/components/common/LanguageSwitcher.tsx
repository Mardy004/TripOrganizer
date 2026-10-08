import { LANGUAGES } from "../../config";
import type { Language } from "../../config";
import { useI18n } from "../../context/I18nContext";

const labels: Record<Language, string> = { en: "EN", rw: "RW" };

/** EN | RW toggle. Always visible in the header so language can be switched in one tap. */
export function LanguageSwitcher({ inverse = false }: { inverse?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang ${inverse ? "lang--inverse" : ""}`} role="group" aria-label={t("lang.label")}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang__btn ${lang === code ? "is-active" : ""}`}
          aria-pressed={lang === code}
          lang={code}
          title={t(`lang.${code}`)}
          onClick={() => setLang(code)}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
