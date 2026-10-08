import { organizers } from "../data/mock/organizers";
import type { Organizer, OrganizerRequest, OrganizerRequestResult } from "../types";
import { delay, reference } from "./mock/delay";

export const organizerService = {
  getAll(): Promise<Organizer[]> {
    return delay([...organizers].sort((a, b) => b.rating - a.rating));
  },

  getById(id: string): Promise<Organizer | null> {
    return delay(organizers.find((o) => o.id === id) ?? null);
  },

  /**
   * Placeholder — a real backend stores the request for manual verification by the Explore Rwanda
   * team. Submitting never grants organizer access.
   */
  submitRequest(data: OrganizerRequest): Promise<OrganizerRequestResult> {
    void data;
    return delay({ reference: reference("ER"), status: "pending_verification" as const }, 900);
  },
};
