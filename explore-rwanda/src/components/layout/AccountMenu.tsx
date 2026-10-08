import { useState } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { AccountGate } from "../account/AccountGate";
import { Button } from "../common/Button";

/** Header account control: "Create account" for visitors, name + sign out for participants. */
export function AccountMenu() {
  const { t } = useI18n();
  const { user, signOut } = useAccount();
  const [open, setOpen] = useState(false);

  if (user) {
    return (
      <div className="account-menu">
        <span className="account-menu__name">{t("nav.hello", { name: user.fullName.split(" ")[0] })}</span>
        <button type="button" className="link-btn" onClick={signOut}>
          {t("nav.signOut")}
        </button>
      </div>
    );
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t("nav.createAccount")}
      </Button>
      <AccountGate
        open={open}
        onClose={() => setOpen(false)}
        title={t("account.guestTitle")}
        text={t("account.guestText")}
        onCreated={() => setOpen(false)}
      >
        <ul className="checklist gate__list">
          <li>{t("account.when.register")}</li>
          <li>{t("account.when.save")}</li>
          <li>{t("account.when.review")}</li>
          <li>{t("account.when.organize")}</li>
        </ul>
      </AccountGate>
    </>
  );
}
