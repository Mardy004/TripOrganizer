import { useI18n } from "../../context/I18nContext";
import type { Review } from "../../types";
import { formatDateShort } from "../../utils/format";
import { Icon } from "../common/Icon";
import { StarsRow } from "../common/RatingDisplay";
import { Tag } from "../common/Badges";

/** One community experience: the written account matters more than the stars. */
export function ReviewCard({ review: r }: { review: Review }) {
  const { t, lang } = useI18n();
  return (
    <blockquote className="review">
      <div className="review__head">
        <StarsRow value={r.rating} />
        <span className="visually-hidden">{t("rating.label", { value: r.rating, n: 1 })}</span>
        {r.title && <p className="review__title">{r.title}</p>}
      </div>
      <p className="review__text">“{r.content}”</p>
      {r.topics.length > 0 && (
        <div className="tags">
          {r.topics.map((topic) => (
            <Tag key={topic}>{t(`topic.${topic}`)}</Tag>
          ))}
        </div>
      )}
      <footer className="review__foot">
        <span>
          {r.authorName ? <strong>{r.authorName}</strong> : null}
          {r.authorName ? " · " : ""}
          {formatDateShort(r.createdAt, lang)}
        </span>
        {r.verifiedParticipant && (
          <span className="review__verified">
            <Icon name="check" size={13} /> {t("reviews.verifiedParticipant")}
          </span>
        )}
        <span className="t-caption">{t("reviews.helpful", { n: r.helpfulCount })}</span>
      </footer>
    </blockquote>
  );
}
