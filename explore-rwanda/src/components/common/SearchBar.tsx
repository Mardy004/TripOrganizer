import { useI18n } from "../../context/I18nContext";
import { Icon } from "./Icon";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  size?: "md" | "lg";
  id?: string;
};

export function SearchBar({ value, onChange, onSubmit, placeholder, size = "md", id = "site-search" }: Props) {
  const { t } = useI18n();
  return (
    <form
      className={`searchbar searchbar--${size}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <label htmlFor={id} className="visually-hidden">
        {t("search.label")}
      </label>
      <Icon name="search" size={20} className="searchbar__icon" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="searchbar__btn">
        {t("search.button")}
      </button>
    </form>
  );
}
