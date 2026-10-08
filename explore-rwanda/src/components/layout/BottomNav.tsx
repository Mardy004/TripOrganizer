import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { AccountGate } from "../account/AccountGate";
import { Drawer } from "../common/Modal";
import { Icon } from "../common/Icon";
import type { IconName } from "../common/Icon";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import type { TranslationKey } from "../../translations";

const tabs: { to: string; key: TranslationKey; icon: IconName; end?: boolean }[] = [
  { to: "/", key: "nav.home", icon: "home", end: true },
  { to: "/explore", key: "nav.explore", icon: "explore" },
  { to: "/trips", key: "nav.trips", icon: "trips" },
  { to: "/saved", key: "nav.saved", icon: "heart" },
];

const moreLinks: { to: string; key: TranslationKey; icon: IconName }[] = [
  { to: "/destinations", key: "nav.destinations", icon: "pin" },
  { to: "/organizers", key: "nav.organizers", icon: "users" },
  { to: "/organize", key: "nav.becomeOrganizer", icon: "building" },
  { to: "/about", key: "nav.about", icon: "info" },
];

/**
 * Thumb-reach navigation for mobile: Home, Explore, Trips, Saved, More. Secondary links, the
 * language switcher and the account live in the More sheet.
 */
export function BottomNav() {
  const { t } = useI18n();
  const { user, signOut } = useAccount();
  const [more, setMore] = useState(false);
  const [gate, setGate] = useState(false);

  return (
    <>
      <nav className="bottomnav" aria-label={t("nav.mobile")}>
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `bottomnav__item ${isActive ? "is-active" : ""}`}>
            <Icon name={tab.icon} size={22} />
            <span>{t(tab.key)}</span>
          </NavLink>
        ))}
        <button type="button" className="bottomnav__item" aria-haspopup="dialog" onClick={() => setMore(true)}>
          <Icon name="menu" size={22} />
          <span>{t("nav.more")}</span>
        </button>
      </nav>

      <Drawer open={more} onClose={() => setMore(false)} title={t("nav.more")}>
        <ul className="more-list">
          {moreLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setMore(false)}>
                <Icon name={l.icon} size={22} />
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="more-block">
          <p className="t-label">{t("lang.label")}</p>
          <LanguageSwitcher />
        </div>
        <div className="more-block">
          <p className="t-label">{t("nav.account")}</p>
          {user ? (
            <>
              <p>{t("account.welcome", { name: user.fullName })}</p>
              <button type="button" className="link-btn" onClick={signOut}>
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn--secondary btn--md btn--block"
              onClick={() => {
                setMore(false);
                setGate(true);
              }}
            >
              {t("nav.createAccount")}
            </button>
          )}
        </div>
      </Drawer>

      <AccountGate
        open={gate}
        onClose={() => setGate(false)}
        title={t("account.guestTitle")}
        text={t("account.guestText")}
        onCreated={() => setGate(false)}
      />
    </>
  );
}
