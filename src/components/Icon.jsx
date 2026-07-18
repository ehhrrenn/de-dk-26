// Small monochrome line-drawing icon set (stroke=currentColor, no fills) --
// replaces emoji everywhere in the UI so icons stay consistent with the
// app's flat, high-contrast look regardless of platform emoji rendering.
const PATHS = {
  settings: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="18" r="2" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <rect x="8" y="7" width="2.5" height="2.5" />
      <rect x="13.5" y="7" width="2.5" height="2.5" />
      <rect x="8" y="12" width="2.5" height="2.5" />
      <rect x="13.5" y="12" width="2.5" height="2.5" />
      <line x1="10" y1="21" x2="10" y2="17" />
      <line x1="14" y1="21" x2="14" y2="17" />
    </>
  ),
  flight: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  train: (
    <>
      <rect x="6" y="3" width="12" height="13" rx="4" />
      <line x1="6" y1="11" x2="18" y2="11" />
      <line x1="9" y1="16" x2="7" y2="21" />
      <line x1="15" y1="16" x2="17" y2="21" />
    </>
  ),
  car: (
    <>
      <path d="M3 13l2-6h14l2 6" />
      <rect x="3" y="13" width="18" height="5" rx="1" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  shopping: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </>
  ),
  beer: (
    <>
      <path d="M5 8h10v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
      <path d="M15 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
      <line x1="5" y1="12" x2="15" y2="12" />
    </>
  ),
  landmark: (
    <>
      <polygon points="3 9 12 3 21 9" />
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="5" y1="21" x2="5" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
      <line x1="15" y1="21" x2="15" y2="9" />
      <line x1="19" y1="21" x2="19" y2="9" />
    </>
  ),
  walk: (
    <>
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5l-3 3M12 11l3 4M9 14l-2 6M15 15l2 5" />
    </>
  ),
  wine: (
    <>
      <path d="M8 3h8l-1 6a3 3 0 01-6 0L8 3z" />
      <line x1="12" y1="12" x2="12" y2="19" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </>
  ),
  castle: (
    <path d="M4 21V11h3V8h2v3h2V6h2v5h2V8h2v3h3v10H4z" />
  ),
  disco: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
}

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {PATHS[name] || PATHS.pin}
    </svg>
  )
}
