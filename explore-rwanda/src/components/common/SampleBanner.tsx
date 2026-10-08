import { useI18n } from "../../context/I18nContext";
import { MOCK_DATA } from "../../config";
import { SampleBadge } from "./Badges";

/** Slim, always-visible notice that content is illustrative while the product is in development. */
export function SampleBanner() {
  const { t } = useI18n();
  if (!MOCK_DATA) return null;
  return (
    <div className="sample-banner" role="note">
      <div className="container sample-banner__inner">
        <SampleBadge />
        <p>{t("sample.banner")}</p>
      </div>
    </div>
  );
}
