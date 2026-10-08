import { useI18n } from "../../context/I18nContext";
import type { Confirmation, OrganizerType, TripStatus } from "../../types";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

export type TrustKind = "verified" | "community" | "estimated";

const trustIcon: Record<TrustKind, IconName> = { verified: "check", community: "users", estimated: "info" };

/** Small label that tells the reader how reliable a piece of information is. */
export function TrustLabel({ kind, updated }: { kind: TrustKind; updated?: string }) {
  const { t } = useI18n();
  return (
    <span className={`trust trust--${kind}`}>
      <Icon name={trustIcon[kind]} size={13} />
      {t(`trust.${kind}`)}
      {updated && <span className="trust__date"> · {updated}</span>}
    </span>
  );
}

export const confirmationToTrust = (c: Confirmation): TrustKind => c;

/** Refined verification badge. Differentiates individuals from tour companies. */
export function VerificationBadge({ type }: { type?: OrganizerType }) {
  const { t } = useI18n();
  const label =
    type === "company" ? t("org.verifiedCompany") : type === "individual" ? t("org.verifiedIndividual") : t("org.verifiedShort");
  return (
    <span className="badge badge--verified">
      <Icon name="check" size={13} />
      {label}
    </span>
  );
}

export function ApprovedBadge() {
  const { t } = useI18n();
  return (
    <span className="badge badge--approved">
      <Icon name="check" size={13} />
      {t("trip.approved")}
    </span>
  );
}

export function StatusBadge({ status }: { status: TripStatus }) {
  const { t } = useI18n();
  return <span className={`badge badge--status-${status}`}>{t(`status.${status}`)}</span>;
}

export function Tag({ children }: { children: string }) {
  return <span className="tag">{children}</span>;
}

export function SampleBadge() {
  const { t } = useI18n();
  return <span className="badge badge--sample">{t("sample.badge")}</span>;
}
