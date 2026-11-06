import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Crown, Flame, Medal, Trophy } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatNumber } from '../lib/format';
import { Loading, ErrorState } from '../components/Loading';
import { Mascot } from '../components/Mascot';

export function Ranking() {
  const [tab, setTab] = useState<'weekly' | 'all-time'>('weekly');
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['leaderboard', tab], queryFn: () => api.leaderboard(tab) });
  const entries = query.data?.leaderboard ?? [];
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-warn">
            <Crown size={14} /> Ranking
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Quem está dominando o terminal?</h1>
          <p className="mt-1 text-sm text-muted">XP da semana zera toda segunda. O histórico fica no ranking geral.</p>
        </div>
        <div className="flex rounded-lg border border-border bg-panel p-1">
          {[
            { id: 'weekly' as const, label: 'Semanal', icon: Flame },
            { id: 'all-time' as const, label: 'Geral', icon: Trophy }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === item.id ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              <item.icon size={13} /> {item.label}
            </button>
          ))}
        </div>
      </header>

      {query.isLoading ? <Loading label="Calculando posições..." /> : null}
      {query.isError ? <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} /> : null}

      {!query.isLoading && !query.isError ? (
        <>
          {podium.length > 0 ? (
            <section className="grid gap-3 sm:grid-cols-3">
              {[podium[1], podium[0], podium[2]].filter(Boolean).map((entry, idx) => {
                const place = entry.position;
                const colors = place === 1 ? 'border-warn/50 bg-warn/5' : place === 2 ? 'border-muted/40' : 'border-[#b07a4a]/40';
                return (
                  <div key={entry.userId} className={`card flex flex-col items-center p-5 text-center ${colors} ${place === 1 ? 'sm:-mt-3' : ''}`}>
                    <span className={`grid h-10 w-10 place-items-center rounded-full border font-bold ${
                      place === 1 ? 'border-warn/50 text-warn' : place === 2 ? 'border-muted/40 text-muted' : 'border-[#b07a4a]/50 text-[#b07a4a]'
                    }`}>
                      {place === 1 ? <Crown size={19} /> : place === 2 ? <Medal size={18} /> : <Medal size={18} />}
                    </span>
                    <Mascot size={68} className="mt-2" />
                    <p className="mt-1 font-semibold">{entry.displayName}</p>
                    <p className="text-[11px] text-muted">@{entry.username} · Nv. {entry.level}</p>
                    <p className="mt-2 font-mono text-sm font-bold text-accent">{formatNumber(entry.xp)} XP</p>
                    {user?.username === entry.username ? <span className="mt-1 text-[10px] text-accent">você</span> : null}
                    <span className="sr-only">{idx}</span>
                  </div>
                );
              })}
            </section>
          ) : null}

          <section className="card overflow-hidden">
            <div className="grid grid-cols-[3rem_1fr_auto] gap-3 border-b border-border bg-panel/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              <span>#</span>
              <span>Jogador</span>
              <span>XP</span>
            </div>
            {rest.length === 0 && podium.length === 0 ? (
              <div className="p-8 text-center">
                <Mascot size={80} mood="thinking" className="mx-auto" />
                <p className="mt-2 text-sm text-muted">Ranking vazio. Complete uma lição para entrar na disputa.</p>
              </div>
            ) : null}
            {rest.map((entry) => (
              <div
                key={entry.userId}
                className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-border/50 px-4 py-2.5 text-sm last:border-0 ${
                  user?.username === entry.username ? 'bg-accent/5' : ''
                }`}
              >
                <span className="text-center font-mono text-xs text-muted">{entry.position}</span>
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-panel"><Mascot size={24} /></div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{entry.displayName}{user?.username === entry.username ? <span className="ml-2 text-[10px] text-accent">você</span> : null}</p>
                    <p className="text-[10px] text-muted">@{entry.username} · Nv. {entry.level}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-accent">{formatNumber(entry.xp)} XP</span>
              </div>
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}
