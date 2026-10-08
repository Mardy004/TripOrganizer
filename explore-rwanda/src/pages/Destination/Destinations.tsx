import { SectionHeading } from "../../components/common/SectionHeading";
import { CardGridSkeleton, ErrorState } from "../../components/common/StateViews";
import { TrustLegend } from "../../components/common/TrustLegend";
import { DestinationCard } from "../../components/destination/DestinationCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService } from "../../services";

export default function Destinations() {
  const { t } = useI18n();
  useDocumentTitle(`${t("nav.destinations")} — Explore Rwanda`);
  const state = useAsync(() => destinationService.getAll(), []);
  return (
    <div className="container section">
      <SectionHeading as="h1" eyebrow={t("explore.eyebrow")} title={t("explore.destTitle")} description={t("explore.destSubtitle")} />
      {state.status === "loading" && <CardGridSkeleton />}
      {state.status === "error" && <ErrorState onRetry={state.retry} />}
      {state.status === "success" && (
        <div className="card-grid">
          {state.data.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}
      <TrustLegend />
    </div>
  );
}
