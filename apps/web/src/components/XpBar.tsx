import { motion } from 'framer-motion';

export function XpBar({
  percent,
  xpIntoLevel,
  xpToNextLevel,
  compact = false
}: {
  percent: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  compact?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
        <span>{compact ? `${xpIntoLevel} XP` : `${xpIntoLevel} / ${xpToNextLevel} XP`}</span>
        <span>{Math.min(100, Math.round(percent))}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg ring-1 ring-border">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accentDim via-accent to-cyber"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
