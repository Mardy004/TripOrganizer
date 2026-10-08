import { useI18n } from "../../context/I18nContext";
import { TrustLabel } from "../common/Badges";
import type { TrustKind } from "../common/Badges";

const kinds: TrustKind[] = ["verified", "community", "estimated"];

/** Explains the three labels used across the product. */
export function TrustLegend() {
  const { t } = useI18n();
  return (
    <section className="legend" aria-labelledby="legend-title">
      <h2 id="legend-title" className="t-h3">
        {t("trust.legend.title")}
      </h2>
      <dl className="legend__list">
        {kinds.map((k) => (
          <div key={k}>
            <dt>
              <TrustLabel kind={k} />
            </dt>
            <dd>{t(`trust.legend.${k}`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
