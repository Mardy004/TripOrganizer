import { useState } from "react";
import { useI18n } from "../../context/I18nContext";
import type { Destination, Origin } from "../../types";
import { costFrom, fromKigali, startingFrom, typicalVisit } from "../../utils/cost";
import { formatDateShort, formatMoney, formatRange, formatTravel } from "../../utils/format";
import { TrustLabel } from "../common/Badges";
import { Icon } from "../common/Icon";
import { OriginSelector } from "./OriginSelector";

type Props = { destination: Destination };

/**
 * The core "what does it take to go?" block: headline costs, an origin selector and an itemised
 * estimate. Everything is labelled as an estimate with its last-updated date.
 */
export function PriceEstimate({ destination: d }: Props) {
  const { t, lang } = useI18n();
  const [origin, setOrigin] = useState<Origin>("Kigali");
  const { summary, isReference } = costFrom(d, origin);
  const e = summary.estimate;
  const travel = formatTravel(e.travelMinutes.min, e.travelMinutes.max);
  const kigali = fromKigali(d);
  const entryRow =
    d.entryFee.kind === "amount"
      ? formatMoney(d.entryFee.amount)
      : d.entryFee.kind === "none_known"
        ? t("entry.none")
        : t("cost.notIncluded");

  return (
    <section className="estimate" aria-labelledby="estimate-title">
      <header className="estimate__head">
        <p className="t-label">{t("cost.eyebrow")}</p>
        <h2 id="estimate-title" className="t-h2">
          {t("cost.title")}
        </h2>
      </header>

      <ul className="estimate__tiles">
        <li>
          <p className="estimate__tile-label">{t("cost.startingFrom")}</p>
          <p className="estimate__tile-value">{formatMoney(startingFrom(d))}</p>
          <p className="t-caption">{t("cost.startingFromHint")}</p>
        </li>
        <li>
          <p className="estimate__tile-label">{t("cost.typical")}</p>
          <p className="estimate__tile-value">{formatRange(typicalVisit(d))}</p>
          <p className="t-caption">{t("cost.typicalHint")}</p>
        </li>
        {kigali && (
          <li>
            <p className="estimate__tile-label">{t("cost.fromKigali")}</p>
            <p className="estimate__tile-value">{formatRange(kigali)}</p>
          </li>
        )}
      </ul>

      <OriginSelector value={origin} onChange={setOrigin} idPrefix={`origin-${d.id}`} />

      {origin === "Other" && (
        <p className="notice" role="status">
          <Icon name="info" size={18} /> {t("cost.otherNote")}
        </p>
      )}

      <div className="estimate__card" aria-live="polite">
        <p className="estimate__from">
          {isReference ? t("cost.referenceFrom") : t("cost.from", { origin: t(`origin.${summary.origin}`) })}
          <span>
            {" "}
            · {t(travel.unit === "hr" ? "cost.travelHr" : "cost.travelMin", { time: travel.time })} ·{" "}
            {t("cost.distance", { km: e.distanceKm })}
          </span>
        </p>
        <dl className="estimate__rows">
          <div>
            <dt>{t("cost.transport")}</dt>
            <dd>{formatRange(e.transport)}</dd>
          </div>
          <div>
            <dt>{t("cost.entry")}</dt>
            <dd>{entryRow}</dd>
          </div>
          <div>
            <dt>{t("cost.food")}</dt>
            <dd>{formatRange(e.food)}</dd>
          </div>
          <div>
            <dt>{t("cost.activities")}</dt>
            <dd>{formatRange(e.activities)}</dd>
          </div>
          <div className="estimate__total">
            <dt>{t("cost.total")}</dt>
            <dd>{formatRange(summary.total)}</dd>
          </div>
        </dl>
        {summary.entryMissing && <p className="t-caption estimate__warn">{t("cost.entryMissing")}</p>}
        <div className="estimate__foot">
          <TrustLabel kind="estimated" updated={t("cost.updated", { date: formatDateShort(d.lastUpdated, lang) })} />
          <p className="t-caption">{t("cost.disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
