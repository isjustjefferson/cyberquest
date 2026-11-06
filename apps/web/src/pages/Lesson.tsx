import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FlaskConical,
  Lock,
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import type { AnswerResult } from '@cyberquest/shared';
import { api, errorMessage, type LessonCompletion } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useAnswerFeedback } from '../lib/feedback';
import { useUiStore } from '../lib/ui';
import { difficultyLabel, kindLabel } from '../lib/format';
import { Loading, ErrorState } from '../components/Loading';
import { Markdown } from '../components/Markdown';
import { ExerciseRenderer } from '../components/ExerciseRenderer';
import { Mascot } from '../components/Mascot';

export function Lesson() {
  const { slug = '' } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const applyFeedback = useAnswerFeedback();
  const addToast = useUiStore((state) => state.addToast);
  const showLevelUp = useUiStore((state) => state.showLevelUp);
  const [results, setResults] = useState<Record<number, AnswerResult>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [completion, setCompletion] = useState<LessonCompletion | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  const query = useQuery({ queryKey: ['lesson', slug], queryFn: () => api.lesson(slug) });
  const lesson = query.data?.lesson;

  useEffect(() => {
    if (!lesson) return;
    if (lesson.progressStatus === 'locked' || lesson.progressStatus === 'completed') return;
    api
      .startLesson(lesson.slug)
      .then(() => queryClient.invalidateQueries({ queryKey: ['dashboard'] }))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  useEffect(() => {
    setResults({});
    setCompletion(null);
  }, [slug]);

  const exercises = useMemo(() => lesson?.exercises ?? [], [lesson?.exercises]);
  const allCorrect = useMemo(
    () => exercises.length === 0 || exercises.every((exercise) => results[exercise.id]?.correct),
    [exercises, results]
  );
  const answered = exercises.filter((exercise) => Boolean(results[exercise.id])).length;

  async function submitAnswer(exerciseId: number, answer: unknown) {
    if (!lesson) return;
    setSubmittingId(exerciseId);
    try {
      const result = await api.answerExercise(exerciseId, answer);
      setResults((prev) => ({ ...prev, [exerciseId]: result }));
      applyFeedback(result);
    } catch (error) {
      addToast({ tone: 'error', title: 'Não foi possível validar', description: errorMessage(error) });
    } finally {
      setSubmittingId(null);
    }
  }

  async function complete() {
    if (!lesson) return;
    setCompleting(true);
    setCompleteError(null);
    try {
      const beforeLevel = user?.level ?? 1;
      const result = await api.completeLesson(lesson.slug);
      setCompletion(result);
      addToast({
        tone: 'success',
        title: result.xpGained > 0 ? `Lição concluída! +${result.xpGained} XP` : 'Lição concluída!',
        description: result.moduleCompleted ? 'Módulo concluído: bônus aplicado.' : undefined
      });
      if (result.stats.level > beforeLevel) showLevelUp(result.stats.level, result.stats.levelTitle);
      result.unlockedAchievements.forEach((achievement) =>
        addToast({
          tone: 'achievement',
          title: `Conquista: ${achievement.title}`,
          description: achievement.description
        })
      );
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 }, colors: ['#38f2a0', '#46b5ff', '#ffcf5c'] });
      }
      void queryClient.invalidateQueries({ queryKey: ['me'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['lesson', slug] });
      if (lesson.trackSlug) void queryClient.invalidateQueries({ queryKey: ['track', lesson.trackSlug] });
    } catch (error) {
      setCompleteError(errorMessage(error));
    } finally {
      setCompleting(false);
    }
  }

  if (query.isLoading) return <Loading label="Carregando lição..." />;
  if (query.isError || !lesson) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;

  if (lesson.progressStatus === 'locked') {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <Lock size={34} className="mx-auto text-muted" />
        <h1 className="mt-4 text-xl font-bold">Lição bloqueada</h1>
        <p className="mt-2 text-sm text-muted">
          Conclua as lições anteriores desta trilha para desbloquear “{lesson.title}”.
        </p>
        <Link to={`/trilhas/${lesson.trackSlug}`} className="btn-primary mt-5">
          Voltar para a trilha
        </Link>
      </div>
    );
  }

  const isCompleted = lesson.progressStatus === 'completed' || Boolean(completion);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-5">
        <Link to={`/trilhas/${lesson.trackSlug}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft size={15} /> {lesson.trackTitle}
        </Link>

        <header className="card p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="badge">{kindLabel[lesson.kind]}</span>
                <span className="badge">Nível {difficultyLabel[lesson.difficulty]}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {lesson.estMinutes} min</span>
                <span className="flex items-center gap-1 text-warn"><Zap size={11} /> {lesson.xp} XP</span>
                {lesson.status === 'draft' ? <span className="badge border-warn/30 text-warn">em expansão</span> : null}
              </div>
              <h1 className="mt-3 text-2xl font-bold md:text-3xl">{lesson.title}</h1>
              <p className="mt-1 text-sm text-muted">{lesson.moduleTitle}</p>
            </div>
            {isCompleted ? (
              <span className="badge border-accent/40 bg-accent/10 text-accent">
                <CheckCircle2 size={13} /> Concluída
              </span>
            ) : null}
          </div>
          {lesson.labSlug ? (
            <Link
              to={`/labs/${lesson.labSlug}`}
              className="mt-4 flex items-center gap-3 rounded-xl border border-cyber/30 bg-cyber/5 p-3 text-sm transition hover:border-cyber/60"
            >
              <FlaskConical size={18} className="text-cyber" />
              <span className="flex-1">Esta lição tem um laboratório prático. Abra o lab quando terminar a teoria.</span>
              <ArrowRight size={15} className="text-cyber" />
            </Link>
          ) : null}
        </header>

        <article className="card p-5 md:p-7">
          <Markdown content={lesson.content} />
        </article>

        {exercises.length > 0 ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Pratique agora</h2>
              <span className="text-xs text-muted">{answered}/{exercises.length} respondidos</span>
            </div>
            {exercises.map((exercise, index) => (
              <ExerciseRenderer
                key={exercise.id}
                exercise={exercise}
                index={index}
                result={results[exercise.id]}
                submitting={submittingId === exercise.id}
                onSubmit={(answer) => void submitAnswer(exercise.id, answer)}
                onRetry={() =>
                  setResults((prev) => {
                    const copy = { ...prev };
                    delete copy[exercise.id];
                    return copy;
                  })
                }
              />
            ))}
          </section>
        ) : null}

        <section className="card p-5 md:p-6">
          {completion ? (
            <div className="text-center">
              <Mascot size={110} mood="happy" className="mx-auto animate-float" />
              <h2 className="mt-2 text-xl font-bold">Lição concluída!</h2>
              <p className="mt-1 text-sm text-muted">O progresso foi salvo. O próximo passo já está disponível no mapa.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                <span className="badge border-warn/30 text-warn"><Zap size={13} /> +{completion.xpGained} XP</span>
                <span className="badge border-cyber/30 text-cyber">+{completion.bitsGained} bits</span>
                <span className="badge border-accent/30 text-accent">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Star key={idx} size={12} fill={idx < completion.stars ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link to={`/trilhas/${lesson.trackSlug}`} className="btn-primary">
                  Voltar à trilha <ArrowRight size={15} />
                </Link>
                {lesson.labSlug ? (
                  <Link to={`/labs/${lesson.labSlug}`} className="btn-secondary">Abrir laboratório</Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">{isCompleted ? 'Revisar conclusão' : 'Finalizar lição'}</h2>
                <p className="mt-1 text-xs text-muted">
                  {exercises.length === 0
                    ? 'Esta lição não tem exercícios obrigatórios.'
                    : allCorrect
                      ? 'Todos os exercícios foram resolvidos. Você pode concluir.'
                      : `Resolva corretamente todos os exercícios para concluir (${exercises.filter((exercise) => results[exercise.id]?.correct).length}/${exercises.length}).`}
                </p>
              </div>
              <button className="btn-primary" onClick={() => void complete()} disabled={!allCorrect || completing}>
                {completing ? 'Salvando...' : isCompleted ? 'Atualizar conclusão' : 'Concluir lição'}
                <CheckCircle2 size={15} />
              </button>
            </div>
          )}
          {completeError ? <p className="mt-3 text-xs text-danger">{completeError}</p> : null}
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div className="panel p-4">
          <h3 className="text-sm font-semibold">Seu progresso</h3>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Exercícios</span>
              <span>{answered}/{exercises.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${exercises.length === 0 ? 100 : (answered / exercises.length) * 100}%` }}
              />
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs">
            {exercises.map((exercise, index) => {
              const result = results[exercise.id];
              return (
                <li key={exercise.id} className={`flex items-center gap-2 ${result?.correct ? 'text-accent' : result ? 'text-danger' : 'text-muted'}`}>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${result?.correct ? 'border-accent/50' : 'border-border'}`}>
                    {result?.correct ? <CheckCircle2 size={12} /> : index + 1}
                  </span>
                  Exercício {index + 1}
                </li>
              );
            })}
            {exercises.length === 0 ? <li className="text-muted">Sem exercícios nesta lição.</li> : null}
          </ul>
        </div>

        <div className="panel p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Trophy size={15} className="text-warn" /> Recompensas</p>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            <li>+{lesson.xp} XP ao concluir</li>
            <li>Bônus de 25% sem erros</li>
            <li>Revisão espaçada automática</li>
            <li>Estrelas por desempenho</li>
          </ul>
        </div>

        <div className="panel border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-semibold text-accent">Lembrete ético</p>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            Use o conhecimento apenas em sistemas que você possui ou tem autorização escrita para testar.
          </p>
        </div>
      </aside>
    </div>
  );
}
