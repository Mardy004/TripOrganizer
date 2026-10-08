import { OrganizerApplication } from "../../components/organizer/OrganizerApplication";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function OrganizerRequest() {
  const { t } = useI18n();
  useDocumentTitle(`${t("apply.title")} — Explore Rwanda`);
  return (
    <div className="container container--narrow section">
      <h1 className="t-h1">{t("apply.title")}</h1>
      <p className="t-lead">{t("apply.lead")}</p>
      <OrganizerApplication />
    </div>
  );
}
