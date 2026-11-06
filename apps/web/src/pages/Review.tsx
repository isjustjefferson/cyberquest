import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import type { AnswerResult } from '@cyberquest/shared';
import { api, errorMessage } from '../lib/api';
import { useAnswerFeedback } from '../lib/feedback';
import { useUiStore } from '../lib/ui';
import { Loading, ErrorState } from '../components/Loading';
import { ExerciseRenderer } from '../components/ExerciseRenderer';
import { Mascot } from '../components/Mascot';

export function Review() {
  const queryClient = useQueryClient();
  const applyFeedback = useAnswerFeedback();
  const addToast = useUiStore((state) => state.addToast);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const query = useQuery({ queryKey: ['review-due'], queryFn: api.reviewDue });

  useEffect(() => {
    setIndex(0);
    setResult(null);
  }, [query.dataUpdatedAt]);

  if (query.isLoading) return <Loading label="Buscando revisões..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const items = query.data.items;
  const item = items[index];

  async function submit(answer: unknown) {
    if (!item) return;
    setSubmitting(true);
    try {
      const data = await api.answerExercise(item.exercise.id, answer);
      setResult(data);
      applyFeedback(data);
      setReviewed((prev) => prev + 1);
      if (data.correct) setCorrectCount((prev) => prev + 1);
    } catch (error) {
      addToast({ tone: 'error', title: 'Falha na revisão', description: errorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (index + 1 >= items.length) {
      void queryClient.invalidateQueries({ queryKey: ['review-due'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIndex(items.length);
      return;
    }
    setIndex((prev) => prev + 1);
    setResult(null);
  }

  if (items.length === 0 || index >= items.length) {
    const finished = items.length > 0 && index >= items.length;
    return (
      <div className="mx-auto max-w-xl">
        <div className="card p-8 text-center">
          <Mascot size={120} mood="happy" className={finished ? 'mx-auto animate-float' : 'mx-auto'} />
          <h1 className="mt-3 text-2xl font-bold">{finished ? 'Revisão concluída!' : 'Nada para revisar agora'}</h1>
          <p className="mt-2 text-sm text-muted">
            {finished
              ? `Você revisou ${reviewed} exercício(s) e acertou ${correctCount}. O próximo lote aparece no momento certo.`
              : 'O algoritmo SM-2 agenda cada exercício para o melhor momento de revisão. Volte mais tarde ou avance em novas lições.'}
          </p>
          {finished ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="badge border-accent/30 text-accent"><CheckCircle2 size={13} /> {correctCount} acertos</span>
              <span className="badge border-cyber/30 text-cyber"><Trophy size={13} /> {reviewed} revisões</span>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/dashboard" className="btn-primary">Voltar ao painel</Link>
            <Link to="/trilhas" className="btn-secondary">Avançar em uma trilha</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Painel
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyber">
            <RotateCcw size={14} /> Revisão espaçada
          </p>
          <h1 className="mt-1 text-2xl font-bold">Fixe o conhecimento</h1>
          <p className="mt-1 text-sm text-muted">Exercício {index + 1} de {items.length} para revisar hoje.</p>
        </div>
        <span className="badge">intervalo atual: {item.intervalDays} dia(s)</span>
      </header>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-cyber transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>
      <ExerciseRenderer
        key={item.exercise.id}
        exercise={item.exercise}
        index={index}
        result={result ?? undefined}
        submitting={submitting}
        onSubmit={(answer) => void submit(answer)}
        onRetry={() => setResult(null)}
      />
      {result ? (
        <div className="flex justify-end">
          <button className="btn-primary" onClick={next}>
            {index + 1 >= items.length ? 'Finalizar revisão' : 'Próximo exercício'} <ArrowRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
