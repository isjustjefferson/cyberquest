export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value)
  );
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export const difficultyLabel = ['', 'Iniciante', 'Fácil', 'Médio', 'Difícil', 'Insano'];

export const rarityLabel: Record<string, string> = {
  comum: 'Comum',
  rara: 'Rara',
  epica: 'Épica',
  lendaria: 'Lendária'
};

export const kindLabel: Record<string, string> = {
  lesson: 'Lição',
  lab: 'Lab',
  boss: 'Chefe'
};
