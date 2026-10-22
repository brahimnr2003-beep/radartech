// Iconos de trazo del boceto (24×24, color por currentColor)
const ICONS = {
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  bars: <path d="M4 20V10M12 20V4M20 20v-7" />,
  code: <path d="M8 6 2 12l6 6M16 6l6 6-6 6" />,
  cloud: (
    <path d="M6 18a4 4 0 1 1 1.2-7.82A5.5 5.5 0 0 1 18 12a3.5 3.5 0 0 1-.5 6.98H6Z" />
  ),
  shield: <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />,
  rocket: (
    <path d="M5 15c-1 3-1 6-1 6s3 0 6-1M12 15l-3-3c1-5 4-9 9-10 1 5-1 8-6 9v0M9 12 6 9M12 15l3 3" />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  tag: (
    <>
      <path d="M20 12 12 20l-8-8V4h8l8 8Z" />
      <circle cx="8" cy="8" r="1.2" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
    </>
  ),
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
