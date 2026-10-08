import { useMemo, useState } from "react";
import { Button } from "../../components/common/Button";
import { SearchBar } from "../../components/common/SearchBar";
import { SectionHeading } from "../../components/common/SectionHeading";
import { CardGridSkeleton, EmptyState, ErrorState } from "../../components/common/StateViews";
import { TripCard } from "../../components/trip/TripCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import { defaultFilters, filterTrips } from "../../utils/filters";
import type { Filters } from "../../utils/filters";

export default function Trips() {
  const { t } = useI18n();
  useDocumentTitle(`${t("trips.title")} — Explore Rwanda`);
  const [q, setQ] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const data = useAsync(async () => {
    const [trips, destinations] = await Promise.all([tripService.getUpcoming(), destinationService.getAll()]);
    return { trips, destinations };
  }, []);

  const list = useMemo(() => {
    if (!data.data) return [];
    const f: Filters = { ...defaultFilters, query: q, availableOnly };
    return filterTrips(data.data.trips, data.data.destinations, f);
  }, [data.data, q, availableOnly]);

  return (
    <div className="container section">
      <SectionHeading as="h1" eyebrow={t("trips.eyebrow")} title={t("trips.title")} description={t("trips.subtitle")} />
      <div className="explore__bar">
        <SearchBar id="trips-search" value={q} onChange={setQ} placeholder={t("trips.searchPlaceholder")} />
        <label className="check">
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
          <span>{t("filter.available")}</span>
        </label>
      </div>
      {data.status === "loading" && <CardGridSkeleton />}
      {data.status === "error" && <ErrorState onRetry={data.retry} />}
      {data.status === "success" &&
        (list.length === 0 ? (
          <EmptyState
            title={t("explore.noTrips")}
            message={t("explore.noTripsHint")}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ("");
                  setAvailableOnly(false);
                }}
              >
                {t("common.clearFilters")}
              </Button>
            }
          />
        ) : (
          <>
            <p className="t-muted" role="status">
              {t(list.length === 1 ? "trips.count.one" : "trips.count", { n: list.length })}
            </p>
            <div className="card-grid">
              {list.map((tr) => (
                <TripCard key={tr.id} trip={tr} />
              ))}
            </div>
          </>
        ))}
    </div>
  );
}
