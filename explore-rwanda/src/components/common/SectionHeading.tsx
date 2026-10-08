import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  inverse?: boolean;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({ eyebrow, title, description, action, inverse, as: Tag = "h2" }: Props) {
  const cls = Tag === "h1" ? "t-h1" : Tag === "h2" ? "t-h2" : "t-h3";
  return (
    <div className={`section-heading ${inverse ? "section-heading--inverse" : ""}`}>
      <div className="section-heading__text">
        {eyebrow && <p className="t-label">{eyebrow}</p>}
        <Tag className={cls}>{title}</Tag>
        {description && <p className="t-lead">{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}
