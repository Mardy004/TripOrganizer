import { trips } from "../data/mock/trips";
import type { Trip, TripRegistrationInput, TripRegistrationResult } from "../types";
import { isBookable } from "../utils/filters";
import { delay, reference } from "./mock/delay";

const byDate = (a: Trip, b: Trip) => a.date.localeCompare(b.date);

/** "Featured" favours trips that are soon, well rated and still have spaces. */
const featuredScore = (t: Trip, today: number): number => {
  const days = Math.max(0, (new Date(`${t.date}T00:00:00`).getTime() - today) / 86_400_000);
  return (t.rating ?? 0) * 2 + (t.availableSpaces > 0 ? 1 : 0) - days / 30;
};

export const tripService = {
  getUpcoming(): Promise<Trip[]> {
    return delay([...trips].sort(byDate));
  },

  getFeatured(limit = 6): Promise<Trip[]> {
    const today = new Date().setHours(0, 0, 0, 0);
    const pool = trips.filter(isBookable);
    return delay([...pool].sort((a, b) => featuredScore(b, today) - featuredScore(a, today)).slice(0, limit).sort(byDate));
  },

  getById(id: string): Promise<Trip | null> {
    return delay(trips.find((t) => t.id === id) ?? null);
  },

  getByDestination(destinationId: string): Promise<Trip[]> {
    return delay(trips.filter((t) => t.destinationId === destinationId).sort(byDate));
  },

  getByOrganizer(organizerId: string): Promise<Trip[]> {
    return delay(trips.filter((t) => t.organizerId === organizerId).sort(byDate));
  },

  getByIds(ids: string[]): Promise<Trip[]> {
    return delay(trips.filter((t) => ids.includes(t.id)).sort(byDate));
  },

  /** Placeholder — a real backend creates a pending registration and notifies the organizer. */
  register(input: TripRegistrationInput): Promise<TripRegistrationResult> {
    return delay({ tripId: input.tripId, reference: reference("TR"), status: "pending_confirmation" as const }, 700);
  },
};
