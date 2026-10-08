import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { ActivityId } from "../../types";
import { Icon } from "./Icon";

type Props = { id: ActivityId; glyph: string };

export function ActivityCard({ id, glyph }: Props) {
  const { t } = useI18n();
  return (
    <Link to={`/explore?activity=${id}`} className="activity">
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" className="activity__icon">
        <path d={glyph} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="activity__name">{t(`activity.${id}`)}</span>
      <span className="activity__desc">{t(`activity.${id}.desc`)}</span>
      <Icon name="arrow" size={16} className="activity__arrow" />
    </Link>
  );
}
