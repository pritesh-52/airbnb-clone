import type { SVGProps } from 'react';
import type { AmenityIcon } from '@airbnb-clone/types';

/**
 * Icon set.
 *
 * Airbnb's own icons ship from a private sprite, so these are hand-drawn
 * equivalents on the same 24×24 grid with a 2px stroke and `currentColor`, which
 * keeps them tintable and legible at the sizes the page uses (16/20/24/32).
 *
 * Every icon is decorative by default (`aria-hidden`); callers that need a
 * standalone accessible name pass `role="img"` and `aria-label` explicitly.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ brand */

export function AirbnbLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 1c-3.1 0-5.2 2.1-6.9 5.4-.6 1.2-1.4 2.9-2.4 5.1l-.4.9C4.4 16.7 3 20 3 22.4 3 26 5.7 29 9.4 29c2.4 0 4.6-1.4 6.6-3.9 2 2.5 4.2 3.9 6.6 3.9 3.7 0 6.4-3 6.4-6.6 0-2.4-1.4-5.7-3.3-10l-.4-.9c-1-2.2-1.8-3.9-2.4-5.1C21.2 3.1 19.1 1 16 1Zm0 2.4c1.9 0 3.4 1.5 4.8 4.3.6 1.1 1.3 2.8 2.3 5l.4.9c1.8 4 3.1 7.1 3.1 8.8 0 2.4-1.7 4.2-4 4.2-1.8 0-3.6-1.3-5.4-3.7 2-2.7 3.3-5.3 3.3-7.5 0-2.7-1.9-4.6-4.5-4.6s-4.5 1.9-4.5 4.6c0 2.2 1.3 4.8 3.3 7.5-1.8 2.4-3.6 3.7-5.4 3.7-2.3 0-4-1.8-4-4.2 0-1.7 1.3-4.8 3.1-8.8l.4-.9c1-2.2 1.7-3.9 2.3-5C12.6 4.9 14.1 3.4 16 3.4Zm0 9.8c1.3 0 2.1.9 2.1 2.3 0 1.5-.9 3.5-2.1 5.4-1.2-1.9-2.1-3.9-2.1-5.4 0-1.4.8-2.3 2.1-2.3Z" />
    </svg>
  );
}

/* --------------------------------------------------------------------- ui */

export function StarIcon({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15.1 1.6-4 8.1-9 1.3c-.7.1-1 1-.5 1.5l6.5 6.3-1.5 8.9c-.1.7.6 1.3 1.3 1l8-4.2 8 4.2c.6.3 1.4-.3 1.3-1l-1.5-8.9 6.5-6.3c.5-.5.2-1.4-.5-1.5l-9-1.3-4-8.1c-.3-.7-1.3-.7-1.6 0Z" />
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.7-8 6 0 .6.4 1 1 1h14c.6 0 1-.4 1-1 0-3.3-3.6-6-8-6Z" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 9 7 7 7-7" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);

export const ShareIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v13M8 7l4-4 4 4" />
    <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </Svg>
);

export const HeartIcon = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  // Outline when unsaved: a translucent fill reads as a dark blob on the white
  // chrome this icon actually sits on.
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5C6.5 16.6 3 13.3 3 9.6 3 6.9 5.1 5 7.6 5c1.6 0 3.2.8 4.4 2.4C13.2 5.8 14.8 5 16.4 5 18.9 5 21 6.9 21 9.6c0 3.7-3.5 7-9 10.9Z" />
  </Svg>
);

export const GridIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);

export const MedalIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v6c0 4.4 2.9 8.2 7 9 4.1-.8 7-4.6 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);

export const FlagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 21V4M5 4h10l-1.5 3.5L15 11H5" />
  </Svg>
);

export const VerifiedIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="m12 2 2.4 1.7 2.9-.3 1 2.8 2.5 1.6-.9 2.8.9 2.8-2.5 1.6-1 2.8-2.9-.3L12 19.4l-2.4-1.7-2.9.3-1-2.8-2.5-1.6.9-2.8-.9-2.8 2.5-1.6 1-2.8 2.9.3L12 2Zm-1 12.3 5-5-1.4-1.4-3.6 3.6-1.6-1.6L8 11.3l3 3Z" />
  </Svg>
);

/* ------------------------------------------------- guest favourite laurel */

/**
 * One half of the laurel wreath that flanks the rating on the "Guest
 * favourite" banner. Built from angled leaf ellipses along a stem rather than
 * one hand-authored path, which keeps the curve even and easy to tune.
 *
 * Render the right-hand side by mirroring: `className="-scale-x-100"`.
 */
