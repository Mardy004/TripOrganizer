import type { Activity, ActivityId } from "../../types";

export const activities: Activity[] = [
  { id: "hiking", glyph: "M3 20 L9 8 L13 15 L16 11 L21 20 Z" },
  { id: "nature", glyph: "M12 3 C6 8 6 14 12 21 C18 14 18 8 12 3 Z" },
  { id: "swimming", glyph: "M2 14 Q6 10 10 14 T18 14 T22 14 M2 19 Q6 15 10 19 T18 19 T22 19" },
  { id: "running", glyph: "M4 20 L10 12 L14 16 L20 6" },
  { id: "walking", glyph: "M6 21 L10 4 M10 4 L14 21 M8 13 L12 13" },
  { id: "photography", glyph: "M3 8 H8 L10 5 H14 L16 8 H21 V19 H3 Z" },
  { id: "adventure", glyph: "M12 2 L15 10 L22 12 L15 14 L12 22 L9 14 L2 12 L9 10 Z" },
  { id: "cultural", glyph: "M4 20 V10 L12 4 L20 10 V20 Z" },
];

export const activityIds: ActivityId[] = activities.map((a) => a.id);
