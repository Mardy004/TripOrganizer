import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

/**
 * Temporary text-based wordmark. Replace the contents of this component with the final logo; the
 * navbar, footer and mobile menu all use it. Works on light and dark backgrounds via `inverse`.
 */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className={`logo ${inverse ? "logo--inverse" : ""}`} aria-label={`Explore Rwanda — ${t("nav.home")}`}>
      <svg className="logo__mark" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path d="M2 25 L11 11 L17 19 L22 13 L30 25 Z" fill="currentColor" />
        <circle cx="25" cy="7" r="2.8" fill="var(--color-gold)" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">Explore Rwanda</span>
        <span className="logo__tag">{t("brand.tagline")}</span>
      </span>
    </Link>
  );
}
