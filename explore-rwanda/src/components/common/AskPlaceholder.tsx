import { useI18n } from "../../context/I18nContext";

/**
 * Visual slot for the future "Ask Explore Rwanda" assistant. Intentionally non-functional: it is
 * disabled and connects to nothing. Future AI should answer from structured platform data only.
 */
export function AskPlaceholder() {
  const { t } = useI18n();
  return (
    <section className="ask" aria-labelledby="ask-title">
      <div className="container ask__inner">
        <div className="ask__text">
          <p className="t-label">{t("ask.eyebrow")}</p>
          <h2 id="ask-title" className="t-h2">
            {t("ask.title")}
          </h2>
          <p className="t-lead">{t("ask.text")}</p>
        </div>
        <div className="ask__box">
          <label htmlFor="ask-input" className="visually-hidden">
            {t("ask.title")} ({t("ask.eyebrow")})
          </label>
          <input id="ask-input" type="text" disabled placeholder={t("ask.placeholder")} />
          <ul className="ask__chips">
            <li>{t("ask.ex1")}</li>
            <li>{t("ask.ex2")}</li>
            <li>{t("ask.ex3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
