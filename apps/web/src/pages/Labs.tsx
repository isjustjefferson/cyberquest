import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight, Clock, FlaskConical, Server, Zap } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { difficultyLabel } from '../lib/format';
import { Loading, ErrorState } from '../components/Loading';

export function Labs() {
  const query = useQuery({ queryKey: ['labs'], queryFn: api.labs });
  if (query.isLoading) return <Loading label="Verificando o Docker e os labs..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const { labs, dockerAvailable } = query.data;

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyber">
          <FlaskConical size={14} /> Laboratórios
        </p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Pratique em alvos descartáveis</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Cada lab sobe containers isolados por tempo limitado. Ataque apenas o alvo da sessão, encontre as flags e
          valide aqui. Ao terminar, leia a correção e o writeup.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="badge border-accent/30 text-accent"><Server size={12} /> rede isolada</span>
          <span className="badge border-cyber/30 text-cyber">TTL configurável</span>
          <span className="badge border-warn/30 text-warn">flags por sessão</span>
        </div>
      </header>

      {!dockerAvailable ? (
        <div className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn/5 p-4 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warn" />
          <div>
            <p className="font-semibold text-warn">Docker indisponível</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Instale e inicie o Docker (ou Docker Desktop com integração WSL2) para rodar os labs. Todo o restante da
              plataforma — trilhas, exercícios e revisão — continua funcionando.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <Link
            key={lab.slug}
            to={`/labs/${lab.slug}`}
            className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-cyber/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyber/10 text-cyber ring-1 ring-cyber/25">
                <FlaskConical size={22} />
              </div>
              <span className="badge">Nível {difficultyLabel[lab.difficulty] ?? lab.difficulty}</span>
            </div>
            <h2 className="mt-3 font-semibold group-hover:text-cyber">{lab.title}</h2>
            <p className="mt-1 flex-1 text-sm leading-6 text-muted">{lab.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
              <span className="flex items-center gap-1"><Clock size={11} /> {lab.ttlMinutes} min</span>
              <span className="flex items-center gap-1 text-warn"><Zap size={11} /> +{lab.xpReward} XP</span>
              <span className="ml-auto flex items-center gap-1 text-cyber">Abrir lab <ArrowRight size={12} className="transition group-hover:translate-x-0.5" /></span>
            </div>
          </Link>
        ))}
        {labs.length === 0 ? (
          <div className="panel p-8 text-center text-sm text-muted md:col-span-2">
            Nenhum laboratório cadastrado ainda. Rode o seed e verifique a pasta labs/manifests.
          </div>
        ) : null}
      </div>

      <div className="panel border-danger/20 bg-danger/5 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-danger"><AlertTriangle size={15} /> Escopo e ética</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Os alvos são fictícios e pertencem à plataforma. Não use as técnicas aprendidas contra sistemas de terceiros.
          Acesso não autorizado é crime, independentemente da intenção.
        </p>
      </div>
    </div>
  );
}
