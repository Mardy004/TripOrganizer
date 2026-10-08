import type { AccountDetails, User } from "../types";
import { delay } from "./mock/delay";

export const accountService = {
  /** Placeholder — real authentication and account storage are added with the backend. */
  createAccount(details: AccountDetails): Promise<User> {
    return delay({ ...details }, 400);
  },
};
