// ============================================================
// Единый фирменный набор иконок: тонкий штрих 1.5px, чистая
// современная геометрия. Все иконки 24×24, stroke.
// ============================================================

const P = {
  // навигация
  gauge: (
    <>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M12 5v2.5M5.5 8.5l1.8 1.8M18.5 8.5l-1.8 1.8M3 12h2.5M18.5 12H21" />
      <path d="M12 17l3.2-4.6" />
      <path d="M2.5 20.5h19" />
    </>
  ),
  hook: (
    <>
      <circle cx="14.5" cy="4.5" r="1.7" />
      <path d="M14.5 6.2v6.3a4.7 4.7 0 0 1-9.4 0v-2" />
      <path d="M5.1 12.6l-2-1.4M5.1 10.5l2 .7" />
    </>
  ),
  factory: (
    <>
      <path d="M2.5 20.5h19" />
      <path d="M4.5 20.5v-7h4v-3h4v-3h4v13" />
      <path d="M19.5 20.5V4.5h-3" />
      <path d="M7 17h1.5M11 14h1.5M15 11h1.5" />
    </>
  ),
  fan: (
    <>
      <path d="M12 20L3.5 9.5M12 20L7 6.5M12 20V4.5M12 20l5-13.5M12 20l8.5-10.5" />
      <path d="M4.6 11.5a9.5 9.5 0 0 1 14.8 0" />
      <circle cx="12" cy="20" r="1.4" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1" />
      <path d="M4.8 8.5v10a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2v-10" />
      <path d="M9.5 12.5h5" />
    </>
  ),
  tower: (
    <>
      <path d="M12 21V8.5" />
      <path d="M7.5 21L12 13l4.5 8" />
      <circle cx="12" cy="6.5" r="1.8" />
      <path d="M7.8 8.7a6 6 0 0 1 0-4.9M16.2 3.8a6 6 0 0 1 0 4.9" />
      <path d="M2.5 21h19" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M18 6l-1.7 1.7M7.7 16.3L6 18M18 18l-1.7-1.7M7.7 7.7L6 6" />
    </>
  ),
  // конвейер
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7l1.5-2.5h4L15.5 7" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  lens: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.3 15.3L20.5 20.5" />
      <path d="M7.5 10.5a3 3 0 0 1 3-3" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l1-4L17.5 3.5a2 2 0 0 1 3 3L8 19l-4 1z" />
      <path d="M15.5 5.5l3 3" />
    </>
  ),
  funnel: (
    <>
      <path d="M3.5 4.5h17l-6.5 7.5v6l-4 2.5v-8.5L3.5 4.5z" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3l8.5 4.9v8.2L12 21l-8.5-4.9V7.9L12 3z" />
      <path d="M12 12.2L20.5 7.9M12 12.2L3.5 7.9M12 12.2V21" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  // каналы
  plane: (
    <>
      <path d="M21 3.5L3 11l6.2 2.4L11 20l3-4.2 5-12.3z" />
      <path d="M9.2 13.4L21 3.5" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5l5-5" />
      <path d="M11 6.5l1.8-1.8a4 4 0 0 1 5.5 5.5L16.5 12" />
      <path d="M13 17.5l-1.8 1.8a4 4 0 0 1-5.5-5.5L7.5 12" />
    </>
  ),
  vk: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 9c.8 3.2 2.4 5.3 4.5 6V9m0 6c1.9-.8 3.4-2.4 4.5-6" />
    </>
  ),
  dzen: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c0 6-3 9-9 9 6 0 9 3 9 9 0-6 3-9 9-9-6 0-9-3-9-9z" />
    </>
  ),
  insta: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  fb: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M13.5 21v-7h2.5l.5-3h-3V9.2c0-1 .3-1.7 1.8-1.7H17V4.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.8V11H8.5v3h2.7v7" />
    </>
  ),
  ok: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M6.5 15.5a7.5 7.5 0 0 0 11 0M9.5 18.5L8 21m6.5-2.5L16 21" />
    </>
  ),
  // действия
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  send: (
    <>
      <path d="M12 3c3 2.8 4 6.5 4 9.5l-4-1.8-4 1.8c0-3 1-6.7 4-9.5z" />
      <path d="M8.8 14.5L7 18.5l5-2 5 2-1.8-4" />
      <path d="M12 18.5V21" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10M8 10.5l4 4 4-4" />
      <path d="M4 16.5v2.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
    </>
  ),
  expand: <path d="M6 9.5l6 6 6-6" />,
  collapse: <path d="M6 14.5l6-6 6 6" />,
  dna: (
    <>
      <path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12" />
      <path d="M7 15c0 3 2 5 5 6 3-1 5-3 5-6" />
      <path d="M8.2 6.5h7.6M8.2 11.5h7.6" />
    </>
  ),
  quill: (
    <>
      <path d="M20 4c-8 0-13 5-14.5 13L4 20.5" />
      <path d="M20 4c0 8-5 12-11 12.5" />
      <path d="M9 15c2.5-4.5 6-7.5 8.5-8.5" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M3.5 16.5l5-4.5 4 3.5 3.5-3 4.5 4" />
    </>
  ),
  bubble: (
    <>
      <circle cx="10" cy="11" r="6.5" />
      <path d="M12.8 6.9a3.4 3.4 0 0 1 1.6 2.6" />
      <circle cx="18.5" cy="5.5" r="1.6" />
      <circle cx="19" cy="17" r="1.1" />
    </>
  ),
  diamond: <path d="M12 4l6.5 8-6.5 8-6.5-8L12 4z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6v.3" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4L11 13" />
      <path d="M19 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.5" />
    </>
  ),
  wave: (
    <>
      <path d="M3 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 3-2" />
      <path d="M3 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 3-2" />
    </>
  ),
}

export default function Icon({ name, size = 20, className = '', style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={'icon ' + className}
      style={style}
      aria-hidden="true"
    >
      {P[name] || P.diamond}
    </svg>
  )
}

/** Фирменный знак: рыба-ар-деко из вееров и ступеней. */
export function BrandFish({ size = 30 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bf-g" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#eaf2fa" />
          <stop offset="1" stopColor="#ffb454" />
        </linearGradient>
      </defs>
      <g stroke="url(#bf-g)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16C9 9.5 14.5 7 21 8.5c3.5 1 5.5 3.5 7 7.5-1.5 4-3.5 6.5-7 7.5-6.5 1.5-12-1-17-7.5z" />
        <path d="M21 8.5L26 4l-1 6M21 23.5L26 28l-1-6" />
        <path d="M10 12.5c3.5 1.5 3.5 5.5 0 7M15 10.5c4.5 2 4.5 9 0 11" />
        <circle cx="23.5" cy="14.5" r="1.1" fill="url(#bf-g)" stroke="none" />
      </g>
    </svg>
  )
}
