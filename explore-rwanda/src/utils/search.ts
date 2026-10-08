import type { ActivityId, KnownOrigin } from "../types";

/**
 * Rule-based interpretation of a free-text search such as "hiking near Kigali" or
 * "places under 10,000 RWF". This is NOT AI: it only recognises a few patterns, and what it
 * understood is shown back to the user as chips. A future AI search can replace this function.
 */
export type SearchInterpretation = {
  tokens: string[];
  activities: ActivityId[];
  maxBudget: number | null;
  nearOrigin: KnownOrigin | null;
  weekend: boolean;
};

const ACTIVITY_WORDS: Record<ActivityId, string[]> = {
  hiking: ["hiking", "hike", "hikes", "hikers"],
  walking: ["walking", "walk", "walks"],
  swimming: ["swimming", "swim", "beach"],
  running: ["running", "run", "runs"],
  photography: ["photography", "photo", "photos", "photographer"],
  nature: ["nature", "wildlife"],
  cultural: ["cultural", "culture", "village", "villages"],
  adventure: ["adventure", "safari"],
};

const ORIGINS: Record<string, KnownOrigin> = {
  kigali: "Kigali",
  rubavu: "Rubavu",
  musanze: "Musanze",
  mahoko: "Mahoko",
};

const STOPWORDS = new Set([
  "places", "place", "trips", "trip", "to", "for", "in", "the", "a", "an", "and", "with", "of",
  "experiences", "experience", "destinations", "destination", "go", "visit", "where", "can", "i", "near",
  "under", "below", "this", "that", "me", "show", "find",
]);

export const emptyInterpretation: SearchInterpretation = {
  tokens: [],
  activities: [],
  maxBudget: null,
  nearOrigin: null,
  weekend: false,
};

export function parseSearch(input: string): SearchInterpretation {
  let q = input.toLowerCase().trim();
  if (!q) return emptyInterpretation;

  // Budget: "under 10,000", "below 15000 rwf", "up to 20k"
  let maxBudget: number | null = null;
  const budget = q.match(/(?:under|below|less than|up to|within|max(?:imum)?|<)\s*(?:rwf|frw)?\s*(\d[\d,]*)\s*(k)?\s*(?:rwf|frw)?/);
  if (budget) {
    const n = Number(budget[1].replace(/,/g, ""));
    if (!Number.isNaN(n)) maxBudget = budget[2] ? n * 1000 : n;
    q = q.replace(budget[0], " ");
  }

  // Origin: "near Kigali", "from Rubavu"
  let nearOrigin: KnownOrigin | null = null;
  const origin = q.match(/\b(?:near|from|around|close to)\s+(kigali|rubavu|musanze|mahoko)\b/);
  if (origin) {
    nearOrigin = ORIGINS[origin[1]];
    q = q.replace(origin[0], " ");
  }

  // Weekend
  let weekend = false;
  const wk = q.match(/\b(weekends?|saturdays?|sundays?)\b/);
  if (wk) {
    weekend = true;
    q = q.replace(wk[0], " ");
  }

  const words = q.split(/[^a-z0-9']+/).filter(Boolean);
  const activities = new Set<ActivityId>();
  const tokens: string[] = [];
  for (const w of words) {
    const hit = (Object.keys(ACTIVITY_WORDS) as ActivityId[]).find((id) => ACTIVITY_WORDS[id].includes(w));
    if (hit) activities.add(hit);
    else if (!STOPWORDS.has(w) && !/^\d+$/.test(w)) tokens.push(w);
  }

  return { tokens, activities: [...activities], maxBudget, nearOrigin, weekend };
}

export const isInterpreted = (i: SearchInterpretation): boolean =>
  i.activities.length > 0 || i.maxBudget !== null || i.nearOrigin !== null || i.weekend;

/** Example searches shown as suggestions. The parser only understands English. */
export const exampleSearches = ["hiking near Kigali", "places under 10,000 RWF", "swimming", "weekend trips"];
