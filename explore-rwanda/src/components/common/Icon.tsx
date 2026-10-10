const paths = {
  home: "M3 11 L12 3 L21 11 M5 10 V20 H19 V10 M10 20 V14 H14 V20",
  explore: "M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z",
  trips: "M4 7 H20 V20 H4 Z M4 11 H20 M8 4 V8 M16 4 V8",
  heart:
    "M12 20.5 C6 15.5 3 12.5 3 8.8 C3 6.2 5 4.5 7.3 4.5 C9.2 4.5 11 5.6 12 7.2 C13 5.6 14.8 4.5 16.7 4.5 C19 4.5 21 6.2 21 8.8 C21 12.5 18 15.5 12 20.5 Z",
  menu: "M4 7 H20 M4 12 H20 M4 17 H20",
  pin: "M12 21 C8 16 5 13 5 9.5 a7 7 0 0 1 14 0 C19 13 16 16 12 21 Z M9.5 9.5 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0",
  ticket: "M3 8 V6 H21 V8 a2.5 2.5 0 0 0 0 5 V16 H3 V13 a2.5 2.5 0 0 0 0 -5 Z",
  star: "M12 3 L14.8 9 L21 9.8 L16.4 14.2 L17.6 20.5 L12 17.3 L6.4 20.5 L7.6 14.2 L3 9.8 L9.2 9 Z",
  mountain: "M3 20 L9 8 L13 15 L16 11 L21 20 Z",
  clock: "M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M12 7 V12 L15 14",
  sun: "M12 4 V6 M12 18 V20 M4 12 H6 M18 12 H20 M6.3 6.3 L7.7 7.7 M16.3 16.3 L17.7 17.7 M6.3 17.7 L7.7 16.3 M16.3 7.7 L17.7 6.3 M8.5 12 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
  users: "M6 9 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M3 19 C3 15.5 6 14 9 14 C12 14 15 15.5 15 19 M16 8 a2.5 2.5 0 1 1 0 5 M17 14.2 C19.5 14.6 21 16 21 19",
  check: "M5 12.5 L10 17.5 L19 7",
  user: "M8 8 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M4 21 C4 16.5 8 15 12 15 C16 15 20 16.5 20 21",
  search: "M4 11 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M16 16 L21 21",
  close: "M5 5 L19 19 M19 5 L5 19",
  filter: "M4 6 H20 M7 12 H17 M10 18 H14",
  building: "M5 21 V5 H15 V21 M15 10 H19 V21 M3 21 H21 M8 9 H12 M8 13 H12 M8 17 H12",
  info: "M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M12 11 V16 M12 8 h.01",
  arrow: "M5 12 H19 M13 6 L19 12 L13 18",
  moon: "M20 14.5 A8.5 8.5 0 0 1 9.5 4 A7 7 0 1 0 20 14.5 Z",
} as const;

export type IconName = keyof typeof paths;

type Props = { name: IconName; size?: number; filled?: boolean; className?: string };

export function Icon({ name, size = 22, filled = false, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
