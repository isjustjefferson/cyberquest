import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Compass, Lock, Sparkles } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { ErrorState, Loading } from '../components/Loading';
import { formatNumber } from '../lib/format';

export function TracksRedirect() {
  const query = useQuery({ queryKey: ['areas'], queryFn: api.areas });
  if (query.isLoading) return <Loading label="Redirecionando trilhas..." />;
  const active = query.data?.areas.filter((area) => area.status === 'active') ?? [];
  if (active.length === 1) return <Navigate to={`/areas/${active[0].slug}`} replace />;
  return <Navigate to="/areas" replace />;
}

export function Areas() {
  const query = useQuery({ queryKey: ['areas'], queryFn: api.areas });
  if (query.isLoading) return <Loading label="Carregando áreas..." />;
  if (query.isError || !query.data) {
    return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  }
  const areas = query.data.areas;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Compass size={14} /> Áreas de conhecimento
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Escolha sua próxima especialidade</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Cada área tem sua própria jornada, progresso e XP. Você pode avançar em segurança ofensiva e dados em paralelo.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {areas.map((area) => {
          const comingSoon = area.status === 'coming_soon';
          const content = (
            <div className={`card group relative h-full overflow-hidden p-5 transition ${comingSoon ? 'opacity-75' : 'hover:-translate-y-0.5 hover:border-accent/40'}`}>
              <div className="flex items-start gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-bg text-3xl ring-1 ring-border"
                  style={{ color: area.color }}
                >
                  {comingSoon ? <Lock size={22} className="text-muted" /> : area.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold group-hover:text-accent">{area.title}</h2>
                    <span className={`badge ${comingSoon ? 'text-warn' : 'text-muted'}`}>
                      {comingSoon ? 'Em breve' : `${area.completedLessons}/${area.totalLessons} lições`}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{area.description}</p>
                  {!comingSoon ? (
                    <>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
                        <span>{area.percent}% concluído</span>
                        <span>{formatNumber(area.xp)} XP na área</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${area.percent}%` }}
                        />
                      </div>
                      {area.nextLesson ? (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-accent">
                          <Sparkles size={12} /> {area.nextLesson.title}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-4 text-xs text-muted">Conteúdo em produção. Em breve novos caminhos por aqui.</p>
                  )}
                </div>
              </div>
              {!comingSoon ? (
                <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-muted transition group-hover:translate-x-1 group-hover:text-accent xl:block">
                  <ArrowRight size={18} />
                </span>
              ) : null}
            </div>
          );
          return comingSoon ? (
            <div key={area.slug} className="cursor-not-allowed">
              {content}
            </div>
          ) : (
            <Link key={area.slug} to={`/areas/${area.slug}`}>
              {content}
            </Link>
          );
        })}
      </div>

      {areas.length === 0 ? (
        <div className="panel p-8 text-center text-sm text-muted">
          Nenhuma área cadastrada. Rode o seed para carregar as áreas de conteúdo.
        </div>
      ) : null}
    </div>
  );
}
