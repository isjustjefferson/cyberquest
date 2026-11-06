import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, CalendarDays, Flame, Settings, Snowflake, Zap } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatDate, formatNumber } from '../lib/format';
import { Mascot } from '../components/Mascot';
import { XpBar } from '../components/XpBar';

export function Profile() {
  const { user } = useAuth();
  const achievements = useQuery({ queryKey: ['achievements'], queryFn: api.achievements });
  if (!user) return null;
  const unlocked = achievements.data?.achievements.filter((item) => item.unlockedAt) ?? [];

  return (
    <div className="space-y-6">
      <header className="card overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-r from-accent/15 via-cyber/10 to-purple/15" />
        <div className="flex flex-wrap items-end gap-4 px-6 pb-6">
          <div className="-mt-10 grid h-24 w-24 place-items-center rounded-2xl border border-border bg-surface text-5xl shadow-card">
            <Mascot size={80} mood="happy" />
          </div>
          <div className="min-w-0 flex-1 pt-2">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-sm text-muted">@{user.username} · {user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="badge border-accent/30 text-accent">Nível {user.level} · {user.levelTitle}</span>
              <span className="badge">membro desde hoje</span>
            </div>
          </div>
          <Link to="/configuracoes" className="btn-secondary"><Settings size={15} /> Editar perfil</Link>
        </div>
        <div className="border-t border-border px-6 py-4">
          <XpBar percent={user.levelPercent} xpIntoLevel={user.xpIntoLevel} xpToNextLevel={user.xpToNextLevel} />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, label: 'XP total', value: formatNumber(user.xpTotal), color: 'text-warn' },
          { icon: BookOpen, label: 'Lições', value: formatNumber(user.lessonsCompleted), color: 'text-accent' },
          { icon: Flame, label: 'Streak', value: `${user.streakCurrent} dias`, color: 'text-danger' },
          { icon: Snowflake, label: 'Congelamentos', value: `${user.streakFreezes}`, color: 'text-cyber' }
        ].map((stat) => (
          <div key={stat.label} className="panel flex items-center gap-3 p-4">
            <stat.icon size={20} className={stat.color} />
            <div>
              <p className="text-xs text-muted">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><CalendarDays size={16} className="text-cyber" /> Conta</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3 border-b border-border/50 pb-2">
              <dt className="text-muted">Fuso horário</dt><dd>{user.timezone}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-border/50 pb-2">
              <dt className="text-muted">Streak recorde</dt><dd>{user.streakBest} dias</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-border/50 pb-2">
              <dt className="text-muted">Termo dos labs</dt>
              <dd>{user.acceptedLabTermsAt ? `aceito em ${formatDate(user.acceptedLabTermsAt)}` : 'ainda não aceito'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">XP semanal</dt><dd>{formatNumber(user.weeklyXp)} XP</dd>
            </div>
          </dl>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><Award size={16} className="text-purple" /> Conquistas recentes</h2>
            <Link to="/conquistas" className="text-xs text-muted hover:text-accent">Ver todas</Link>
          </div>
          {unlocked.length > 0 ? (
            <div className="mt-3 space-y-2">
              {unlocked.slice(-4).reverse().map((achievement) => (
                <div key={achievement.slug} className="flex items-center gap-2 rounded-lg border border-border bg-bg/40 p-2">
                  <span className="text-xl">{achievement.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{achievement.title}</p>
                    <p className="truncate text-[10px] text-muted">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-center">
              <Mascot size={72} mood="thinking" className="mx-auto" />
              <p className="mt-2 text-xs text-muted">Nenhuma conquista ainda. Continue praticando.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
