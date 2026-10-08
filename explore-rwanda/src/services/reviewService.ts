import { reviews } from "../data/mock/reviews";
import type { Review, ReviewInput } from "../types";
import { delay } from "./mock/delay";

/**
 * Ranks reviews by usefulness, not by stars: helpfulness, verified participation, detail and
 * recency. The real ranking will live on the backend; the UI only consumes the ranked list.
 */
export const usefulness = (r: Review, now = Date.now()): number => {
  const months = (now - new Date(`${r.createdAt}T00:00:00`).getTime()) / (30 * 86_400_000);
  const recency = Math.max(0, 3 - months * 0.25);
  const detail = Math.min(r.content.length / 60, 4);
  return r.helpfulCount * 2 + (r.verifiedParticipant ? 5 : 0) + detail + recency + r.rating * 0.25;
};

const ranked = (list: Review[]): Review[] => [...list].sort((a, b) => usefulness(b) - usefulness(a));

export const reviewService = {
  /** Top useful experiences for a destination (default: top 3). Empty when there are none. */
  getTopForDestination(destinationId: string, limit = 3): Promise<Review[]> {
    return delay(ranked(reviews.filter((r) => r.targetType === "destination" && r.targetId === destinationId)).slice(0, limit), 200);
  },

  getTopForOrganizer(organizerId: string, limit = 3): Promise<Review[]> {
    return delay(ranked(reviews.filter((r) => r.targetType === "organizer" && r.targetId === organizerId)).slice(0, limit), 200);
  },

  /** Placeholder — real submissions are moderated before they appear. */
  submit(input: ReviewInput): Promise<{ status: "pending_moderation" }> {
    void input;
    return delay({ status: "pending_moderation" as const }, 600);
  },
};
