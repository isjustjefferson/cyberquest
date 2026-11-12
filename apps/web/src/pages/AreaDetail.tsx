import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { ErrorState, Loading } from '../components/Loading';
import { formatNumber } from '../lib/format';

export function AreaDetail() {
  const { slug = '' } = useParams();
  const query = useQuery({ queryKey: ['area', slug], queryFn: () => api.area(slug) });
  if (query.isLoading) return <Loading label="Abrindo área..." />;
  if (query.isError || !query.data) {
    return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  }
  const area = query.data.area;
  const comingSoon = area.status === 'coming_soon';

  return (
    <div className="space-y-6">
      <Link to="/areas" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Todas as áreas
      </Link>

      <header className="card relative overflow-hidden p-6">
        <div className="absolute -right-16 -top-20 text-[200px] opacity-[0.04]" style={{ color: area.color }}>
          {area.icon}
        </div>
        <div className="relative flex flex-wrap items-start gap-5">
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl bg-bg text-4xl ring-1 ring-border"
            style={{ color: area.color }}
          >
            {comingSoon ? <Lock size={26} className="text-muted" /> : area.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{area.title}</h1>
              {comingSoon ? <span className="badge text-warn">Em breve</span> : null}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{area.description}</p>
            {!comingSoon ? (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="badge">{area.totalLessons} lições</span>
                <span className="badge text-accent">{area.completedLessons} concluídas</span>
                <span className="badge text-cyber">{formatNumber(area.xp)} XP</span>
              </div>
            ) : null}
          </div>
          {!comingSoon && area.nextLesson ? (
            <Link to={`/licoes/${area.nextLesson.slug}`} className="btn-primary shrink-0">
              {area.nextLesson.status === 'in_progress' ? 'Continuar' : 'Começar'}
              <ArrowRight size={15} />
            </Link>
          ) : null}
        </div>
        {!comingSoon ? (
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accentDim to-accent"
              style={{ width: `${area.percent}%` }}
            />
          </div>
        ) : null}
      </header>

      {area.nextLesson ? (
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={13} /> Próxima parada
            </p>
            <p className="mt-1 text-sm font-medium">{area.nextLesson.title}</p>
            <p className="text-xs text-muted">
              {area.nextLesson.trackTitle} · {area.nextLesson.moduleTitle}
            </p>
          </div>
          <Link to={`/licoes/${area.nextLesson.slug}`} className="btn-secondary">
            Abrir lição <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {area.tracks.map((track) => {
          const trackComingSoon = track.status === 'coming_soon' || comingSoon;
          const content = (
            <div
              className={`card group relative h-full overflow-hidden p-5 transition ${
                trackComingSoon ? 'opacity-70' : 'hover:-translate-y-0.5 hover:border-accent/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-bg text-3xl ring-1 ring-border">
                  {trackComingSoon ? <Lock size={22} className="text-muted" /> : track.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold group-hover:text-accent">{track.title}</h2>
                    <span className={`badge ${trackComingSoon ? 'text-warn' : 'text-muted'}`}>
                      {trackComingSoon ? 'Em breve' : `${track.completedLessons}/${track.totalLessons} lições`}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{track.description}</p>
                  {!trackComingSoon ? (
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-[11px] text-muted">
                        <span>{track.percent}% concluído</span>
                        <span>{track.totalLessons} lições</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${track.percent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-muted">Conteúdo em produção.</p>
                  )}
                </div>
              </div>
            </div>
          );
          return trackComingSoon ? (
            <div key={track.slug} className="cursor-not-allowed">
              {content}
            </div>
          ) : (
            <Link key={track.slug} to={`/trilhas/${track.slug}`}>
              {content}
            </Link>
          );
        })}
      </div>

      {area.tracks.length === 0 ? (
        <div className="panel p-8 text-center text-sm text-muted">
          Esta área ainda não tem trilhas publicadas. O conteúdo está sendo preparado.
        </div>
      ) : null}
    </div>
  );
}
