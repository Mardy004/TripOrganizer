import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { Logo } from "../common/Logo";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo inverse />
          <p>{t("footer.blurb")}</p>
        </div>
        <nav aria-label={t("footer.explore")} className="footer__col">
          <h2 className="footer__title">{t("footer.explore")}</h2>
          <Link to="/explore">{t("nav.explore")}</Link>
          <Link to="/destinations">{t("nav.destinations")}</Link>
          <Link to="/trips">{t("nav.trips")}</Link>
        </nav>
        <nav aria-label={t("footer.organizers")} className="footer__col">
          <h2 className="footer__title">{t("footer.organizers")}</h2>
          <Link to="/organizers">{t("nav.organizers")}</Link>
          <Link to="/organize">{t("nav.becomeOrganizer")}</Link>
          <Link to="/about#safety">{t("footer.safety")}</Link>
        </nav>
        <nav aria-label={t("footer.company")} className="footer__col">
          <h2 className="footer__title">{t("footer.company")}</h2>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/about#how-it-works">{t("footer.howItWorks")}</Link>
        </nav>
      </div>
      <div className="container footer__legal">
        <p>© Ae°n ✨ ● 2026</p>
      </div>
    </footer>
  );
}
