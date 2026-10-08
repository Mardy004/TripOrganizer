import { useId, useState } from "react";
import type { ImageTone } from "../../types";

type Palette = { sky1: string; sky2: string; sun: string; far: string; mid: string; near: string };

const palettes: Record<ImageTone, Palette> = {
  hills: { sky1: "#f3e3c3", sky2: "#e9c98f", sun: "#fbf2dc", far: "#9fb79c", mid: "#5f8761", near: "#2f5a43" },
  lake: { sky1: "#e8e1cf", sky2: "#c8d6d2", sun: "#f9efd6", far: "#90aaa4", mid: "#5d8586", near: "#35575a" },
  forest: { sky1: "#dfe5d3", sky2: "#a9c0a0", sun: "#eef0d8", far: "#6f9577", mid: "#3f6b4d", near: "#1d3a2b" },
  savanna: { sky1: "#f6dfb4", sky2: "#e2a96a", sun: "#fdf0d2", far: "#c79a62", mid: "#a27544", near: "#6b4a2b" },
  volcano: { sky1: "#e7e3d6", sky2: "#b8c4c7", sun: "#f6f1e4", far: "#7f9396", mid: "#4f6a67", near: "#26403a" },
  falls: { sky1: "#e4e8da", sky2: "#b5c9b2", sun: "#f4f0de", far: "#7fa184", mid: "#4a7a58", near: "#24432f" },
};

type Props = {
  tone: ImageTone;
  alt: string;
  /** A real photograph URL. When present (and loadable) it replaces the illustration. */
  src?: string;
  className?: string;
};

/**
 * Renders a real photograph when `src` is provided, otherwise a lightweight illustrated landscape
 * (a few SVG shapes, no network request). Swap in photography by filling `images` in the data/API.
 */
export function LandscapeImage({ tone, alt, src, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const [failed, setFailed] = useState(false);
  const p = palettes[tone];

  if (src && !failed) {
    return (
      <img
        className={`landscape ${className}`}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg
      className={`landscape ${className}`}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky2} />
          <stop offset="1" stopColor={p.sky1} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#sky-${uid})`} />
      <circle cx="590" cy="170" r="48" fill={p.sun} opacity="0.9" />

      {tone === "volcano" && (
        <>
          <path d="M60 330 L250 120 L300 150 L330 130 L520 330 Z" fill={p.far} />
          <path d="M360 340 L560 150 L600 170 L640 140 L800 300 L800 340 Z" fill={p.far} opacity="0.8" />
        </>
      )}
      {tone === "savanna" && <rect y="330" width="800" height="170" fill={p.far} />}

      <path d="M0 330 Q120 250 240 300 T480 290 T720 280 T800 300 V500 H0 Z" fill={p.far} opacity={tone === "volcano" ? 0.9 : 1} />
      <path d="M0 380 Q160 310 320 360 T640 350 T800 370 V500 H0 Z" fill={p.mid} />

      {tone === "lake" && <rect y="400" width="800" height="100" fill={p.far} opacity="0.6" />}

      <path d="M0 440 Q200 390 400 430 T800 420 V500 H0 Z" fill={p.near} />

      {tone === "forest" &&
        [80, 150, 230, 520, 610, 700].map((x, i) => (
          <path key={x} d={`M${x} 440 L${x + 22} ${380 - (i % 3) * 12} L${x + 44} 440 Z`} fill={p.near} />
        ))}

      {tone === "savanna" && (
        <g fill={p.near}>
          <rect x="150" y="360" width="5" height="80" />
          <ellipse cx="152" cy="355" rx="46" ry="12" />
        </g>
      )}

      {tone === "falls" && (
        <g stroke="#f6f1e4" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <line x1="380" y1="320" x2="380" y2="420" />
          <line x1="395" y1="320" x2="395" y2="420" />
          <line x1="410" y1="320" x2="410" y2="420" />
        </g>
      )}
    </svg>
  );
}
