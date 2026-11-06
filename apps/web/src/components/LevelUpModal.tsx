import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { useUiStore } from '../lib/ui';
import { Mascot } from './Mascot';
import { playTone } from '../lib/ui';

export function LevelUpModal() {
  const levelUp = useUiStore((state) => state.levelUp);
  const clearLevelUp = useUiStore((state) => state.clearLevelUp);

  useEffect(() => {
    if (!levelUp) return;
    playTone('level');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#38f2a0', '#46b5ff', '#b98cff', '#ffcf5c']
    });
  }, [levelUp]);

  return (
    <AnimatePresence>
      {levelUp ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-bg/80 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clearLevelUp}
        >
          <motion.div
            className="card w-full max-w-sm p-8 text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Mascot size={130} mood="happy" className="mx-auto animate-float" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Novo nível</p>
            <h2 className="mt-2 text-3xl font-bold">Nível {levelUp.level}</h2>
            <p className="mt-1 text-muted">{levelUp.title}</p>
            <button className="btn-primary mt-6 w-full" onClick={clearLevelUp}>
              Continuar a jornada
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
