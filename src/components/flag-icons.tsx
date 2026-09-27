export function BrazilFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id="br-flag-clip">
          <rect width="21" height="15" rx="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#br-flag-clip)">
        <rect width="21" height="15" fill="#009B3A" />
        <path d="M10.5 2.15 18.35 7.5 10.5 12.85 2.65 7.5Z" fill="#FEDD00" />
        <circle cx="10.5" cy="7.5" r="2.55" fill="#002776" />
        <path
          d="M8.15 7.85c.85-.7 1.95-1.05 3.15-.95.55.05 1.05.2 1.5.4"
          fill="none"
          stroke="#fff"
          strokeWidth="0.45"
          strokeLinecap="round"
        />
        <circle cx="9.35" cy="6.85" r="0.28" fill="#fff" />
        <circle cx="11.15" cy="6.55" r="0.22" fill="#fff" />
        <circle cx="10.7" cy="8.15" r="0.2" fill="#fff" />
      </g>
    </svg>
  );
}

export function UnitedStatesFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id="us-flag-clip">
          <rect width="21" height="15" rx="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#us-flag-clip)">
        <rect width="21" height="15" fill="#B22234" />
        <path
          d="M0 2.31h21M0 4.62h21M0 6.92h21M0 9.23h21M0 11.54h21M0 13.85h21"
          stroke="#fff"
          strokeWidth="1.15"
        />
        <rect width="8.6" height="8.08" fill="#3C3B6E" />
        <g fill="#fff">
          <circle cx="1.35" cy="1.25" r="0.28" />
          <circle cx="3.05" cy="1.25" r="0.28" />
          <circle cx="4.75" cy="1.25" r="0.28" />
          <circle cx="6.45" cy="1.25" r="0.28" />
          <circle cx="2.2" cy="2.45" r="0.28" />
          <circle cx="3.9" cy="2.45" r="0.28" />
          <circle cx="5.6" cy="2.45" r="0.28" />
          <circle cx="1.35" cy="3.65" r="0.28" />
          <circle cx="3.05" cy="3.65" r="0.28" />
          <circle cx="4.75" cy="3.65" r="0.28" />
          <circle cx="6.45" cy="3.65" r="0.28" />
          <circle cx="2.2" cy="4.85" r="0.28" />
          <circle cx="3.9" cy="4.85" r="0.28" />
          <circle cx="5.6" cy="4.85" r="0.28" />
          <circle cx="1.35" cy="6.05" r="0.28" />
          <circle cx="3.05" cy="6.05" r="0.28" />
          <circle cx="4.75" cy="6.05" r="0.28" />
          <circle cx="6.45" cy="6.05" r="0.28" />
        </g>
      </g>
    </svg>
  );
}
