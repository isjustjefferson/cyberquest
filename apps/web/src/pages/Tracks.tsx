import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Lock, Map, Search } from 'lucide-react';
import { useState } from 'react';
import { api, errorMessage } from '../lib/api';
import { Loading, ErrorState } from '../components/Loading';

export function Tracks() {
  const [search, setSearch] = useState('');
  const query = useQuery({ queryKey: ['tracks'], queryFn: api.tracks });
  if (query.isLoading) return <Loading label="Carregando trilhas..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const filtered = query.data.tracks.filter((track) =>
    `${track.title} ${track.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Map size={14} /> Mapa de aprendizado
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Trilhas</h1>
          <p className="mt-1 text-sm text-muted">Onze caminhos, do primeiro comando ao red team. Avance no seu ritmo.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
          <input
            className="input pl-9"
            placeholder="Buscar trilha..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((track) => (
          <Link
            key={track.slug}
            to={track.status === 'coming_soon' ? '#' : `/trilhas/${track.slug}`}
            onClick={(event) => {
              if (track.status === 'coming_soon') event.preventDefault();
            }}
            className={`card group relative overflow-hidden p-5 transition ${
              track.status === 'coming_soon' ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-0.5 hover:border-accent/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-bg text-3xl ring-1 ring-border">
                {track.status === 'coming_soon' ? <Lock size={22} className="text-muted" /> : track.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold group-hover:text-accent">{track.title}</h2>
                  <span className={`badge ${track.status === 'coming_soon' ? 'text-warn' : 'text-muted'}`}>
                    {track.status === 'coming_soon' ? 'Em breve' : `${track.completedLessons}/${track.totalLessons} lições`}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{track.description}</p>
                {track.status !== 'coming_soon' ? (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-[11px] text-muted">
                      <span>{track.percent}% concluído</span>
                      <span>{track.totalLessons} lições</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${track.percent}%` }} />
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted">Conteúdo em produção. As lições anteriores já preparam o caminho.</p>
                )}
              </div>
            </div>
            {track.status !== 'coming_soon' ? (
              <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-muted transition group-hover:translate-x-1 group-hover:text-accent xl:block">
                <ArrowRight size={18} />
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="panel p-8 text-center text-sm text-muted">Nenhuma trilha encontrada para “{search}”.</div>
      ) : null}
    </div>
  );
}
