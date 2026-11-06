import { useId } from 'react';

type Mood = 'idle' | 'happy' | 'sad' | 'wink' | 'thinking';

export function Mascot({
  size = 120,
  mood = 'idle',
  className = ''
}: {
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const eye = mood === 'happy' ? 'M 38 55 Q 43 50 48 55' : 'M 40 54 Q 43 57 46 54';
  const eyeRight = mood === 'wink' ? 'M 62 56 L 70 56' : eye;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Byte, o gatinho mascote do CyberQuest"
      className={className}
    >
      <defs>
        <linearGradient id={`hood-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38f2a0" />
          <stop offset="100%" stopColor="#1d8f69" />
        </linearGradient>
        <linearGradient id={`fur-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7e5f5" />
          <stop offset="100%" stopColor="#9fb6cd" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="111" rx="34" ry="5" fill="#000" opacity="0.35" />
      <path
        d="M22 62 Q20 26 60 18 Q100 26 98 62 L92 92 Q76 100 60 100 Q44 100 28 92 Z"
        fill={`url(#hood-${id})`}
        opacity="0.92"
      />
      <path d="M22 62 Q20 26 60 18 Q100 26 98 62" fill="none" stroke="#0b3a2b" strokeWidth="3" />
      <ellipse cx="60" cy="69" rx="28" ry="24" fill={`url(#fur-${id})`} />
      <path d="M38 51 L42 34 L52 47 Z" fill={`url(#fur-${id})`} />
      <path d="M82 51 L78 34 L68 47 Z" fill={`url(#fur-${id})`} />
      <path d="M40 49 L43 39 L49 47 Z" fill="#f4a6bd" />
      <path d="M80 49 L77 39 L71 47 Z" fill="#f4a6bd" />
      <path d={eye} fill="none" stroke="#16222e" strokeWidth="4" strokeLinecap="round" />
      <path d={eyeRight} fill="none" stroke="#16222e" strokeWidth="4" strokeLinecap="round" />
      <path d="M57 69 Q60 72 63 69" fill="none" stroke="#16222e" strokeWidth="3" strokeLinecap="round" />
      {mood === 'sad' ? (
        <path d="M54 79 Q60 75 66 79" fill="none" stroke="#16222e" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M54 78 Q60 85 66 78" fill="none" stroke="#16222e" strokeWidth="3" strokeLinecap="round" />
      )}
      <path d="M44 68 L30 65 M44 72 L31 74 M76 68 L90 65 M76 72 L89 74" stroke="#5c7288" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="78" r="3" fill="#f4a6bd" opacity="0.5" />
      <circle cx="72" cy="78" r="3" fill="#f4a6bd" opacity="0.5" />
      <rect x="50" y="94" width="20" height="14" rx="3" fill="#0a0f15" stroke="#38f2a0" strokeWidth="1.5" />
      <text x="60" y="104" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#38f2a0">
        {mood === 'happy' ? ':D' : mood === 'sad' ? ':/' : '>_'}
      </text>
    </svg>
  );
}
