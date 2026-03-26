export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="none"
        height="24"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.7"
        width="24"
        x="4"
        y="6"
      />
      <path d="M10 4V9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M22 4V9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M5 12H27" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="9" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="15" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="21" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="9" y="22" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="15" y="22" />
    </svg>
  );
}
