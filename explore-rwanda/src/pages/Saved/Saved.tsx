import { AccountForm } from "../../components/account/AccountForm";
import { Button } from "../../components/common/Button";
import { SectionHeading } from "../../components/common/SectionHeading";
import { EmptyState } from "../../components/common/StateViews";
import { DestinationCard } from "../../components/destination/DestinationCard";
import { TripCard } from "../../components/trip/TripCard";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { destinationService, tripService } from "../../services";
import type { TranslationKey } from "../../translations";

const WHEN: TranslationKey[] = ["account.when.register", "account.when.save", "account.when.review", "account.when.organize"];

export default function Saved() {
  const { t } = useI18n();
  const { user, saved } = useAccount();
  useDocumentTitle(`${t("saved.title")} — Explore Rwanda`);
  const destIds = saved.filter((s) => s.type === "destination").map((s) => s.id);
  const tripIds = saved.filter((s) => s.type === "trip").map((s) => s.id);
  const dests = useAsync(() => destinationService.getByIds(destIds), [destIds.join(",")]);
  const trips = useAsync(() => tripService.getByIds(tripIds), [tripIds.join(",")]);

  if (!user) {
    return (
      <div className="container container--narrow section">
        <SectionHeading as="h1" title={t("saved.guestTitle")} description={t("saved.gateText")} />
        <p className="t-muted">{t("account.guestText")}</p>
        <ul className="checklist">
          {WHEN.map((k) => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
        <div className="reg-gate">
          <AccountForm idPrefix="saved" />
        </div>
        <Button to="/explore" variant="secondary">
          {t("nav.explore")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container section">
      <SectionHeading as="h1" title={t("saved.title")} description={t("saved.subtitle")} />
      {saved.length === 0 ? (
        <EmptyState
          title={t("saved.emptyTitle")}
          message={t("saved.emptyText")}
          action={
            <Button to="/explore" variant="secondary">
              {t("nav.explore")}
            </Button>
          }
        />
      ) : (
        <>
          {dests.data && dests.data.length > 0 && (
            <section>
              <h2 className="t-h2">{t("saved.places")}</h2>
              <div className="card-grid">
                {dests.data.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>
          )}
          {trips.data && trips.data.length > 0 && (
            <section>
              <h2 className="t-h2">{t("saved.trips")}</h2>
              <div className="card-grid">
                {trips.data.map((tr) => (
                  <TripCard key={tr.id} trip={tr} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
