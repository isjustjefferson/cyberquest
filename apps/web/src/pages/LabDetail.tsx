import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  KeyRound,
  Lightbulb,
  Loader2,
  Play,
  ShieldCheck,
  Square,
  Timer,
  Zap
} from 'lucide-react';
import type { LabObjectivePublic, LabSessionPublic } from '@cyberquest/shared';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatClock, difficultyLabel } from '../lib/format';
import { useUiStore } from '../lib/ui';
import { LabTerminal } from '../components/LabTerminal';
import { Loading, ErrorState } from '../components/Loading';
import { Markdown } from '../components/Markdown';
import { Mascot } from '../components/Mascot';

function useCountdown(expiresAt: string | undefined): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  if (!expiresAt) return 0;
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
}

export function LabDetail() {
  const { slug = '' } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const addToast = useUiStore((state) => state.addToast);
  const [session, setSession] = useState<LabSessionPublic | null>(null);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [extending, setExtending] = useState(false);
  const [flags, setFlags] = useState<Record<string, string>>({});
  const [flagBusy, setFlagBusy] = useState<string | null>(null);
  const [flagFeedback, setFlagFeedback] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [hintBusy, setHintBusy] = useState<string | null>(null);

  const query = useQuery({ queryKey: ['lab', slug], queryFn: () => api.lab(slug) });
  const lab = query.data?.lab;
  const seconds = useCountdown(session?.status === 'running' ? session.expiresAt : undefined);

  useEffect(() => {
    if (lab?.activeSession) setSession(lab.activeSession);
  }, [lab?.activeSession]);

  const sessionId = session?.id;
  const sessionStatus = session?.status;

  useEffect(() => {
    if (!sessionId || !sessionStatus || sessionStatus === 'stopped' || sessionStatus === 'expired') return;
    if (sessionStatus !== 'running' && sessionStatus !== 'starting') return;
    const timer = window.setInterval(async () => {
      try {
        const data = await api.labSession(sessionId);
        setSession(data.session);
        if (data.session.status === 'expired') {
          addToast({ tone: 'info', title: 'Tempo do lab esgotado', description: 'Encerre a sessão e inicie outra quando quiser.' });
          void queryClient.invalidateQueries({ queryKey: ['lab', slug] });
        }
      } catch {
        // mantém a última sessão conhecida
      }
    }, 12_000);
    return () => window.clearInterval(timer);
  }, [sessionId, sessionStatus, slug, queryClient, addToast]);

  const completed = useMemo(() => lab?.objectives.filter((objective) => objective.completed).length ?? 0, [lab]);
  const allDone = Boolean(lab && lab.objectives.length > 0 && completed >= lab.objectives.length);

  async function acceptTerms() {
    setAccepting(true);
    try {
      await api.acceptLabTerms();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lab', slug] }),
        queryClient.invalidateQueries({ queryKey: ['me'] })
      ]);
      addToast({ tone: 'success', title: 'Termo aceito', description: 'Agora você pode iniciar os laboratórios.' });
    } catch (error) {
      addToast({ tone: 'error', title: 'Não foi possível aceitar', description: errorMessage(error) });
    } finally {
      setAccepting(false);
    }
  }

  async function start() {
    setStarting(true);
    try {
      const data = await api.startLab(slug);
      setSession(data.session);
      setFlagFeedback({});
      await queryClient.invalidateQueries({ queryKey: ['lab', slug] });
      addToast({ tone: 'success', title: 'Lab iniciado', description: 'Os containers estão no ar. Use o terminal.' });
    } catch (error) {
      addToast({ tone: 'error', title: 'Falha ao iniciar o lab', description: errorMessage(error) });
    } finally {
      setStarting(false);
    }
  }

  async function stop() {
    if (!session) return;
    if (!window.confirm('Encerrar a sessão? Os containers e o progresso não salvo serão descartados.')) return;
    setStopping(true);
    try {
      await api.stopLab(session.id);
      setSession(null);
      await queryClient.invalidateQueries({ queryKey: ['lab', slug] });
      addToast({ tone: 'info', title: 'Sessão encerrada' });
    } catch (error) {
      addToast({ tone: 'error', title: 'Falha ao encerrar', description: errorMessage(error) });
    } finally {
      setStopping(false);
    }
  }

  async function extend() {
    if (!session) return;
    setExtending(true);
    try {
      const data = await api.extendLab(session.id);
      setSession(data.session);
      addToast({ tone: 'success', title: 'Sessão estendida', description: 'Você ganhou mais tempo neste lab.' });
    } catch (error) {
      addToast({ tone: 'error', title: 'Não foi possível estender', description: errorMessage(error) });
    } finally {
      setExtending(false);
    }
  }

  async function submitFlag(objective: LabObjectivePublic) {
    if (!session || !flags[objective.id]?.trim()) return;
    setFlagBusy(objective.id);
    try {
      const result = await api.submitFlag(session.id, objective.id, flags[objective.id]!);
      setFlagFeedback((prev) => ({
        ...prev,
        [objective.id]: {
          ok: true,
          text: result.alreadyCompleted ? 'Flag já validada anteriormente.' : `Flag correta! +${result.xpGained} XP`
        }
      }));
      addToast({
        tone: 'success',
        title: result.alreadyCompleted ? 'Objetivo já concluído' : `Objetivo validado! +${result.xpGained} XP`,
        description: result.labCompleted ? 'Laboratório completo! O writeup foi liberado.' : undefined
      });
      setFlags((prev) => ({ ...prev, [objective.id]: '' }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lab', slug] }),
        queryClient.invalidateQueries({ queryKey: ['me'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
    } catch (error) {
      setFlagFeedback((prev) => ({ ...prev, [objective.id]: { ok: false, text: errorMessage(error) } }));
      addToast({ tone: 'error', title: 'Flag inválida', description: errorMessage(error) });
    } finally {
      setFlagBusy(null);
    }
  }

  async function buyHint(objective: LabObjectivePublic) {
    if (!session) return;
    setHintBusy(objective.id);
    try {
      const data = await api.buyHint(session.id, objective.id);
      addToast({
        tone: 'info',
        title: `Dica revelada (-${data.hint.costBits} bits)`,
        description: data.hint.text
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lab', slug] }),
        queryClient.invalidateQueries({ queryKey: ['me'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
    } catch (error) {
      addToast({ tone: 'error', title: 'Dica não comprada', description: errorMessage(error) });
    } finally {
      setHintBusy(null);
    }
  }

  if (query.isLoading) return <Loading label="Carregando laboratório..." />;
  if (query.isError || !lab) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;

  const canRun = lab.termsAccepted && lab.dockerAvailable;
  const sessionActive = session && (session.status === 'running' || session.status === 'starting');
  const expired = seconds === 0 && session?.status === 'running';

  return (
    <div className="space-y-5">
      <Link to="/labs" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        ← Todos os laboratórios
      </Link>

      <header className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-cyber/10 text-cyber ring-1 ring-cyber/25">
              <FlaskConical size={25} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="badge">Nível {difficultyLabel[lab.difficulty] ?? lab.difficulty}</span>
                <span className="badge flex items-center gap-1"><Clock size={11} /> {lab.ttlMinutes} min</span>
                <span className="badge flex items-center gap-1 text-warn"><Zap size={11} /> +{lab.xpReward} XP</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold">{lab.title}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lab.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{completed}/{lab.objectives.length}</p>
            <p className="text-[11px] text-muted">objetivos</p>
          </div>
        </div>
      </header>

      {!lab.dockerAvailable ? (
        <div className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn/5 p-4 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warn" />
          <div>
            <p className="font-semibold text-warn">Docker indisponível</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Instale/inicie o Docker e recarregue a página para rodar este laboratório. Você ainda pode ler a teoria e
              fazer os exercícios da trilha.
            </p>
          </div>
        </div>
      ) : null}

      {!lab.termsAccepted ? (
        <section className="card border-warn/30 p-5 md:p-6">
          <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck size={17} className="text-warn" /> Termo de uso dos laboratórios</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex gap-2"><span className="text-accent">1.</span> Vou atacar apenas os alvos descartáveis desta plataforma.</li>
            <li className="flex gap-2"><span className="text-accent">2.</span> Não vou tentar escapar do container, acessar a rede do host ou minar criptomoedas.</li>
            <li className="flex gap-2"><span className="text-accent">3.</span> Entendo que usar estas técnicas sem autorização é crime.</li>
            <li className="flex gap-2"><span className="text-accent">4.</span> As flags são pessoais e não devem ser compartilhadas.</li>
          </ul>
          <label className="mt-4 flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-bg/40 p-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#38f2a0]"
              checked={termsChecked}
              onChange={(event) => setTermsChecked(event.target.checked)}
            />
            <span>Li e aceito o termo. Vou praticar com responsabilidade e apenas em ambientes autorizados.</span>
          </label>
          <button className="btn-primary mt-4" disabled={!termsChecked || accepting} onClick={() => void acceptTerms()}>
            {accepting ? 'Registrando...' : 'Aceitar e liberar labs'}
          </button>
        </section>
      ) : null}

      {lab.termsAccepted ? (
        <section className="card p-4 md:p-5">
          {sessionActive ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono font-bold ${
                session.status === 'starting' ? 'border-warn/30 text-warn' : expired ? 'border-danger/40 text-danger' : 'border-accent/30 text-accent'
              }`}>
                {session.status === 'starting' ? <Loader2 size={15} className="animate-spin" /> : <Timer size={15} />}
                {session.status === 'starting' ? 'subindo containers' : formatClock(seconds)}
              </div>
              <p className="text-xs text-muted">
                {session.status === 'starting'
                  ? 'Aguarde enquanto o ambiente é provisionado. Isso pode levar alguns segundos.'
                  : expired
                    ? 'O tempo acabou. Encerre a sessão para liberar os recursos.'
                    : 'Sessão ativa. O terminal aparece abaixo quando estiver pronto.'}
              </p>
              <div className="ml-auto flex flex-wrap gap-2">
                {session.status === 'running' && !session.extended ? (
                  <button className="btn-secondary" onClick={() => void extend()} disabled={extending}>
                    {extending ? 'Estendendo...' : 'Estender +15 min'}
                  </button>
                ) : null}
                <button className="btn-danger" onClick={() => void stop()} disabled={stopping}>
                  <Square size={14} /> {stopping ? 'Encerrando...' : 'Encerrar sessão'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Pronto para invadir (com permissão)?</p>
                <p className="mt-0.5 text-xs text-muted">
                  A sessão dura até {lab.ttlMinutes} minutos e pode ser encerrada a qualquer momento.
                </p>
              </div>
              <button className="btn-primary" onClick={() => void start()} disabled={!canRun || starting}>
                {starting ? <><Loader2 size={15} className="animate-spin" /> Subindo containers...</> : <><Play size={15} /> Iniciar laboratório</>}
              </button>
            </div>
          )}
        </section>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {session?.status === 'running' ? (
            <LabTerminal sessionId={session.id} accent="#38f2a0" />
          ) : (
            <div className="card p-8 text-center">
              <Mascot size={110} mood={session?.status === 'starting' ? 'thinking' : 'idle'} className="mx-auto" />
              <p className="mt-3 text-sm font-medium">
                {session?.status === 'starting'
                  ? 'Preparando o terminal isolado...'
                  : session?.status === 'expired'
                    ? 'Sessão expirada.'
                    : 'O terminal aparece aqui quando a sessão estiver ativa.'}
              </p>
              <p className="mt-1 text-xs text-muted">
                {session?.status === 'expired'
                  ? 'Encerre e inicie uma nova sessão para continuar praticando.'
                  : 'Inicie o laboratório para abrir o shell do container attacker.'}
              </p>
            </div>
          )}

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck size={16} className="text-accent" /> Escopo permitido</h2>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-muted">
              <li>• Alvos: apenas containers provisionados nesta sessão.</li>
              <li>• Rede: interna, sem acesso à internet ou ao host.</li>
              <li>• Proibido: escapar do container, exfiltrar dados reais, DoS, mineração.</li>
              <li>• Flags são únicas por usuário/sessão e não devem ser compartilhadas.</li>
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><KeyRound size={16} className="text-cyber" /> Objetivos</h2>
            <div className="mt-3 space-y-3">
              {lab.objectives.map((objective) => {
                const feedback = flagFeedback[objective.id];
                const nextHint = objective.hints[objective.hintsUsed];
                return (
                  <div key={objective.id} className={`rounded-xl border p-3 ${objective.completed ? 'border-accent/30 bg-accent/5' : 'border-border bg-bg/40'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{objective.title}</p>
                        <p className="text-[10px] text-muted">+{objective.xp} XP · {objective.hintsUsed} dica(s) usada(s)</p>
                      </div>
                      {objective.completed ? <CheckCircle2 size={17} className="shrink-0 text-accent" /> : <span className="badge text-[9px]">aberto</span>}
                    </div>

                    {objective.hints.slice(0, objective.hintsUsed).map((hint, index) => (
                      hint.text ? (
                        <p key={index} className="mt-2 rounded-lg border border-warn/20 bg-warn/5 p-2 text-[11px] leading-5 text-muted">
                          <Lightbulb size={11} className="mr-1 inline text-warn" /> {hint.text}
                        </p>
                      ) : null
                    ))}

                    {!objective.completed ? (
                      <>
                        {nextHint ? (
                          <button
                            className="mt-2 flex items-center gap-1.5 text-[11px] text-warn hover:underline disabled:opacity-50"
                            onClick={() => void buyHint(objective)}
                            disabled={hintBusy === objective.id || !session || session.status !== 'running'}
                          >
                            <Lightbulb size={12} />
                            {hintBusy === objective.id ? 'Revelando...' : `Comprar dica (${nextHint.costBits} bits)`}
                          </button>
                        ) : null}
                        <div className="mt-2 flex gap-2">
                          <input
                            className="input font-mono text-xs"
                            placeholder="CQ{...}"
                            value={flags[objective.id] ?? ''}
                            onChange={(event) => setFlags((prev) => ({ ...prev, [objective.id]: event.target.value }))}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') void submitFlag(objective);
                            }}
                            disabled={!session || session.status !== 'running' || flagBusy === objective.id}
                          />
                          <button
                            className="btn-primary shrink-0 px-3 py-2 text-xs"
                            onClick={() => void submitFlag(objective)}
                            disabled={!session || session.status !== 'running' || !flags[objective.id]?.trim() || flagBusy === objective.id}
                          >
                            {flagBusy === objective.id ? '...' : 'Validar'}
                          </button>
                        </div>
                      </>
                    ) : null}
                    {feedback ? (
                      <p className={`mt-2 text-[11px] ${feedback.ok ? 'text-accent' : 'text-danger'}`}>{feedback.text}</p>
                    ) : null}
                  </div>
                );
              })}
              {lab.objectives.length === 0 ? <p className="text-xs text-muted">Este lab ainda não tem objetivos cadastrados.</p> : null}
            </div>
          </section>

          {allDone && lab.writeup ? (
            <section className="card border-accent/30 p-5">
              <h2 className="flex items-center gap-2 font-semibold text-accent"><CheckCircle2 size={16} /> Writeup liberado</h2>
              <div className="mt-2 max-h-[420px] overflow-y-auto pr-1">
                <Markdown content={lab.writeup} />
              </div>
            </section>
          ) : (
            <section className="panel border-dashed p-4 text-center text-xs text-muted">
              O writeup com a correção completa é liberado após validar todos os objetivos.
            </section>
          )}

          {user ? (
            <p className="text-center text-[10px] text-muted">
              Sessão de @{user.username}. Flags vinculadas à sua conta.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
