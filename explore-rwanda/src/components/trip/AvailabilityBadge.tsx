import { useI18n } from "../../context/I18nContext";
import type { Trip } from "../../types";

/** Availability line used on cards and the registration panel. Never relies on colour alone. */
export function AvailabilityBadge({ trip }: { trip: Pick<Trip, "status" | "availableSpaces" | "capacity"> }) {
  const { t } = useI18n();
  const { status, availableSpaces: n } = trip;
  const text =
    status === "open"
      ? t("availability.open", { n })
      : status === "almost_full"
        ? t("availability.almost", { n })
        : status === "full"
          ? t("availability.full")
          : status === "closed"
            ? t("availability.closed")
            : t("availability.cancelled");
  const taken = trip.capacity - trip.availableSpaces;
  const pct = Math.round((taken / trip.capacity) * 100);
  const show = status === "open" || status === "almost_full" || status === "full";
  return (
    <div className="availability">
      <p className={`availability__text availability__text--${status}`}>{text}</p>
      {show && (
        <div
          className={`availability__bar availability__bar--${status}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={trip.capacity}
          aria-valuenow={taken}
          aria-label={t("availability.taken", { taken, capacity: trip.capacity })}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
