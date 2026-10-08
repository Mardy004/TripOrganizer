import { NEAR_KM } from "../config";
import { en } from "../translations/en";
import type { ActivityId, Destination, DurationId, Difficulty, Origin, RegionId, Trip } from "../types";
import { costForFilter, distanceFrom } from "./cost";
import { parseSearch } from "./search";
import type { SearchInterpretation } from "./search";

export type Filters = {
  query: string;
  region: "" | RegionId;
  activity: "" | ActivityId;
  maxBudget: number | null;
  origin: "" | Origin;
  maxDistance: number | null;
  duration: "" | DurationId;
  difficulty: "" | Difficulty;
  minRating: number | null;
  availableOnly: boolean;
};

export const defaultFilters: Filters = {
  query: "",
  region: "",
  activity: "",
  maxBudget: null,
  origin: "",
  maxDistance: null,
  duration: "",
  difficulty: "",
  minRating: null,
  availableOnly: false,
};

/** Number of filters set in the panel (the search text is not counted). */
export const countActiveFilters = (f: Filters): number =>
  [f.region, f.activity, f.origin, f.duration, f.difficulty].filter(Boolean).length +
  [f.maxBudget, f.maxDistance, f.minRating].filter((v) => v !== null).length +
  (f.availableOnly ? 1 : 0);

export const isBookable = (t: Trip): boolean => t.status === "open" || t.status === "almost_full";

export const isWeekend = (iso: string): boolean => {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

type Resolved = {
  interp: SearchInterpretation;
  activities: ActivityId[];
  budget: number | null;
  origin: "" | Origin;
  maxDistance: number | null;
};

/** Merges the explicit panel filters with whatever the free-text search understood. */
export const resolve = (f: Filters): Resolved => {
  const interp = parseSearch(f.query);
  return {
    interp,
    activities: f.activity ? [f.activity] : interp.activities,
    budget: interp.maxBudget ?? f.maxBudget,
    origin: interp.nearOrigin ?? f.origin,
    maxDistance: f.maxDistance ?? (interp.nearOrigin ? NEAR_KM : null),
  };
};

const matchesTokens = (tokens: string[], haystack: string): boolean => {
  const h = haystack.toLowerCase();
  return tokens.every((t) => h.includes(t));
};

const destinationHaystack = (d: Destination): string =>
  [d.name, d.locationNote, d.tagline, en[`region.${d.region}`], ...d.activities.map((a) => en[`activity.${a}`])].join(" ");

const tripHaystack = (t: Trip): string =>
  [t.destinationName, t.title, t.organizerName, t.startingLocation, en[`activity.${t.activity}`]].join(" ");

export function filterDestinations(list: Destination[], trips: Trip[], f: Filters): Destination[] {
  const r = resolve(f);
  const tripsFor = (id: string) => trips.filter((t) => t.destinationId === id && isBookable(t));
  return list.filter((d) => {
    if (!matchesTokens(r.interp.tokens, destinationHaystack(d))) return false;
    if (f.region && d.region !== f.region) return false;
    if (r.activities.length > 0 && !r.activities.some((a) => d.activities.includes(a))) return false;
    if (f.difficulty && d.difficulty !== f.difficulty) return false;
    if (f.duration && d.duration !== f.duration) return false;
    if (f.minRating !== null && (d.rating ?? 0) < f.minRating) return false;
    if (r.budget !== null && costForFilter(d, r.origin).total.min > r.budget) return false;
    if (r.maxDistance !== null && distanceFrom(d, r.origin) > r.maxDistance) return false;
    if (f.availableOnly && tripsFor(d.id).length === 0) return false;
    if (r.interp.weekend && !tripsFor(d.id).some((t) => isWeekend(t.date))) return false;
    return true;
  });
}

export function filterTrips(list: Trip[], destinations: Destination[], f: Filters): Trip[] {
  const r = resolve(f);
  const byId = new Map(destinations.map((d) => [d.id, d]));
  return list.filter((t) => {
    const d = byId.get(t.destinationId);
    if (!matchesTokens(r.interp.tokens, tripHaystack(t))) return false;
    if (f.region && d?.region !== f.region) return false;
    if (r.activities.length > 0 && !r.activities.includes(t.activity)) return false;
    if (f.difficulty && d?.difficulty !== f.difficulty) return false;
    if (f.duration && t.duration !== f.duration) return false;
    if (f.minRating !== null && (t.rating ?? 0) < f.minRating) return false;
    if (r.budget !== null && t.estimatedCostMin > r.budget) return false;
    if (r.maxDistance !== null && d && distanceFrom(d, r.origin) > r.maxDistance) return false;
    if (f.availableOnly && !isBookable(t)) return false;
    if (r.interp.weekend && !isWeekend(t.date)) return false;
    return true;
  });
}

export const uniqueSorted = <T extends string>(values: T[]): T[] => Array.from(new Set(values)).sort();
