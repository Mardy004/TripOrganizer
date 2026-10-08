import { SectionHeading } from "../../components/common/SectionHeading";
import { TrustLegend } from "../../components/common/TrustLegend";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import type { TranslationKey } from "../../translations";

const HOW = [1, 2, 3, 4] as const;
const TRUST = [1, 2, 3, 4] as const;
const PRINCIPLES = [1, 2, 3, 4] as const;

export default function About() {
  const { t } = useI18n();
  useDocumentTitle(`${t("nav.about")} | Explore Rwanda`);
  return (
    <div className="container container--narrow section prose">
      <SectionHeading as="h1" eyebrow={t("about.eyebrow")} title={t("about.title")} description={t("about.lead")} />

      <h2 className="t-h2">{t("about.principlesTitle")}</h2>
      <ul className="principles">
        {PRINCIPLES.map((n) => (
          <li key={n}>
            <h3 className="t-h3">{t(`about.p${n}.title` as TranslationKey)}</h3>
            <p className="t-muted">{t(`about.p${n}.text` as TranslationKey)}</p>
          </li>
        ))}
      </ul>

      <section id="how-it-works">
        <h2 className="t-h2">{t("home.how.title")}</h2>
        <ol className="bullets bullets--num">
          {HOW.map((n) => (
            <li key={n}>
              <strong>{t(`home.how.${n}.title` as TranslationKey)}.</strong> {t(`home.how.${n}.text` as TranslationKey)}
            </li>
          ))}
        </ol>
      </section>

      <section id="safety">
        <h2 className="t-h2">{t("home.trust.title")}</h2>
        <ul className="principles">
          {TRUST.map((n) => (
            <li key={n}>
              <h3 className="t-h3">{t(`home.trust.${n}.title` as TranslationKey)}</h3>
              <p className="t-muted">{t(`home.trust.${n}.text` as TranslationKey)}</p>
            </li>
          ))}
        </ul>
        <TrustLegend />
      </section>
    </div>
  );
}
