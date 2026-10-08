import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../context/I18nContext";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { Icon } from "./Icon";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "modal" | "drawer";
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog. Rendered in a portal so it is never clipped or offset by transformed/overflow
 * ancestors (cards, for example). `drawer` slides up from the bottom on mobile.
 */
export function Modal({ open, title, onClose, children, variant = "modal" }: Props) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={`overlay overlay--${variant}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`dialog dialog--${variant}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panelRef}>
        <div className="dialog__header">
          <h2 className="t-h3">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t("common.close")}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="dialog__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Drawer(props: Omit<Props, "variant">) {
  return <Modal {...props} variant="drawer" />;
}
