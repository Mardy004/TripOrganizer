import { useState } from "react";
import { SectionHeading } from "../../components/common/SectionHeading";
import { CardGridSkeleton, EmptyState, ErrorState } from "../../components/common/StateViews";
import { OrganizerCard } from "../../components/organizer/OrganizerCard";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { organizerService } from "../../services";
import type { OrganizerType } from "../../types";

type Group = "all" | OrganizerType;

export default function Organizers() {
  const { t } = useI18n();
  useDocumentTitle(`${t("org.title")} — Explore Rwanda`);
  const [group, setGroup] = useState<Group>("all");
  const state = useAsync(() => organizerService.getAll(), []);
  const tabs: { id: Group; label: string }[] = [
    { id: "all", label: t("org.filterAll") },
    { id: "individual", label: t("org.filterIndividual") },
    { id: "company", label: t("org.filterCompany") },
  ];
  const list = state.data?.filter((o) => group === "all" || o.type === group) ?? [];
  return (
    <div className="container section">
      <SectionHeading as="h1" eyebrow={t("org.eyebrow")} title={t("org.title")} description={t("org.subtitle")} />
      <div className="chips" role="group" aria-label={t("org.title")}>
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`chip ${group === x.id ? "chip--on" : ""}`}
            aria-pressed={group === x.id}
            onClick={() => setGroup(x.id)}
          >
            {x.label}
          </button>
        ))}
      </div>
      {state.status === "loading" && <CardGridSkeleton />}
      {state.status === "error" && <ErrorState onRetry={state.retry} />}
      {state.status === "success" &&
        (list.length === 0 ? (
          <EmptyState title={t("org.empty")} />
        ) : (
          <div className="card-grid">
            {list.map((o) => (
              <OrganizerCard key={o.id} organizer={o} />
            ))}
          </div>
        ))}
    </div>
  );
}
