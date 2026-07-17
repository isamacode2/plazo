export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="9.5" height="9.5" rx="2.5" fill="currentColor" />
      <rect x="12.5" y="2" width="9.5" height="9.5" rx="2.5" fill="currentColor" opacity="0.55" />
      <rect x="2" y="12.5" width="9.5" height="9.5" rx="2.5" fill="currentColor" opacity="0.55" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="2.5" fill="currentColor" />
    </svg>
  );
}
