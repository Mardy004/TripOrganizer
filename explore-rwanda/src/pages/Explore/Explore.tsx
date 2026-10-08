import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterPanel } from "../../components/common/FilterPanel";
import { Button } from "../../components/common/Button";
import { Drawer } from "../../components/common/Modal";
import { SearchBar } from "../../components/common/SearchBar";
import { SectionHeading } from "../../components/common/SectionHeading";
import { CardGridSkeleton, EmptyState, ErrorState } from "../../components/common/StateViews";
import { DestinationCard } from "../../components/destination/DestinationCard";
import { TripCard } from "../../components/trip/TripCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import { countActiveFilters, defaultFilters, filterDestinations, filterTrips, resolve } from "../../utils/filters";
import type { Filters } from "../../utils/filters";
import { formatMoney } from "../../utils/format";
import { exampleSearches, isInterpreted } from "../../utils/search";
import type { ActivityId, DurationId, RegionId } from "../../types";

/** Filters are seeded from the URL so links such as /explore?activity=hiking work. */
function initial(params: URLSearchParams): Filters {
  const f = { ...defaultFilters };
  f.query = params.get("q") ?? "";
  f.activity = (params.get("activity") as ActivityId | null) ?? "";
  f.region = (params.get("region") as RegionId | null) ?? "";
  f.duration = (params.get("duration") as DurationId | null) ?? "";
  return f;
}

export default function Explore() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => initial(params));
  const [draft, setDraft] = useState(filters.query);
  const [drawer, setDrawer] = useState(false);
  useDocumentTitle(`Explore Rwanda`);

  const data = useAsync(async () => {
    const [destinations, trips] = await Promise.all([destinationService.getAll(), tripService.getUpcoming()]);
    return { destinations, trips };
  }, []);

  const result = useMemo(() => {
    if (!data.data) return null;
    return {
      destinations: filterDestinations(data.data.destinations, data.data.trips, filters),
      trips: filterTrips(data.data.trips, data.data.destinations, filters),
    };
  }, [data.data, filters]);

  const r = resolve(filters);
  const active = countActiveFilters(filters);
  const submit = (q: string) => setFilters((f) => ({ ...f, query: q }));

  const chips: string[] = [];
  if (r.interp.nearOrigin) chips.push(t("chip.near", { origin: t(`origin.${r.interp.nearOrigin}`) }));
  if (r.interp.maxBudget !== null) chips.push(t("chip.budget", { amount: formatMoney(r.interp.maxBudget) }));
  if (r.interp.weekend) chips.push(t("chip.weekend"));
  r.interp.activities.forEach((a) => chips.push(t(`activity.${a}`)));

  const count = (n: number, key: "explore.placesFound" | "explore.tripsFound") =>
    t(n === 1 ? (`${key}.one` as const) : key, { n });

  return (
    <div className="container section">
      <SectionHeading as="h1" eyebrow={t("explore.eyebrow")} title={t("explore.title")} description={t("explore.subtitle")} />

      <div className="explore__bar">
        <SearchBar
          id="explore-search"
          value={draft}
          onChange={(v) => {
            setDraft(v);
            if (v === "") submit("");
          }}
          onSubmit={() => submit(draft)}
          placeholder={t("search.placeholderExplore")}
        />
        <Button variant="secondary" className="explore__filter-btn" onClick={() => setDrawer(true)}>
          {active > 0 ? t("explore.filtersCount", { n: active }) : t("explore.filters")}
        </Button>
      </div>

      {isInterpreted(r.interp) && (
        <p className="interpreted" aria-live="polite">
          <span>{t("search.showing")}</span>
          {chips.map((c) => (
            <span key={c} className="chip chip--on chip--sm">
              {c}
            </span>
          ))}
        </p>
      )}

      <div className="explore__layout">
        <aside className="explore__side" aria-label={t("explore.filters")}>
          <FilterPanel filters={filters} onChange={setFilters} idPrefix="side" />
        </aside>

        <div className="explore__results">
          {data.status === "loading" && <CardGridSkeleton />}
          {data.status === "error" && <ErrorState onRetry={data.retry} />}
          {result && (
            <>
              <h2 className="t-h2">{t("explore.places")}</h2>
              <p className="t-muted" role="status">
                {count(result.destinations.length, "explore.placesFound")}
              </p>
              {result.destinations.length === 0 ? (
                <EmptyState
                  title={t("explore.noResults.title")}
                  message={t("explore.noResults.text")}
                  action={
                    <div className="chips">
                      {exampleSearches.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="chip"
                          onClick={() => {
                            setFilters({ ...defaultFilters, query: s });
                            setDraft(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                      <button type="button" className="chip" onClick={() => { setFilters(defaultFilters); setDraft(""); }}>
                        {t("common.clearFilters")}
                      </button>
                    </div>
                  }
                />
              ) : (
                <div className="card-grid card-grid--2">
                  {result.destinations.map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              )}

              <h2 className="t-h2 explore__trips-title">{t("explore.tripsMatching")}</h2>
              {result.trips.length === 0 ? (
                <EmptyState title={t("explore.noTrips")} message={t("explore.noTripsHint")} />
              ) : (
                <>
                  <p className="t-muted">{count(result.trips.length, "explore.tripsFound")}</p>
                  <div className="card-grid card-grid--2">
                    {result.trips.map((tr) => (
                      <TripCard key={tr.id} trip={tr} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Drawer open={drawer} title={t("explore.filters")} onClose={() => setDrawer(false)}>
        <FilterPanel filters={filters} onChange={setFilters} idPrefix="drawer" />
        {result && (
          <Button block size="lg" onClick={() => setDrawer(false)}>
            {t("explore.show", { places: result.destinations.length, trips: result.trips.length })}
          </Button>
        )}
      </Drawer>
    </div>
  );
}
