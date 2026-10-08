import { activities } from "../data/mock/activities";
import { destinations } from "../data/mock/destinations";
import { trips } from "../data/mock/trips";
import type { Activity, Destination } from "../types";
import { isBookable } from "../utils/filters";
import { delay } from "./mock/delay";

/** Popularity blends rating, upcoming bookable trips and review volume. The ranking logic moves to the backend later. */
const popularity = (d: Destination): number => {
  const open = trips.filter((t) => t.destinationId === d.id && isBookable(t)).length;
  return (d.rating ?? 0) * 2 + open * 1.5 + Math.min((d.reviewCount ?? 0) / 100, 2);
};

export const destinationService = {
  getAll(): Promise<Destination[]> {
    return delay(destinations);
  },

  getBySlug(slug: string): Promise<Destination | null> {
    return delay(destinations.find((d) => d.slug === slug) ?? null);
  },

  getPopular(limit = 6): Promise<Destination[]> {
    return delay([...destinations].sort((a, b) => popularity(b) - popularity(a)).slice(0, limit));
  },

  getByIds(ids: string[]): Promise<Destination[]> {
    return delay(destinations.filter((d) => ids.includes(d.id)));
  },

  getActivities(): Promise<Activity[]> {
    return delay(activities, 50);
  },
};
