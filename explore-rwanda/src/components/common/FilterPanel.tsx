import { useI18n } from "../../context/I18nContext";
import type { ActivityId, Difficulty, DurationId, Origin, RegionId } from "../../types";
import { activityIds } from "../../data/mock/activities";
import { countActiveFilters, defaultFilters } from "../../utils/filters";
import type { Filters } from "../../utils/filters";
import { formatMoney } from "../../utils/format";
import { ORIGINS } from "../destination/OriginSelector";

type Props = { filters: Filters; onChange: (f: Filters) => void; idPrefix: string };

const REGIONS: RegionId[] = ["kigali", "western", "northern", "southern", "eastern"];
const DURATIONS: DurationId[] = ["half_day", "one_day", "one_two_days", "two_days"];
const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "challenging"];
const BUDGETS = [10000, 20000, 50000, 100000];
const DISTANCES = [50, 100, 150];
const RATINGS = [4, 4.5];

/** One panel used both as the desktop sidebar and inside the mobile filter drawer. */
export function FilterPanel({ filters, onChange, idPrefix }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });
  const active = countActiveFilters(filters);
  const id = (name: string) => `${idPrefix}-${name}`;
  const num = (v: string): number | null => (v === "" ? null : Number(v));

  return (
    <div className="filters">
      <div className="field">
        <label htmlFor={id("region")}>{t("filter.region")}</label>
        <select id={id("region")} value={filters.region} onChange={(e) => set("region", e.target.value as "" | RegionId)}>
          <option value="">{t("filter.anyRegion")}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {t(`region.${r}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("activity")}>{t("filter.activity")}</label>
        <select id={id("activity")} value={filters.activity} onChange={(e) => set("activity", e.target.value as "" | ActivityId)}>
          <option value="">{t("filter.anyActivity")}</option>
          {activityIds.map((a) => (
            <option key={a} value={a}>
              {t(`activity.${a}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("origin")}>{t("filter.origin")}</label>
        <select id={id("origin")} value={filters.origin} onChange={(e) => set("origin", e.target.value as "" | Origin)}>
          <option value="">{t("filter.anyOrigin")}</option>
          {ORIGINS.filter((o) => o !== "Other").map((o) => (
            <option key={o} value={o}>
              {t(`origin.${o}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("budget")}>{t("filter.budget")}</label>
        <select id={id("budget")} value={filters.maxBudget ?? ""} onChange={(e) => set("maxBudget", num(e.target.value))}>
          <option value="">{t("filter.anyBudget")}</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {t("filter.budgetUpTo", { amount: formatMoney(b) })}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("distance")}>{t("filter.distance")}</label>
        <select id={id("distance")} value={filters.maxDistance ?? ""} onChange={(e) => set("maxDistance", num(e.target.value))}>
          <option value="">{t("filter.anyDistance")}</option>
          {DISTANCES.map((km) => (
            <option key={km} value={km}>
              {t("filter.distanceUnder", { km })}
            </option>
          ))}
        </select>
        <p className="field__hint">{t("filter.distanceNote")}</p>
      </div>

      <div className="field">
        <label htmlFor={id("duration")}>{t("filter.duration")}</label>
        <select id={id("duration")} value={filters.duration} onChange={(e) => set("duration", e.target.value as "" | DurationId)}>
          <option value="">{t("filter.anyDuration")}</option>
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {t(`duration.${d}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("difficulty")}>{t("filter.difficulty")}</label>
        <select
          id={id("difficulty")}
          value={filters.difficulty}
          onChange={(e) => set("difficulty", e.target.value as "" | Difficulty)}
        >
          <option value="">{t("filter.anyDifficulty")}</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {t(`difficulty.${d}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={id("rating")}>{t("filter.rating")}</label>
        <select id={id("rating")} value={filters.minRating ?? ""} onChange={(e) => set("minRating", num(e.target.value))}>
          <option value="">{t("filter.anyRating")}</option>
          {RATINGS.map((r) => (
            <option key={r} value={r}>
              {t("filter.ratingMin", { value: r })}
            </option>
          ))}
        </select>
      </div>

      <label className="check filters__check">
        <input type="checkbox" checked={filters.availableOnly} onChange={(e) => set("availableOnly", e.target.checked)} />
        <span>{t("filter.available")}</span>
      </label>

      {active > 0 && (
        <button type="button" className="link-btn" onClick={() => onChange({ ...defaultFilters, query: filters.query })}>
          {t("filter.clear", { n: active })}
        </button>
      )}
    </div>
  );
}
