import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Award,
  BookOpen,
  Crown,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatNumber } from '../lib/format';
import { Mascot } from '../components/Mascot';
import { XpBar } from '../components/XpBar';
import { Loading, ErrorState } from '../components/Loading';

const rarityStyle: Record<string, string> = {
  comum: 'text-muted border-border',
  rara: 'text-cyber border-cyber/40',
  epica: 'text-purple border-purple/40',
  lendaria: 'text-warn border-warn/40'
};

export function Dashboard() {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard });
  if (query.isLoading) return <Loading label="Montando seu painel..." />;
  if (query.isError || !query.data) {
    return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  }
  const data = query.data;
  const stats = data.stats;
  const next = data.continueLesson;

  return (
    <div className="space-y-6">
      <section className="card relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-10 -top-14 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <Mascot size={116} mood="happy" className="shrink-0 animate-float" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {stats.streakCurrent > 0 ? `🔥 Streak de ${stats.streakCurrent} dias` : 'Pronto para começar?'}
            </p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              Bom te ver, {stats.displayName.split(' ')[0]}.
            </h1>
            <p className="mt-1 text-sm text-muted">
              {next
                ? `Próxima parada: ${next.title} · ${next.moduleTitle}`
                : 'Escolha uma trilha para iniciar sua jornada.'}
            </p>
            <div className="mt-4 max-w-md">
              <XpBar
                percent={stats.levelPercent}
                xpIntoLevel={stats.xpIntoLevel}
                xpToNextLevel={stats.xpToNextLevel}
              />
              <p className="mt-1 text-[11px] text-muted">
                Nível {stats.level} · {stats.levelTitle} · {formatNumber(stats.xpTotal)} XP totais
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {next ? (
              <Link to={`/licoes/${next.slug}`} className="btn-primary px-5 py-3">
                {next.status === 'in_progress' ? 'Continuar lição' : 'Começar agora'} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/trilhas" className="btn-primary px-5 py-3">
                Explorar trilhas <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, label: 'Bits', value: formatNumber(stats.bits), color: 'text-warn', hint: 'moeda da loja' },
          { icon: Flame, label: 'Streak atual', value: `${stats.streakCurrent} dias`, color: 'text-danger', hint: `recorde: ${stats.streakBest}` },
          { icon: BookOpen, label: 'Lições concluídas', value: formatNumber(stats.lessonsCompleted), color: 'text-accent', hint: 'no total' },
          { icon: Trophy, label: 'XP na semana', value: formatNumber(stats.weeklyXp), color: 'text-cyber', hint: 'ranking semanal' }
        ].map((card) => (
          <div key={card.label} className="panel flex items-center gap-3 p-4">
            <div className={`grid h-10 w-10 place-items-center rounded-lg bg-bg ${card.color}`}>
              <card.icon size={19} />
            </div>
            <div>
              <p className="text-xs text-muted">{card.label}</p>
              <p className="text-lg font-bold">{card.value}</p>
              <p className="text-[10px] text-muted">{card.hint}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-semibold">
              <Target size={17} className="text-accent" /> Desafio diário
            </h2>
            <span className="badge border-warn/30 text-warn">+{data.dailyChallenge.bonusXp} XP bônus</span>
          </div>
          {data.dailyChallenge.exercise ? (
            <div className="mt-4">
              <p className="text-sm text-text/90">
                {String(data.dailyChallenge.exercise.payload.question ?? data.dailyChallenge.exercise.payload.statement ?? 'Resolva o exercício do dia.')}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="badge">{data.dailyChallenge.exercise.type.replace('_', ' ')}</span>
                <span className="badge">+{data.dailyChallenge.exercise.xp} XP</span>
                {data.dailyChallenge.answered ? (
                  <span className="badge border-accent/30 text-accent">Respondido hoje</span>
                ) : null}
              </div>
              <Link to="/desafio" className="btn-primary mt-5">
                {data.dailyChallenge.answered ? 'Rever desafio' : 'Resolver agora'} <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">O desafio de hoje aparece assim que houver exercícios cadastrados.</p>
          )}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <RotateCcw size={17} className="text-cyber" /> Revisão espaçada
          </h2>
          <p className="mt-3 text-3xl font-bold">{data.dueCount}</p>
          <p className="text-sm text-muted">
            {data.dueCount === 1 ? 'exercício esperando revisão' : 'exercícios esperando revisão'}
          </p>
          <p className="mt-3 text-xs leading-5 text-muted">
            Revisar fortalece a memória de longo prazo. O sistema SM-2 agenda cada exercício no melhor momento.
          </p>
          <Link to="/revisao" className="btn-secondary mt-4 w-full">
            Revisar agora <ArrowRight size={14} />
          </Link>
        </section>

        <section className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <Crown size={17} className="text-warn" /> Ranking semanal
            </h2>
            <Link to="/ranking" className="text-xs text-muted hover:text-accent">Ver tudo</Link>
          </div>
          {data.weeklyLeaderboard.length > 0 ? (
            <div className="mt-3 divide-y divide-border/60">
              {data.weeklyLeaderboard.map((entry) => (
                <div key={entry.userId} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className={`w-6 text-center font-mono font-bold ${entry.position === 1 ? 'text-warn' : entry.position === 2 ? 'text-muted' : entry.position === 3 ? 'text-[#b07a4a]' : 'text-muted'}`}>
                    {entry.position}
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-panel text-lg">
                    <Mascot size={28} />
                  </div>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {entry.displayName}
                    {entry.username === stats.username ? <span className="ml-2 text-[10px] text-accent">você</span> : null}
                  </span>
                  <span className="text-xs text-muted">Nv. {entry.level}</span>
                  <span className="font-mono text-xs text-accent">{formatNumber(entry.xp)} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Ninguém pontuou nesta semana ainda. Você pode ser o primeiro.</p>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <Award size={17} className="text-purple" /> Conquistas
            </h2>
            <Link to="/conquistas" className="text-xs text-muted hover:text-accent">Ver todas</Link>
          </div>
          {data.recentAchievements.length > 0 ? (
            <div className="mt-3 space-y-2">
              {data.recentAchievements.map((achievement) => (
                <div key={achievement.slug} className={`rounded-lg border px-3 py-2 ${rarityStyle[achievement.rarity] ?? ''}`}>
                  <p className="text-sm font-semibold">{achievement.icon} {achievement.title}</p>
                  <p className="text-[11px] text-muted">{achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center">
              <Mascot size={64} mood="thinking" className="mx-auto" />
              <p className="mt-2 text-xs text-muted">Sua primeira conquista está a uma lição de distância.</p>
            </div>
          )}
          <div className="mt-4 rounded-lg border border-border bg-bg/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Sparkles size={13} /> Dica do Byte
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted">
              Não pule os fundamentos de terminal. Eles aparecem em quase todo lab e economizam horas de sofrimento.
            </p>
          </div>
        </section>
      </div>

      {user ? (
        <p className="text-center text-[11px] text-muted">
          Sessão de {user.username} · {user.email} · fuso {user.timezone}
        </p>
      ) : null}
    </div>
  );
}
