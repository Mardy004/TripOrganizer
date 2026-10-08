import { useI18n } from "../../context/I18nContext";
import { formatMoney } from "../../utils/format";
import type { EntryFee as EntryFeeModel } from "../../types";
import { TrustLabel } from "../common/Badges";
import { Icon } from "../common/Icon";

type Props = { fee: EntryFeeModel; variant?: "block" | "inline" };

/**
 * Entry fee is primary information. Never invents a fee: unknown stays "needs confirmation".
 */
export function EntryFee({ fee, variant = "block" }: Props) {
  const { t } = useI18n();
  const value =
    fee.kind === "amount" ? formatMoney(fee.amount) : fee.kind === "none_known" ? t("entry.none") : t("entry.unconfirmed");

  if (variant === "inline") {
    return (
      <span className={`entry entry--inline entry--${fee.kind}`}>
        <Icon name="ticket" size={15} />
        <span>
          <span className="visually-hidden">{t("entry.title")}: </span>
          {value}
        </span>
      </span>
    );
  }

  return (
    <div className={`entry entry--block entry--${fee.kind}`}>
      <p className="entry__label">
        <Icon name="ticket" size={16} /> {t("entry.title")}
      </p>
      <p className="entry__value">{value}</p>
      {fee.kind === "amount" && <TrustLabel kind={fee.confirmation} />}
    </div>
  );
}
