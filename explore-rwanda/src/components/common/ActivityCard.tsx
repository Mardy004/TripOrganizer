import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { ActivityId } from "../../types";
import { Icon } from "./Icon";
import {
  GiHiking,
  GiForest,
  GiWaves,
  GiRunningShoe,
  GiWalkingBoot,
  GiPhotoCamera,
  GiCompass,
  GiVillage,
} from "react-icons/gi";

type Props = { id: ActivityId; glyph: string };

const activityIcon: Record<ActivityId, typeof GiCompass> = {
  hiking: GiHiking,
  nature: GiForest,
  swimming: GiWaves,
  running: GiRunningShoe,
  walking: GiWalkingBoot,
  photography: GiPhotoCamera,
  adventure: GiCompass,
  cultural: GiVillage,
};

export function ActivityCard({ id }: Props) {
  const { t } = useI18n();
  const ActivityGlyph = activityIcon[id];
  return (
    <Link to={`/explore?activity=${id}`} className="activity">
      <ActivityGlyph size={28} aria-hidden="true" className="activity__icon" />
      <span className="activity__name">{t(`activity.${id}`)}</span>
      <span className="activity__desc">{t(`activity.${id}.desc`)}</span>
      <Icon name="arrow" size={16} className="activity__arrow" />
    </Link>
  );
}
