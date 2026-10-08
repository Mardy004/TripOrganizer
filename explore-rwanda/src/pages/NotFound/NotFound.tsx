import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/StateViews";
import { useI18n } from "../../context/I18nContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function NotFound() {
  const { t } = useI18n();
  useDocumentTitle(`404 — Explore Rwanda`);
  return (
    <div className="container section">
      <EmptyState
        title={t("state.notFoundPage")}
        message={t("state.notFoundPageText")}
        action={
          <Button to="/">{t("state.backHome")}</Button>
        }
      />
    </div>
  );
}
