import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Clock, FlaskConical, Lock, Skull, Star, Zap } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { difficultyLabel, kindLabel } from '../lib/format';
import { Loading, ErrorState } from '../components/Loading';

const statusStyle: Record<string, string> = {
  completed: 'border-accent/60 bg-accent/15 text-accent',
  in_progress: 'border-cyber/60 bg-cyber/15 text-cyber',
  available: 'border-border bg-panel text-text hover:border-accent/60',
  locked: 'border-border/60 bg-bg/50 text-muted'
};

export function TrackDetail() {
  const { slug = '' } = useParams();
  const query = useQuery({ queryKey: ['track', slug], queryFn: () => api.track(slug) });
  if (query.isLoading) return <Loading label="Abrindo trilha..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const track = query.data.track;

  return (
    <div className="space-y-6">
      <Link to="/trilhas" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Todas as trilhas
      </Link>

      <header className="card relative overflow-hidden p-6">
        <div className="absolute -right-16 -top-20 text-[200px] opacity-[0.04]">{track.icon}</div>
        <div className="relative flex flex-wrap items-start gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-bg text-4xl ring-1 ring-border">{track.icon}</div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold md:text-3xl">{track.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{track.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="badge">{track.totalLessons} lições</span>
              <span className="badge text-accent">{track.completedLessons} concluídas</span>
              <span className="badge text-cyber">{track.percent}% do caminho</span>
            </div>
          </div>
        </div>
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-bg">
          <div className="h-full rounded-full bg-gradient-to-r from-accentDim to-accent" style={{ width: `${track.percent}%` }} />
        </div>
      </header>

      <div className="space-y-5">
        {track.modules.map((module) => (
          <section key={module.id} className="panel p-4 md:p-5">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Módulo {module.position}</p>
                <h2 className="font-semibold">{module.title}</h2>
                {module.description ? <p className="mt-0.5 text-xs text-muted">{module.description}</p> : null}
              </div>
              <span className="badge">
                {module.lessons.filter((lesson) => lesson.progressStatus === 'completed').length}/{module.lessons.length}
              </span>
            </header>
            <div className="grid gap-2 sm:grid-cols-2">
              {module.lessons.map((lesson) => {
                const locked = lesson.progressStatus === 'locked';
                const content = (
                  <div
                    className={`flex h-full items-start gap-3 rounded-xl border p-3 transition ${
                      statusStyle[lesson.progressStatus] ?? statusStyle.available
                    }`}
                  >
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current/30 bg-bg/40">
                      {lesson.progressStatus === 'completed' ? (
                        <Check size={15} />
                      ) : locked ? (
                        <Lock size={13} />
                      ) : lesson.kind === 'boss' ? (
                        <Skull size={15} />
                      ) : lesson.kind === 'lab' ? (
                        <FlaskConical size={14} />
                      ) : (
                        <span className="font-mono text-[10px]">{lesson.id}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-5">{lesson.title}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
                        <span>{kindLabel[lesson.kind] ?? lesson.kind}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {lesson.estMinutes} min</span>
                        <span className="flex items-center gap-1"><Zap size={10} /> {lesson.xp} XP</span>
                        <span>Nível {difficultyLabel[lesson.difficulty]}</span>
                        {lesson.status === 'draft' ? <span className="text-warn">em expansão</span> : null}
                      </div>
                    </div>
                    {lesson.stars > 0 ? (
                      <span className="flex shrink-0 gap-0.5 text-warn">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Star key={idx} size={11} fill={idx < lesson.stars ? 'currentColor' : 'none'} />
                        ))}
                      </span>
                    ) : null}
                  </div>
                );
                return locked ? (
                  <div key={lesson.id} className="cursor-not-allowed" title="Conclua as lições anteriores para desbloquear">
                    {content}
                  </div>
                ) : (
                  <Link key={lesson.id} to={`/licoes/${lesson.slug}`}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
