import { useParams } from "react-router-dom";
import { Tag, VerificationBadge } from "../../components/common/Badges";
import { Button } from "../../components/common/Button";
import { RatingDisplay } from "../../components/common/RatingDisplay";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/StateViews";
import { ReviewSection } from "../../components/review/ReviewSection";
import { TripCard } from "../../components/trip/TripCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { organizerService, tripService } from "../../services";
import { formatDate, initials, yearOf } from "../../utils/format";
import { isBookable } from "../../utils/filters";
import type { Organizer } from "../../types";

function Profile({ o }: { o: Organizer }) {
  const { t, lang } = useI18n();
  useDocumentTitle(`${o.name} — Explore Rwanda`);
  const trips = useAsync(() => tripService.getByOrganizer(o.id), [o.id]);
  const upcoming = trips.data?.filter(isBookable) ?? [];
  const n = (count: number, key: "org.completedTrips" | "org.experiences") =>
    t(count === 1 ? (`${key}.one` as const) : key, { n: count });

  return (
    <div className="container section profile">
      <header className="profile__header">
        <div className="avatar avatar--lg" aria-hidden="true">
          {initials(o.name)}
        </div>
        <div>
          <p className="t-label">{t(o.type === "company" ? "org.company" : "org.individual")}</p>
          <h1 className="t-h1">{o.name}</h1>
          {o.verified && <VerificationBadge type={o.type} />}
          <p className="t-caption">{t(o.type === "company" ? "org.verifiedCompanyText" : "org.verifiedIndividualText")}</p>
          <RatingDisplay value={o.rating} count={o.reviewCount} />
          <p className="t-muted">
            {n(o.completedTrips, "org.completedTrips")} · {n(o.participantExperiences, "org.experiences")}
          </p>
          <p className="t-muted">
            {t("org.basedIn", { place: o.location })} · {t("org.memberSince", { year: yearOf(o.memberSince) })}
          </p>
        </div>
      </header>

      <section>
        <h2 className="t-h2">{t("org.about")}</h2>
        <p>{o.bio}</p>
        <h3 className="t-h3">{t("org.specialities")}</h3>
        <div className="tags">
          {o.specialities.map((a) => (
            <Tag key={a}>{t(`activity.${a}`)}</Tag>
          ))}
        </div>
      </section>

      <section>
        <h2 className="t-h2">{t("org.upcoming")}</h2>
        {trips.status === "loading" && <LoadingState />}
        {trips.status === "error" && <ErrorState onRetry={trips.retry} />}
        {trips.status === "success" &&
          (upcoming.length === 0 ? (
            <p className="t-muted">{t("org.noUpcoming")}</p>
          ) : (
            <div className="card-grid card-grid--2">
              {upcoming.map((tr) => (
                <TripCard key={tr.id} trip={tr} />
              ))}
            </div>
          ))}
      </section>

      {o.completed.length > 0 && (
        <section>
          <h2 className="t-h2">{t("org.completed")}</h2>
          <ul className="completed">
            {o.completed.map((c) => (
              <li key={c.id} className="card completed__item">
                <strong>{c.title}</strong>
                <span className="t-muted">{c.destinationName}</span>
                <span className="t-caption">
                  {t("org.completedMeta", { date: formatDate(c.date, lang), n: c.participants })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="t-h2">{t("org.ratings")}</h2>
        <ReviewSection targetType="organizer" targetId={o.id} />
      </section>

      <section className="card">
        <h2 className="t-h3">{t("org.contact")}</h2>
        <p className="t-muted">{t("org.contactText")}</p>
      </section>
    </div>
  );
}

export default function OrganizerProfile() {
  const { id = "" } = useParams();
  const { t } = useI18n();
  const state = useAsync(() => organizerService.getById(id), [id]);
  useDocumentTitle("Explore Rwanda");
  const wrap = (node: React.ReactNode) => <div className="container section">{node}</div>;
  if (state.status === "loading") return wrap(<LoadingState />);
  if (state.status === "error") return wrap(<ErrorState onRetry={state.retry} />);
  if (!state.data)
    return wrap(
      <EmptyState
        title={t("org.notFound")}
        action={
          <Button to="/organizers" variant="secondary">
            {t("nav.organizers")}
          </Button>
        }
      />,
    );
  return <Profile o={state.data} />;
}
