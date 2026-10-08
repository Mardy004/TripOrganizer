import { NavLink } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import type { TranslationKey } from "../../translations";
import { Logo } from "../common/Logo";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { Button } from "../common/Button";
import { AccountMenu } from "./AccountMenu";

const links: { to: string; key: TranslationKey; end?: boolean }[] = [
  { to: "/explore", key: "nav.explore" },
  { to: "/destinations", key: "nav.destinations" },
  { to: "/trips", key: "nav.trips" },
  { to: "/organizers", key: "nav.organizers" },
  { to: "/about", key: "nav.about" },
];


export function Navbar() {
  const { t } = useI18n();
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />
        <nav className="navbar__links" aria-label={t("nav.primary")}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}>
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
        <div className="navbar__actions">
          <LanguageSwitcher />
          <div className="navbar__desktop-only">
            <Button to="/organize" variant="ghost">
              {t("nav.becomeOrganizer")}
            </Button>
            <AccountMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
