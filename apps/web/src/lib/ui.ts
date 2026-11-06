import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info' | 'achievement';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface UiState {
  toasts: Toast[];
  levelUp: { level: number; title: string } | null;
  terminalTheme: string;
  soundEnabled: boolean;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
  showLevelUp: (level: number, title: string) => void;
  clearLevelUp: () => void;
  setTerminalTheme: (color: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

let nextToastId = 1;

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  levelUp: null,
  terminalTheme: '#38f2a0',
  soundEnabled: true,
  addToast: (toast) => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 5200);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  showLevelUp: (level, title) => set({ levelUp: { level, title } }),
  clearLevelUp: () => set({ levelUp: null }),
  setTerminalTheme: (color) => set({ terminalTheme: color }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled })
}));

export function playTone(kind: 'success' | 'error' | 'level' | 'achievement'): void {
  const state = useUiStore.getState();
  if (!state.soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioContextClass();
    const notes =
      kind === 'success'
        ? [523.25, 659.25]
        : kind === 'error'
          ? [196, 146.83]
          : kind === 'level'
            ? [523.25, 659.25, 783.99, 1046.5]
            : [659.25, 880];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'error' ? 'sawtooth' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01 + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16 + index * 0.09);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(context.currentTime + index * 0.09);
      oscillator.stop(context.currentTime + 0.2 + index * 0.09);
    });
    window.setTimeout(() => void context.close(), 900);
  } catch {
    // Áudio é um extra: falhas silenciosas não devem quebrar a experiência.
  }
}
