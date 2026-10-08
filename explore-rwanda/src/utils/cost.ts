import type { CostRange, Destination, KnownOrigin, Origin, OriginEstimate } from "../types";

export type CostSummary = {
  origin: KnownOrigin;
  estimate: OriginEstimate;
  /** Entry fee in RWF when known; null when unconfirmed or none known. */
  entry: number | null;
  /** True when the fee is unconfirmed, so the total excludes it. */
  entryMissing: boolean;
  total: CostRange;
};

export const summarize = (d: Destination, estimate: OriginEstimate): CostSummary => {
  const entry = d.entryFee.kind === "amount" ? d.entryFee.amount : null;
  const add = entry ?? 0;
  return {
    origin: estimate.origin,
    estimate,
    entry,
    entryMissing: d.entryFee.kind === "unconfirmed",
    total: {
      min: estimate.transport.min + estimate.food.min + estimate.activities.min + add,
      max: estimate.transport.max + estimate.food.max + estimate.activities.max + add,
    },
  };
};

/** The lowest-cost listed starting point for a destination. */
export const nearestSummary = (d: Destination): CostSummary =>
  d.estimates
    .map((e) => summarize(d, e))
    .sort((a, b) => a.total.min - b.total.min || a.estimate.distanceKm - b.estimate.distanceKm)[0];

/**
 * Cost from a chosen origin. "Other" has no estimate, so the Kigali figures are returned
 * and flagged as a reference.
 */
export const costFrom = (d: Destination, origin: Origin): { summary: CostSummary; isReference: boolean } => {
  if (origin !== "Other") {
    const e = d.estimates.find((x) => x.origin === origin);
    if (e) return { summary: summarize(d, e), isReference: false };
  }
  const kigali = d.estimates.find((x) => x.origin === "Kigali") ?? d.estimates[0];
  return { summary: summarize(d, kigali), isReference: true };
};

export const startingFrom = (d: Destination): number => nearestSummary(d).total.min;
export const typicalVisit = (d: Destination): CostRange => nearestSummary(d).total;
export const fromKigali = (d: Destination): CostRange | null => {
  const e = d.estimates.find((x) => x.origin === "Kigali");
  return e ? summarize(d, e).total : null;
};

/** Cost used for filtering: a specific origin if chosen, otherwise the cheapest listed one. */
export const costForFilter = (d: Destination, origin: Origin | ""): CostSummary => {
  if (origin && origin !== "Other") {
    const e = d.estimates.find((x) => x.origin === origin);
    if (e) return summarize(d, e);
  }
  return nearestSummary(d);
};

export const distanceFrom = (d: Destination, origin: Origin | ""): number => {
  if (origin && origin !== "Other") {
    const e = d.estimates.find((x) => x.origin === origin);
    if (e) return e.distanceKm;
  }
  return Math.min(...d.estimates.map((e) => e.distanceKm));
};
