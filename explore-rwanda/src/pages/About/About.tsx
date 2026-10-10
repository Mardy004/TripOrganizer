import { Icon } from "../../components/common/Icon";
import { SectionHeading } from "../../components/common/SectionHeading";
import { TrustLegend } from "../../components/common/TrustLegend";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import type { TranslationKey } from "../../translations";
import { aboutPhoto } from "../../data/photos";

const HOW = [1, 2, 3, 4] as const;
const TRUST = [1, 2, 3, 4] as const;
const PRINCIPLES = [1, 2, 3, 4] as const;

export default function About() {
  const { t } = useI18n();
  useDocumentTitle(`${t("nav.about")} | Explore Rwanda`);
  return (
    <>
      <div className="page-photo" style={{ backgroundImage: `url(${aboutPhoto})` }}>
        <div className="page-photo__scrim" aria-hidden="true" />
        <div className="container container--narrow section page-photo__inner">
          <SectionHeading
            as="h1"
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
            description={t("about.lead")}
          />
        </div>
      </div>

      <section className="section section--tint" aria-labelledby="about-principles">
        <div className="container">
          <SectionHeading as="h2" title={t("about.principlesTitle")} />
          <ul className="principles">
            {PRINCIPLES.map((n) => (
              <li key={n}>
                <span className="principles__num" aria-hidden="true">
                  {n}
                </span>
                <div>
                  <h3 className="t-h3">{t(`about.p${n}.title` as TranslationKey)}</h3>
                  <p className="t-muted">{t(`about.p${n}.text` as TranslationKey)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.how.eyebrow")}
            title={t("home.how.title")}
          />
          <ol className="steps">
            {HOW.map((n) => (
              <li key={n} className="steps__item">
                <span className="steps__num">{n}</span>
                <h3 className="t-h3">{t(`home.how.${n}.title` as TranslationKey)}</h3>
                <p className="t-muted">{t(`home.how.${n}.text` as TranslationKey)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint" id="safety">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.trust.eyebrow")}
            title={t("home.trust.title")}
          />
          <div className="trust-grid">
            {TRUST.map((n) => (
              <div key={n} className="trust-grid__item">
                <Icon name="check" size={22} />
                <h3 className="t-h3">{t(`home.trust.${n}.title` as TranslationKey)}</h3>
                <p className="t-muted">{t(`home.trust.${n}.text` as TranslationKey)}</p>
              </div>
            ))}
          </div>
          <TrustLegend />
        </div>
      </section>
    </>
  );
}

