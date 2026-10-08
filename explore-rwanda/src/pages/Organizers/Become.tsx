import { Button } from "../../components/common/Button";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import type { TranslationKey } from "../../translations";

const RESP = [1, 2, 3, 4] as const;
const VERIFY = [1, 2, 3, 4, 5] as const;
const QUALITY = [1, 2, 3] as const;

export default function Become() {
  const { t } = useI18n();
  useDocumentTitle(`${t("become.title")} — Explore Rwanda`);
  return (
    <div className="container container--narrow section prose">
      <p className="t-label">{t("become.eyebrow")}</p>
      <h1 className="t-h1">{t("become.title")}</h1>
      <p className="t-lead">{t("become.lead")}</p>

      <h2 className="t-h2">{t("become.whoTitle")}</h2>
      <ul className="bullets">
        <li>{t("become.who.individual")}</li>
        <li>{t("become.who.company")}</li>
      </ul>

      <h2 className="t-h2">{t("become.respTitle")}</h2>
      <ul className="bullets">
        {RESP.map((n) => (
          <li key={n}>{t(`become.resp.${n}` as TranslationKey)}</li>
        ))}
      </ul>

      <h2 className="t-h2">{t("become.verifyTitle")}</h2>
      <ol className="bullets bullets--num">
        {VERIFY.map((n) => (
          <li key={n}>{t(`become.verify.${n}` as TranslationKey)}</li>
        ))}
      </ol>

      <h2 className="t-h2">{t("become.qualityTitle")}</h2>
      <ul className="bullets">
        {QUALITY.map((n) => (
          <li key={n}>{t(`become.quality.${n}` as TranslationKey)}</li>
        ))}
      </ul>

      <Button to="/organize/request" size="lg" block>
        {t("become.cta")}
      </Button>
      <p className="t-caption">{t("become.note")}</p>
    </div>
  );
}
