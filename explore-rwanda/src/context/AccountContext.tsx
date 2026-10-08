import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { accountService } from "../services/accountService";
import type { AccountDetails, SavedItem, SavedType, User } from "../types";

/**
 * Mock account state. 
 */
type Account = {
  user: User | null;
  createAccount: (details: AccountDetails) => Promise<User>;
  signOut: () => void;
  saved: SavedItem[];
  isSaved: (type: SavedType, id: string) => boolean;
  toggleSaved: (type: SavedType, id: string) => void;
};

const Ctx = createContext<Account | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>([]);

  const createAccount = useCallback(async (details: AccountDetails) => {
    const created = await accountService.createAccount(details);
    setUser(created);
    return created;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setSaved([]);
  }, []);

  const isSaved = useCallback((type: SavedType, id: string) => saved.some((s) => s.type === type && s.id === id), [saved]);

  const toggleSaved = useCallback((type: SavedType, id: string) => {
    setSaved((list) =>
      list.some((s) => s.type === type && s.id === id)
        ? list.filter((s) => !(s.type === type && s.id === id))
        : [...list, { type, id }],
    );
  }, []);

  const value = useMemo(
    () => ({ user, createAccount, signOut, saved, isSaved, toggleSaved }),
    [user, createAccount, signOut, saved, isSaved, toggleSaved],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount(): Account {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
