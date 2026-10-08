import type { ReactNode } from "react";
import { useI18n } from "../../context/I18nContext";
import type { User } from "../../types";
import { Modal } from "../common/Modal";
import { AccountForm } from "./AccountForm";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Explains why registration is needed for this specific action. */
  text: string;
  onCreated?: (user: User) => void;
  children?: ReactNode;
};

/**
 * "Registration required" gate. It always explains why an account is needed, what is collected,
 * and how it is used — never a bare "please log in".
 */
export function AccountGate({ open, onClose, title, text, onCreated, children }: Props) {
  const { t } = useI18n();
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="gate__lead">{text}</p>
      {children}
      <details className="gate__why">
        <summary>{t("reg.whyTitle")}</summary>
        <ul>
          <li>{t("reg.why.name")}</li>
          <li>{t("reg.why.phone")}</li>
          <li>{t("reg.why.email")}</li>
        </ul>
        <p className="t-caption">
          <strong>{t("reg.useTitle")}.</strong> {t("reg.useText")}
        </p>
      </details>
      <AccountForm idPrefix="gate" onCreated={onCreated} />
    </Modal>
  );
}
