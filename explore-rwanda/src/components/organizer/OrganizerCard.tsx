import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { Organizer } from "../../types";
import { initials } from "../../utils/format";
import { RatingDisplay } from "../common/RatingDisplay";
import { VerificationBadge } from "../common/Badges";

type Props = { organizer: Organizer; compact?: boolean };

export function OrganizerCard({ organizer: o, compact = false }: Props) {
  const { t } = useI18n();
  return (
    <article className={`card org-card ${compact ? "org-card--compact" : ""}`}>
      <div className="org-card__top">
        <div className="avatar" aria-hidden="true">
          {initials(o.name)}
        </div>
        <div>
          <h3 className="t-h3">
            <Link to={`/organizers/${o.id}`} className="card__title-link">
              {o.name}
            </Link>
          </h3>
          <p className="t-caption">{t("org.basedIn", { place: o.location })}</p>
        </div>
      </div>
      <VerificationBadge type={o.type} />
      <div className="card__meta">
        <RatingDisplay value={o.rating} count={o.reviewCount} />
      </div>
      <p className="org-card__stats">
        <span>{t("org.completedTrips", { n: o.completedTrips })}</span>
        <span>{t("org.experiences", { n: o.participantExperiences })}</span>
      </p>
      {!compact && <p className="t-small t-muted org-card__bio">{o.bio}</p>}
    </article>
  );
}