export function LaurelIcon({ className, height = 92 }: { className?: string; height?: number }) {
  // Five large leaves offset outward from the stem and rotated to fan away from
  // it. Smaller leaves centred on the stem read as a string of beads.
  const leaves = [
    { cx: 19, cy: 53, angle: -62 },
    { cx: 14, cy: 42, angle: -44 },
    { cx: 11.5, cy: 30.5, angle: -22 },
    { cx: 12.5, cy: 19, angle: 0 },
    { cx: 17, cy: 8.5, angle: 28 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 32 64"
      width={(height * 32) / 64}
      height={height}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M27 60c-5.5-6.5-8.5-13-9.5-20S18 25 19.5 17C20.4 12 21.5 8 23 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {leaves.map((leaf) => (
        <ellipse
          key={`${leaf.cx}-${leaf.cy}`}
          cx={leaf.cx}
          cy={leaf.cy}
          rx="5.5"
          ry="10"
          transform={`rotate(${leaf.angle} ${leaf.cx} ${leaf.cy})`}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------- rating category icons (32px) */

export const SprayBottleIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <path d="M10 8h5a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-9a3 3 0 0 1 2-2.8Z" />
    <path d="M10 8V4h4v4M14 5h3.5M17.5 5v2M6 6l2.5 1M6 9l2.5.6" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);

export const KeyIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <circle cx="8.5" cy="8.5" r="4.5" />
    <path d="m11.8 11.8 8.2 8.2M17 17l-2 2M20 20l1.5-1.5" />
  </Svg>
);

export const MessageIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6Z" />
  </Svg>
);

export const MapIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <path d="m3 6.5 6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5V6.5Z" />
    <path d="M9 4v15.5M15 6.5V22" />
  </Svg>
);

export const TagIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.5}>
    <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5a1 1 0 0 1 .7.3l7.5 7.5a1 1 0 0 1 0 1.4l-8.5 8.5a1 1 0 0 1-1.4 0L3.3 13.2a1 1 0 0 1-.3-.7Z" />
    <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
  </Svg>
);

/* ---------------------------------------------------------- amenity icons */

const AMENITY_PATHS: Record<AmenityIcon, React.ReactNode> = {
  wifi: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" />
    </>
  ),
  kitchen: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 11h16M8 6.5h3M8 15.5h3" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9.5 17V7.5h3a3 3 0 0 1 0 6h-3" />
    </>
  ),
  pool: (
    <>
      <path d="M2 18c1.7 0 1.7 1.5 3.3 1.5S7 18 8.7 18s1.7 1.5 3.3 1.5S13.7 18 15.3 18s1.7 1.5 3.4 1.5S20.3 18 22 18" />
      <path d="M7 16V5a2 2 0 0 1 4 0v11M13 16V5a2 2 0 0 1 4 0v11M7 9h4M13 9h4" />
    </>
  ),
  'air-conditioning': (
    <>
      <rect x="3" y="4" width="18" height="9" rx="2" />
      <path d="M6.5 17v3M12 17v3M17.5 17v3M7 9h10" />
    </>
  ),
  heating: (
    <>
      <path d="M12 3c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7Z" />
      <path d="M6 21c1.5-2 2.5-3.5 2.5-5M18 21c-1.5-2-2.5-3.5-2.5-5" />
    </>
  ),
  tv: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8" />
    </>
  ),
  washer: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M8 6.5h.01M11 6.5h.01" />
    </>
  ),
  dryer: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M9.6 14c1.6-1.6 3.2 1.6 4.8 0" />
      <path d="M8 6.5h.01" />
    </>
  ),
  workspace: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20M9 16v4M15 16v4" />
    </>
  ),
  'hot-tub': (
    <>
      <path d="M4 12h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5Z" />
      <path d="M9 8V5.5a1.5 1.5 0 0 1 3 0M15.5 9V6" />
    </>
  ),
  bbq: (
    <>
      <path d="M4 7h16l-2.5 8.5a4 4 0 0 1-3.8 2.8h-3.4a4 4 0 0 1-3.8-2.8L4 7Z" />
      <path d="M9 21l1.5-3M15 21l-1.5-3M12 3v2" />
    </>
  ),
  fireplace: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 17c-1.7 0-3-1.2-3-2.8 0-2 2-2.7 2-5.2 2 1 4 2.8 4 5.2 0 1.6-1.3 2.8-3 2.8Z" />
    </>
  ),
  gym: (
    <>
      <path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12" />
    </>
  ),
  beach: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M2 18c1.7 0 1.7 1.5 3.3 1.5S7 18 8.7 18s1.7 1.5 3.3 1.5S13.7 18 15.3 18s1.7 1.5 3.4 1.5S20.3 18 22 18" />
      <path d="M12 12v3" />
    </>
  ),
  pets: (
    <>
      <circle cx="7" cy="9" r="2" />
      <circle cx="12" cy="6.5" r="2" />
      <circle cx="17" cy="9" r="2" />
      <path d="M12 11c-2.8 0-5 2.4-5 5 0 2 1.6 3 3.2 3h3.6c1.6 0 3.2-1 3.2-3 0-2.6-2.2-5-5-5Z" />
    </>
  ),
  'smoke-alarm': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  'first-aid': (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M9 6V4h6v2M12 10v6M9 13h6" />
    </>
  ),
  'security-camera': (
    <>
      <path d="M3 8.5 17 5l1.5 5.5L4.5 14 3 8.5Z" />
      <path d="M6 14v3a3 3 0 0 0 3 3M18.5 10.5 22 9" />
    </>
  ),
  'self-check-in': (
    <>
      <circle cx="9" cy="12" r="4" />
      <path d="M13 12h8M18 12v3.5M15.5 12v2.5" />
    </>
  ),
};

/** Renders the glyph for an amenity/highlight icon key. */
export function AmenityGlyph({
  name,
  size = 24,
  className,
}: {
  name: AmenityIcon;
  size?: number;
  className?: string;
}) {
  return (
    <Svg size={size} className={className} strokeWidth={1.6}>
      {AMENITY_PATHS[name]}
    </Svg>
  );
}
