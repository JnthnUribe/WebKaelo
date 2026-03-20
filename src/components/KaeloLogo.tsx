export default function KaeloLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kaeloGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="100" fill="#1e293b"/>
      <path d="M256 420 C256 420 150 290 150 210 C150 152 198 100 256 100 C314 100 362 152 362 210 C362 290 256 420 256 420Z" fill="url(#kaeloGrad)"/>
      <circle cx="256" cy="210" r="70" fill="none" stroke="white" strokeWidth="12"/>
      <circle cx="256" cy="210" r="12" fill="white"/>
      <line x1="256" y1="150" x2="256" y2="190" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <line x1="256" y1="230" x2="256" y2="270" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <line x1="196" y1="210" x2="236" y2="210" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <line x1="276" y1="210" x2="316" y2="210" stroke="white" strokeWidth="8" strokeLinecap="round"/>
    </svg>
  );
}
