import type { ReactNode } from "react";
import { useI18n } from "../../context/I18nContext";
import { Button } from "./Button";
import { Icon } from "./Icon";

type EmptyProps = { title: string; message?: string; action?: ReactNode };

export function EmptyState({ title, message, action }: EmptyProps) {
  return (
    <div className="state state--empty">
      <Icon name="mountain" size={44} className="state__mark" />
      <h3 className="t-h3">{title}</h3>
      {message && <p className="t-muted">{message}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="t-muted">{label ?? t("common.loading")}…</p>
    </div>
  );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  const { t } = useI18n();
  return (
    <div className="card-grid" role="status" aria-label={t("common.loading")}>
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i} aria-hidden="true">
          <div className="skeleton skeleton--image" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--short" />
        </div>
      ))}
    </div>
  );
}

/** Never shows raw technical errors — only a friendly message and a retry action. */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="state state--error" role="alert">
      <h3 className="t-h3">{t("state.errorTitle")}</h3>
      <p className="t-muted">{message ?? t("state.errorText")}</p>
      {onRetry && (
        <div className="state__action">
          <Button variant="secondary" onClick={onRetry}>
            {t("common.tryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
}
