import { useState } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import type { SavedType } from "../../types";
import { AccountGate } from "../account/AccountGate";
import { Icon } from "./Icon";

type Props = { type: SavedType; id: string; name: string; className?: string };

/**
 * Heart toggle. Saving needs an account, so visitors get an explanation and a short sign-up instead
 * of a login wall; their save is applied as soon as the account exists.
 */
export function SaveButton({ type, id, name, className = "" }: Props) {
  const { t } = useI18n();
  const { user, isSaved, toggleSaved } = useAccount();
  const [gate, setGate] = useState(false);
  const saved = isSaved(type, id);

  return (
    <>
      <button
        type="button"
        className={`save-btn ${saved ? "is-saved" : ""} ${className}`}
        aria-pressed={saved}
        aria-label={saved ? t("saved.remove", { name }) : t("saved.add", { name })}
        onClick={() => (user ? toggleSaved(type, id) : setGate(true))}
      >
        <Icon name="heart" size={20} filled={saved} />
      </button>
      <AccountGate
        open={gate}
        onClose={() => setGate(false)}
        title={type === "trip" ? t("saved.gateTripTitle") : t("saved.gateTitle")}
        text={t("saved.gateText")}
        onCreated={() => {
          toggleSaved(type, id);
          setGate(false);
        }}
      />
    </>
  );
}
