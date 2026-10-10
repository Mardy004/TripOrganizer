import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { Destination } from "../../types";
import { formatMoney } from "../../utils/format";
import { startingFrom } from "../../utils/cost";
import { photoForDestination } from "../../data/photos";
import { LandscapeImage } from "../common/LandscapeImage";
import { RatingDisplay } from "../common/RatingDisplay";
import { SaveButton } from "../common/SaveButton";
import { Tag, TrustLabel } from "../common/Badges";
import { EntryFee } from "./EntryFee";

/** Mobile-first card: the entry fee and a starting cost are visible without opening the page. */
export function DestinationCard({ destination: d }: { destination: Destination }) {
  const { t } = useI18n();
  return (
    <article className="card dest-card">
      <div className="card__media">
        <LandscapeImage tone={d.imageTone} src={photoForDestination(d.id) ?? d.images[0]} alt={`${d.name}, ${t(`region.${d.region}`)}`} />
        <span className="card__region">{t(`region.${d.region}`)}</span>
        <SaveButton type="destination" id={d.id} name={d.name} className="card__save" />
      </div>
      <div className="card__body">
        <h3 className="t-h3">
          <Link to={`/destinations/${d.slug}`} className="card__title-link">
            {d.name}
          </Link>
        </h3>
        <div className="card__meta">
          <RatingDisplay value={d.rating} count={d.reviewCount} />
          <span className="t-caption">
            {t(`difficulty.${d.difficulty}`)} · {t(`duration.${d.duration}`)}
          </span>
        </div>
        <div className="card__price">
          <EntryFee fee={d.entryFee} variant="inline" />
          <p className="card__from">
            <span className="t-caption">{t("cost.startingFrom")}</span>
            <strong>{formatMoney(startingFrom(d))}</strong>
            <TrustLabel kind="estimated" />
          </p>
        </div>
        <div className="tags">
          {d.activities.slice(0, 3).map((a) => (
            <Tag key={a}>{t(`activity.${a}`)}</Tag>
          ))}
        </div>
      </div>
    </article>
  );
}
