import { useI18n } from "../../context/I18nContext";
import type { Trip } from "../../types";
import { formatRange } from "../../utils/format";
import { isBookable } from "../../utils/filters";
import { Button } from "../common/Button";
import { TrustLabel } from "../common/Badges";
import { AvailabilityBadge } from "./AvailabilityBadge";

/** Label for the primary action, which changes with trip status. */
export function useRegisterLabel(trip: Trip): string {
  const { t } = useI18n();
  if (trip.status === "full") return t("trip.full");
  if (trip.status === "closed") return t("trip.closed");
  if (trip.status === "cancelled") return t("trip.cancelled");
  return t("trip.register");
}

/** Primary CTA: a link while registration is possible, otherwise a disabled, explanatory button. */
export function RegisterButton({ trip, block = true, size = "lg" }: { trip: Trip; block?: boolean; size?: "md" | "lg" }) {
  const label = useRegisterLabel(trip);
  return isBookable(trip) ? (
    <Button to={`/trips/${trip.id}/register`} size={size} block={block}>
      {label}
    </Button>
  ) : (
    <Button size={size} block={block} disabled variant="secondary">
      {label}
    </Button>
  );
}

export function RegisterPanel({ trip }: { trip: Trip }) {
  const { t } = useI18n();
  return (
    <aside className="join" id="register" aria-label={t("trip.register")}>
      <div className="join__price">
        <p className="t-caption">{t("trip.estPerPerson")}</p>
        <p className="join__amount">{formatRange({ min: trip.estimatedCostMin, max: trip.estimatedCostMax }, trip.currency)}</p>
        <TrustLabel kind="estimated" />
      </div>
      <AvailabilityBadge trip={trip} />
      <RegisterButton trip={trip} />
      <p className="t-caption join__foot">{t("trip.registerNote")}</p>
    </aside>
  );
}

/** Sticky mobile bar: price + CTA stay reachable on long trip pages (above the bottom nav). */
export function StickyCta({ trip }: { trip: Trip }) {
  const { t } = useI18n();
  return (
    <div className="sticky-cta">
      <div>
        <p className="t-caption">{t("trip.stickyFrom")}</p>
        <strong>{formatRange({ min: trip.estimatedCostMin, max: trip.estimatedCostMin }, trip.currency)}</strong>
      </div>
      <RegisterButton trip={trip} block={false} size="md" />
    </div>
  );
}
