export const LogoMark = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="#6D3BFF" stroke="#141414" strokeWidth="3" />
    <path d="M10 27V14l5 7 5-7 5 7 5-7v13" stroke="#FFF8EC" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="31" cy="9" r="5" fill="#FFD23F" stroke="#141414" strokeWidth="2.5" />
  </svg>
);

export const Logo = () => (
  <a href="#topo" data-testid="header-logo" className="flex items-center gap-2.5 group">
    <LogoMark className="transition-transform duration-500 group-hover:rotate-[-12deg]" />
    <span className="font-display text-xl font-extrabold tracking-tight">
      Myg<span className="text-[var(--violet)]">.</span>Reviews
    </span>
  </a>
);
