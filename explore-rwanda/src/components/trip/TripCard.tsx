import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { Trip } from "../../types";
import { formatDate, formatMoney } from "../../utils/format";
import { photoForDestination } from "../../data/photos";
import { LandscapeImage } from "../common/LandscapeImage";
import { RatingDisplay } from "../common/RatingDisplay";
import { SaveButton } from "../common/SaveButton";
import { StatusBadge, TrustLabel, VerificationBadge } from "../common/Badges";
import { AvailabilityBadge } from "./AvailabilityBadge";

/**
 * Card order follows the mobile priority: image, destination, rating, date, price, availability,
 * organizer status. The whole card is one link (via the title) so the tap target is large.
 */
export function TripCard({ trip: tr }: { trip: Trip }) {
  const { t, lang } = useI18n();
  const inactive = tr.status === "full" || tr.status === "closed" || tr.status === "cancelled";
  return (
    <article className={`card trip-card ${inactive ? "trip-card--inactive" : ""}`}>
      <div className="card__media">
        <LandscapeImage tone={tr.imageTone} src={photoForDestination(tr.destinationId)} alt={`${tr.destinationName}`} />
        <span className="card__region">{t(`activity.${tr.activity}`)}</span>
        <div className="card__badges">
          <StatusBadge status={tr.status} />
        </div>
        <SaveButton type="trip" id={tr.id} name={tr.title} className="card__save card__save--low" />
      </div>
      <div className="card__body">
        <p className="t-label">{tr.destinationName}</p>
        <h3 className="t-h3">
          <Link to={`/trips/${tr.id}`} className="card__title-link">
            {tr.title}
          </Link>
        </h3>
        <div className="card__meta">
          <RatingDisplay value={tr.rating} count={tr.reviewCount} />
        </div>
        <dl className="facts">
          <div>
            <dt>{t("trip.datetime")}</dt>
            <dd>{formatDate(tr.date, lang)}</dd>
          </div>
          <div>
            <dt>{t("trip.startingLocation")}</dt>
            <dd>{tr.startingLocation}</dd>
          </div>
        </dl>
        <div className="card__price">
          <p className="card__from">
            <span className="t-caption">{t("trip.estPerPerson")}</span>
            <strong>{t("common.from", { price: formatMoney(tr.estimatedCostMin, tr.currency) })}</strong>
            <TrustLabel kind="estimated" />
          </p>
        </div>
        <AvailabilityBadge trip={tr} />
        <div className="trip-card__org">
          <span className="t-caption">{t("trip.organizedBy")}</span>
          <strong>{tr.organizerName}</strong>
          {tr.verified && <VerificationBadge type={tr.organizerType} />}
        </div>
      </div>
    </article>
  );
}
