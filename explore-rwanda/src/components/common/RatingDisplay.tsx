import { useI18n } from "../../context/I18nContext";
import { formatRating } from "../../utils/format";
import { Icon } from "./Icon";

type Props = { value?: number; count?: number; compact?: boolean };

/** Single-star numeric rating (compact, mobile-friendly). Renders nothing useful when unrated. */
export function RatingDisplay({ value, count, compact = false }: Props) {
  const { t } = useI18n();
  if (value === undefined) {
    return compact ? null : <span className="rating rating--none">{t("rating.none")}</span>;
  }
  return (
    <span className="rating" role="img" aria-label={t("rating.label", { value: formatRating(value), n: count ?? 0 })}>
      <Icon name="star" size={15} filled className="rating__star" />
      <strong>{formatRating(value)}</strong>
      {count !== undefined && !compact && <span className="rating__count">({count})</span>}
    </span>
  );
}

/** Row of five stars for a given integer rating (used inside reviews and the composer). */
export function StarsRow({ value }: { value: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={15} filled={i < value} className={i < value ? "stars__on" : "stars__off"} />
      ))}
    </span>
  );
}
