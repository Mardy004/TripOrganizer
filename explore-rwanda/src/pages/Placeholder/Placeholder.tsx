import { Button } from "../../components/common/Button";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/** Reserved routes for the organizer dashboard and admin area. */
export default function Placeholder({ area }: { area: "organizer" | "admin" }) {
  const { t } = useI18n();
  const title = t(area === "admin" ? "placeholder.admin" : "placeholder.organizer");
  useDocumentTitle(`${title} | Explore Rwanda`);
  return (
    <div className="container container--narrow section">
      <div className="state">
        <p className="t-label">{t("placeholder.eyebrow")}</p>
        <h1 className="t-h1">{title}</h1>
        <p className="t-muted">{t("placeholder.text")}</p>
        <Button to="/" variant="secondary">
          {t("state.backHome")}
        </Button>
      </div>
    </div>
  );
}
