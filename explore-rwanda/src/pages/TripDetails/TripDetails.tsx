import { Link, useParams } from "react-router-dom";
import { ApprovedBadge, StatusBadge, TrustLabel, VerificationBadge } from "../../components/common/Badges";
import { Button } from "../../components/common/Button";
import { LandscapeImage } from "../../components/common/LandscapeImage";
import { RatingDisplay } from "../../components/common/RatingDisplay";
import { SaveButton } from "../../components/common/SaveButton";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/StateViews";
import { EntryFee } from "../../components/destination/EntryFee";
import { AvailabilityBadge } from "../../components/trip/AvailabilityBadge";
import { RegisterPanel, StickyCta } from "../../components/trip/RegisterPanel";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import { formatDate, formatRange } from "../../utils/format";
import type { Trip } from "../../types";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function Detail({ trip: tr }: { trip: Trip }) {
  const { t, lang } = useI18n();
  useDocumentTitle(`${tr.title} - Explore Rwanda`);
  const dest = useAsync(() => destinationService.getBySlug(tr.destinationSlug), [tr.destinationSlug]);

  return (
    <article className="trip-detail">
      <div className="detail-hero">
        <LandscapeImage tone={tr.imageTone} alt="" className="detail-hero__img" />
      </div>
      <div className="container detail">
        <div className="detail__main">
          <header className="detail__header">
            <div className="badge-row">
              <StatusBadge status={tr.status} />
              {tr.approved && <ApprovedBadge />}
            </div>
            <h1 className="t-h1">{tr.title}</h1>
            <p className="t-lead">
              <Link to={`/destinations/${tr.destinationSlug}`}>{tr.destinationName}</Link>
            </p>
            <div className="detail__meta">
              <RatingDisplay value={tr.rating} count={tr.reviewCount} />
              <SaveButton type="trip" id={tr.id} name={tr.title} className="save-btn--text" />
            </div>
          </header>

          <section aria-label={t("trip.datetime")}>
            <dl className="facts">
              <div>
                <dt>{t("trip.datetime")}</dt>
                <dd>
                  {formatDate(tr.date, lang)}
                  <br />
                  {t("trip.departs", { time: tr.startTime })} · {t("trip.returns", { time: tr.returnTime })}
                </dd>
              </div>
              <div>
                <dt>{t("trip.startingLocation")}</dt>
                <dd>{tr.startingLocation}</dd>
              </div>
              <div>
                <dt>{t("trip.meetingPoint")}</dt>
                <dd>{tr.meetingPoint}</dd>
              </div>
              <div>
                <dt>{t("trip.transport")}</dt>
                <dd>{tr.transportation}</dd>
              </div>
              <div>
                <dt>{t("trip.groupSize")}</dt>
                <dd>
                  {t("trip.groupSizeText", { capacity: tr.capacity, n: tr.capacity - tr.availableSpaces })}
                  <br />
                  <span className="t-caption">{t("trip.groupSizeHint")}</span>
                </dd>
              </div>
            </dl>
            <AvailabilityBadge trip={tr} />
          </section>

          <section>
            <h2 className="t-h2">{t("trip.overview")}</h2>
            <p>{tr.overview}</p>
          </section>

          <section className="card cost-card">
            <h2 className="t-h2">{t("trip.cost")}</h2>
            <p className="join__amount">
              {formatRange({ min: tr.estimatedCostMin, max: tr.estimatedCostMax }, tr.currency)}{" "}
              <span className="t-caption">{t("trip.perPerson")}</span>
            </p>
            <TrustLabel kind="estimated" />
            <p className="t-caption">{t("trip.costNote")}</p>
            <h3 className="t-h3">{t("trip.entryFees")}</h3>
            <p>{tr.entryIncluded ? t("trip.entryIncluded") : t("trip.entryNotIncluded")}</p>
            {dest.data && <EntryFee fee={dest.data.entryFee} variant="inline" />}
            <h3 className="t-h3">{t("trip.food")}</h3>
            <p>{tr.foodNote}</p>
          </section>

          <section>
            <h2 className="t-h2">{t("trip.schedule")}</h2>
            <ol className="timeline">
              {tr.schedule.map((s) => (
                <li key={`${s.time}-${s.title}`}>
                  <span className="timeline__time">{s.time}</span>
                  <div>
                    <strong>{s.title}</strong>
                    {s.detail && <p className="t-muted">{s.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="t-h2">{t("trip.bring")}</h2>
            <Bullets items={tr.whatToBring} />
          </section>

          <section>
            <h2 className="t-h2">{t("trip.requirements")}</h2>
            <Bullets items={tr.requirements} />
            <h2 className="t-h2">{t("trip.safety")}</h2>
            <Bullets items={tr.safety} />
          </section>

          <section className="card organizer-box">
            <h2 className="t-h3">{t("trip.organizer")}</h2>
            <p className="t-label">{t("trip.organizedBy")}</p>
            <p>
              <Link to={`/organizers/${tr.organizerId}`} className="t-h3">
                {tr.organizerName}
              </Link>
            </p>
            {tr.verified && <VerificationBadge type={tr.organizerType} />}
            <Button to={`/organizers/${tr.organizerId}`} variant="secondary">
              {t("org.viewProfile")}
            </Button>
          </section>

          <p>
            <Link to={`/destinations/${tr.destinationSlug}`}>{t("trip.destinationLink")} →</Link>
          </p>
        </div>

        <aside className="detail__side">
          <RegisterPanel trip={tr} />
        </aside>
      </div>
      <StickyCta trip={tr} />
    </article>
  );
}

export function useTrip(id: string) {
  return useAsync(() => tripService.getById(id), [id]);
}

export default function TripDetails() {
  const { id = "" } = useParams();
  const { t } = useI18n();
  const state = useTrip(id);
  useDocumentTitle("Explore Rwanda");
  const wrap = (node: React.ReactNode) => <div className="container section">{node}</div>;
  if (state.status === "loading") return wrap(<LoadingState />);
  if (state.status === "error") return wrap(<ErrorState onRetry={state.retry} />);
  if (!state.data)
    return wrap(
      <EmptyState
        title={t("trip.notFound")}
        message={t("trip.notFoundText")}
        action={
          <Button to="/trips" variant="secondary">
            {t("nav.trips")}
          </Button>
        }
      />,
    );
  return <Detail trip={state.data} />;
}
