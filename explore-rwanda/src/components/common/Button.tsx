import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "dark" | "secondary" | "ghost" | "light";

type CommonProps = {
  variant?: Variant;
  size?: "md" | "lg";
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { to?: undefined };

type LinkProps = CommonProps & { to: string };

/** "primary" is the gold call-to-action; "dark" is forest; "secondary" is an outline. */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", block, className, children } = props;
  const cls = ["btn", `btn--${variant}`, `btn--${size}`, block ? "btn--block" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, to: _t, ...rest } = props;
  void _v; void _s; void _b; void _c; void _ch; void _t;
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
