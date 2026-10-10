import { useTheme } from "../../context/ThemeContext";
import { Icon } from "./Icon";

/**
 * Icon-only light/dark switch. Uses the reserved `theme.toggle` label for its accessible name,
 * so no visible words are added to the page.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const label = "Toggle theme";
  const title = resolved === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      className={`icon-btn theme-toggle ${className}`}
      onClick={toggle}
      aria-label={label}
      title={title}
      aria-pressed={resolved === "dark"}
    >
      <Icon name={resolved === "dark" ? "sun" : "moon"} size={20} />
    </button>
  );
}
