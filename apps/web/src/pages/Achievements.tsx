import { useQuery } from '@tanstack/react-query';
import { Award, Lock } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { formatDate } from '../lib/format';
import { Loading, ErrorState } from '../components/Loading';

const rarityOrder = ['lendaria', 'epica', 'rara', 'comum'] as const;
const rarityLabel: Record<string, string> = {
  comum: 'Comuns',
  rara: 'Raras',
  epica: 'Épicas',
  lendaria: 'Lendárias'
};
const rarityStyle: Record<string, string> = {
  comum: 'border-border',
  rara: 'border-cyber/40',
  epica: 'border-purple/40',
  lendaria: 'border-warn/40'
};

export function Achievements() {
  const query = useQuery({ queryKey: ['achievements'], queryFn: api.achievements });
  if (query.isLoading) return <Loading label="Consultando troféus..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const achievements = query.data.achievements;
  const unlocked = achievements.filter((item) => item.unlockedAt).length;

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple">
              <Award size={14} /> Conquistas
            </p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">Troféus da jornada</h1>
            <p className="mt-1 text-sm text-muted">Marcos por consistência, domínio e coragem controlada.</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-accent">{unlocked}</p>
            <p className="text-xs text-muted">de {achievements.length} desbloqueadas</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
          <div className="h-full rounded-full bg-gradient-to-r from-purple to-accent" style={{ width: `${achievements.length ? (unlocked / achievements.length) * 100 : 0}%` }} />
        </div>
      </header>

      {rarityOrder.map((rarity) => {
        const group = achievements.filter((item) => item.rarity === rarity);
        if (group.length === 0) return null;
        return (
          <section key={rarity}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{rarityLabel[rarity]}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((achievement) => {
                const isUnlocked = Boolean(achievement.unlockedAt);
                return (
                  <div
                    key={achievement.slug}
                    className={`panel flex gap-3 p-4 transition ${
                      isUnlocked ? `${rarityStyle[rarity]} bg-panel` : 'opacity-60'
                    }`}
                  >
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-bg text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                      {isUnlocked ? achievement.icon : <Lock size={18} className="text-muted" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{achievement.title}</p>
                        <span className="text-[9px] uppercase tracking-wider text-muted">{achievement.rarity}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-muted">{achievement.description}</p>
                      {isUnlocked && achievement.unlockedAt ? (
                        <p className="mt-1 text-[10px] text-accent">Obtida em {formatDate(achievement.unlockedAt)}</p>
                      ) : (
                        <p className="mt-1 text-[10px] text-muted">Ainda bloqueada</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      {achievements.length === 0 ? (
        <div className="panel p-8 text-center text-sm text-muted">
          Nenhuma conquista cadastrada ainda. O catálogo é carregado a partir de content/achievements.yml.
        </div>
      ) : null}
    </div>
  );
}
