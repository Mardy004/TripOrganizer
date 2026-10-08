import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Tag, TrustLabel } from "../../components/common/Badges";
import { LandscapeImage } from "../../components/common/LandscapeImage";
import { RatingDisplay } from "../../components/common/RatingDisplay";
import { SaveButton } from "../../components/common/SaveButton";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/StateViews";
import { TrustLegend } from "../../components/common/TrustLegend";
import { EntryFee } from "../../components/destination/EntryFee";
import { PriceEstimate } from "../../components/destination/PriceEstimate";
import { ReviewSection } from "../../components/review/ReviewSection";
import { TripCard } from "../../components/trip/TripCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import { formatDateShort } from "../../utils/format";
import { isBookable } from "../../utils/filters";
import type { Destination } from "../../types";

function List({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function Detail({ d }: { d: Destination }) {
  const { t, lang } = useI18n();
  useDocumentTitle(`${d.name} — Explore Rwanda`);
  const trips = useAsync(() => tripService.getByDestination(d.id), [d.id]);
  const upcoming = trips.data?.filter((tr) => isBookable(tr)).length ?? 0;
  const tripsLabel =
    trips.status !== "success"
      ? "…"
      : upcoming === 0
        ? t("facts.tripsNone")
        : t(upcoming === 1 ? "facts.tripsCount.one" : "facts.tripsCount", { n: upcoming });

  return (
    <article>
      <div className="detail-hero">
        <LandscapeImage tone={d.imageTone} alt="" src={d.images[0]} className="detail-hero__img" />
      </div>
      <div className="container detail">
        <div className="detail__main">
          <header className="detail__header">
            <p className="t-label">{t(`region.${d.region}`)}</p>
            <h1 className="t-h1">{d.name}</h1>
            <p className="t-lead">{d.tagline}</p>
            <div className="detail__meta">
              <RatingDisplay value={d.rating} count={d.reviewCount} />
              <SaveButton type="destination" id={d.id} name={d.name} className="save-btn--text" />
            </div>
          </header>

          <section aria-label={t("dest.about")}>
            <EntryFee fee={d.entryFee} />
            <dl className="facts">
              <div>
                <dt>{t("facts.location")}</dt>
                <dd>{d.locationNote}</dd>
              </div>
              <div>
                <dt>{t("facts.level")}</dt>
                <dd>{t(`difficulty.${d.difficulty}`)}</dd>
              </div>
              <div>
                <dt>{t("facts.duration")}</dt>
                <dd>{t(`duration.${d.duration}`)}</dd>
              </div>
              <div>
                <dt>{t("facts.conditions")}</dt>
                <dd>{d.bestConditions}</dd>
              </div>
              <div>
                <dt>{t("facts.trips")}</dt>
                <dd>{tripsLabel}</dd>
              </div>
            </dl>
            <p>{d.description}</p>
            <div className="tags">
              {d.activities.map((a) => (
                <Tag key={a}>{t(`activity.${a}`)}</Tag>
              ))}
            </div>
          </section>

          <PriceEstimate destination={d} />

          <section>
            <h2 className="t-h2">{t("dest.whatToDo")}</h2>
            <ul className="todo">
              {d.whatToDo.map((x) => (
                <li key={x.title}>
                  <h3 className="t-h3">{x.title}</h3>
                  <p className="t-muted">{x.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="t-h2">{t("dest.weather")}</h2>
            <p>{d.conditions.summary}</p>
            <TrustLabel kind={d.conditions.source} updated={formatDateShort(d.lastUpdated, lang)} />
            <p className="t-caption">{t("dest.weatherNote")}</p>
          </section>

          <section>
            <h2 className="t-h2">{t("dest.whatToBring")}</h2>
            <List items={d.whatToBring} />
          </section>

          <section>
            <h2 className="t-h2">{t("dest.food")}</h2>
            <List items={d.nearbyFood} />
            {d.nearbyStay && d.nearbyStay.length > 0 && (
              <>
                <h3 className="t-h3">{t("dest.stay")}</h3>
                <List items={d.nearbyStay} />
              </>
            )}
          </section>

          <section id="safety-notes">
            <h2 className="t-h2">{t("dest.safety")}</h2>
            <List items={d.safetyNotes} />
          </section>

          <section>
            <h2 className="t-h2">{t("dest.trips", { name: d.name })}</h2>
            {trips.status === "loading" && <LoadingState />}
            {trips.status === "error" && <ErrorState onRetry={trips.retry} />}
            {trips.status === "success" &&
              (trips.data.length === 0 ? (
                <EmptyState
                  title={t("dest.noTrips")}
                  message={t("dest.noTripsHint")}
                  action={
                    <Button to="/trips" variant="secondary">
                      {t("dest.seeTrips")}
                    </Button>
                  }
                />
              ) : (
                <div className="card-grid card-grid--2">
                  {trips.data.map((tr) => (
                    <TripCard key={tr.id} trip={tr} />
                  ))}
                </div>
              ))}
          </section>

          <ReviewSection targetType="destination" targetId={d.id} />
          <TrustLegend />
        </div>

        <aside className="detail__side">
          <div className="card side-card">
            <h2 className="t-h3">{t("dest.sideTitle")}</h2>
            <p className="t-muted">{t("dest.sideText")}</p>
            <Button to="/trips" block>
              {t("dest.seeTrips")}
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}

export default function DestinationDetail() {
  const { slug = "" } = useParams();
  const { t } = useI18n();
  const state = useAsync(() => destinationService.getBySlug(slug), [slug]);
  useDocumentTitle(`Explore Rwanda`);
  if (state.status === "loading")
    return (
      <div className="container section">
        <LoadingState />
      </div>
    );
  if (state.status === "error")
    return (
      <div className="container section">
        <ErrorState onRetry={state.retry} />
      </div>
    );
  if (!state.data)
    return (
      <div className="container section">
        <EmptyState
          title={t("state.notFoundDest")}
          message={t("state.notFoundDestText")}
          action={
            <Link className="btn btn--primary btn--md" to="/destinations">
              {t("state.browseDest")}
            </Link>
          }
        />
      </div>
    );
  return <Detail d={state.data} />;
}
