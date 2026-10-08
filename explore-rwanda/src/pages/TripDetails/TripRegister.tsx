import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/StateViews";
import { RegistrationForm } from "../../components/trip/RegistrationForm";
import { useI18n } from "../../context/I18nContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { tripService } from "../../services";
import { formatDate } from "../../utils/format";
import { isBookable } from "../../utils/filters";

export default function TripRegister() {
  const { id = "" } = useParams();
  const { t, lang } = useI18n();
  const state = useAsync(() => tripService.getById(id), [id]);
  useDocumentTitle(`${t("reg.title")} — Explore Rwanda`);

  const wrap = (node: React.ReactNode) => <div className="container container--narrow section">{node}</div>;
  if (state.status === "loading") return wrap(<LoadingState />);
  if (state.status === "error") return wrap(<ErrorState onRetry={state.retry} />);
  const tr = state.data;
  if (!tr)
    return wrap(
      <EmptyState
        title={t("trip.notFound")}
        message={t("trip.notFoundText")}
        action={
          <Button to="/trips" variant="secondary">
            {t("nav.trips")}
          </Button>
        }
      />,
    );
  if (!isBookable(tr))
    return wrap(
      <EmptyState
        title={t("reg.notOpen")}
        message={t(`status.${tr.status}`)}
        action={
          <Button to={`/trips/${tr.id}`} variant="secondary">
            {t("reg.backToTrip")}
          </Button>
        }
      />,
    );

  return wrap(
    <>
      <p className="t-label">{t("reg.title")}</p>
      <h1 className="t-h1">{tr.title}</h1>
      <p className="t-muted">
        <Link to={`/trips/${tr.id}`}>{tr.destinationName}</Link> · {formatDate(tr.date, lang)} · {tr.organizerName}
      </p>
      <RegistrationForm trip={tr} />
      <aside className="notice">
        <strong>{t("reg.afterTitle")}.</strong> {t("reg.afterText")}
      </aside>
    </>,
  );
}
