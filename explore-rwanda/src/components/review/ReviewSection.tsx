import { useI18n } from "../../context/I18nContext";
import { reviewService } from "../../services";
import { useAsync } from "../../hooks/useAsync";
import { TrustLabel } from "../common/Badges";
import { ReviewCard } from "./ReviewCard";
import { ShareExperience } from "./ShareExperience";

type Props = { targetType: "destination" | "organizer"; targetId: string };

/**
 * Shows the top 3 useful experiences. When there are none, no empty review block is rendered —
 * only a subtle invitation to be first.
 */
export function ReviewSection({ targetType, targetId }: Props) {
  const { t } = useI18n();
  const state = useAsync(
    () =>
      targetType === "destination"
        ? reviewService.getTopForDestination(targetId)
        : reviewService.getTopForOrganizer(targetId),
    [targetType, targetId],
  );

  if (state.status === "loading") {
    return (
      <div className="skeleton-card skeleton-card--flat" aria-hidden="true">
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
      </div>
    );
  }
  if (state.status === "error") return null;

  const target = { targetType, targetId };

  if (state.data.length === 0) {
    return (
      <div className="reviews-empty">
        <div>
          <p className="reviews-empty__title">{t("reviews.emptyTitle")}</p>
          <p className="t-small t-muted">{t("reviews.emptyCta")}</p>
        </div>
        <ShareExperience target={target} />
      </div>
    );
  }

  return (
    <section aria-labelledby={`reviews-${targetId}`} className="reviews">
      <header className="reviews__head">
        <div>
          <h2 id={`reviews-${targetId}`} className="t-h2">
            {targetType === "organizer" ? t("org.ratings") : t("reviews.title")}
          </h2>
          <p className="t-small t-muted">{t("reviews.top")}</p>
        </div>
        <TrustLabel kind="community" />
      </header>
      <div className="reviews__list">
        {state.data.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
      <ShareExperience target={target} />
    </section>
  );
}
