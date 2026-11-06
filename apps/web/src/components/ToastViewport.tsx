import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Trophy, X, XCircle } from 'lucide-react';
import { useUiStore } from '../lib/ui';
import { playTone } from '../lib/ui';
import { useEffect } from 'react';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  achievement: Trophy
};

const styles = {
  success: 'border-accent/40 text-accent',
  error: 'border-danger/40 text-danger',
  info: 'border-cyber/40 text-cyber',
  achievement: 'border-warn/40 text-warn'
};

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  useEffect(() => {
    const last = toasts[toasts.length - 1];
    if (!last) return;
    if (last.tone === 'success') playTone('success');
    if (last.tone === 'error') playTone('error');
    if (last.tone === 'achievement') playTone('achievement');
  }, [toasts]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface/95 p-3 shadow-card backdrop-blur ${styles[toast.tone]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 text-xs text-muted">{toast.description}</p> : null}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted transition hover:text-text"
                aria-label="Fechar notificação"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
