import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AskPlaceholder } from "../../components/common/AskPlaceholder";
import { ActivityCard } from "../../components/common/ActivityCard";
import { Button } from "../../components/common/Button";
import { Icon } from "../../components/common/Icon";
import { SearchBar } from "../../components/common/SearchBar";
import { SectionHeading } from "../../components/common/SectionHeading";
import { CardGridSkeleton, ErrorState } from "../../components/common/StateViews";
import { DestinationCard } from "../../components/destination/DestinationCard";
import { TripCard } from "../../components/trip/TripCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import { exampleSearches } from "../../utils/search";
import type { TranslationKey } from "../../translations";

const HOW: { n: 1 | 2 | 3 | 4 }[] = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
const TRUST: { n: 1 | 2 | 3 | 4 }[] = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  useDocumentTitle(`Explore Rwanda`);

  const trips = useAsync(() => tripService.getFeatured(6), []);
  const popular = useAsync(() => destinationService.getPopular(6), []);
  const acts = useAsync(() => destinationService.getActivities(), []);

  const go = (q: string) => navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="t-label hero__eyebrow">{t("home.eyebrow")}</p>
          <h1 className="t-display hero__title">{t("brand.tagline")}</h1>
          <p className="hero__lead">{t("home.lead")}</p>
          <SearchBar
            size="lg"
            id="home-search"
            value={query}
            onChange={setQuery}
            onSubmit={() => go(query)}
            placeholder={t("search.placeholderHome")}
          />
          <p className="hero__try">
            <span>{t("search.try")}</span>
            {exampleSearches.map((s) => (
              <button key={s} type="button" className="chip chip--sm" onClick={() => go(s)}>
                {s}
              </button>
            ))}
          </p>
          <div className="hero__cta">
            <Button to="/explore" size="lg">
              {t("home.cta.explore")}
            </Button>
            <Button to="/trips" size="lg" variant="light">
              {t("home.cta.trips")}
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.upcoming.eyebrow")}
            title={t("home.upcoming.title")}
            description={t("home.upcoming.desc")}
            action={
              <Button to="/trips" variant="ghost">
                {t("common.seeAll")}
              </Button>
            }
          />
          {trips.status === "loading" && <CardGridSkeleton />}
          {trips.status === "error" && <ErrorState onRetry={trips.retry} />}
          {trips.status === "success" && (
            <div className="card-grid">
              {trips.data.map((tr) => (
                <TripCard key={tr.id} trip={tr} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.popular.eyebrow")}
            title={t("home.popular.title")}
            description={t("home.popular.desc")}
            action={
              <Button to="/destinations" variant="ghost">
                {t("common.seeAll")}
              </Button>
            }
          />
          {popular.status === "loading" && <CardGridSkeleton />}
          {popular.status === "error" && <ErrorState onRetry={popular.retry} />}
          {popular.status === "success" && (
            <div className="card-grid">
              {popular.data.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t("home.activities.eyebrow")} title={t("home.activities.title")} />
          {acts.status === "success" && (
            <div className="activity-grid">
              {acts.data.map((a) => (
                <ActivityCard key={a.id} id={a.id} glyph={a.glyph} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading eyebrow={t("home.how.eyebrow")} title={t("home.how.title")} />
          <ol className="steps">
            {HOW.map(({ n }) => (
              <li key={n} className="steps__item">
                <span className="steps__num">{n}</span>
                <h3 className="t-h3">{t(`home.how.${n}.title` as TranslationKey)}</h3>
                <p className="t-muted">{t(`home.how.${n}.text` as TranslationKey)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t("home.trust.eyebrow")} title={t("home.trust.title")} description={t("home.trust.desc")} />
          <div className="trust-grid">
            {TRUST.map(({ n }) => (
              <div key={n} className="trust-grid__item">
                <Icon name="check" size={22} />
                <h3 className="t-h3">{t(`home.trust.${n}.title` as TranslationKey)}</h3>
                <p className="t-muted">{t(`home.trust.${n}.text` as TranslationKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--forest">
        <div className="container cta-band">
          <div>
            <p className="t-label">{t("home.organizer.eyebrow")}</p>
            <h2 className="t-h2">{t("home.organizer.title")}</h2>
            <p>{t("home.organizer.text")}</p>
          </div>
          <Button to="/organize" size="lg">
            {t("nav.becomeOrganizer")}
          </Button>
        </div>
      </section>

      <AskPlaceholder />
    </>
  );
}
