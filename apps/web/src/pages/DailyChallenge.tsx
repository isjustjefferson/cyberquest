import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, CheckCircle2, Target } from 'lucide-react';
import type { AnswerResult } from '@cyberquest/shared';
import { api, errorMessage } from '../lib/api';
import { useAnswerFeedback } from '../lib/feedback';
import { useUiStore } from '../lib/ui';
import { Loading, ErrorState } from '../components/Loading';
import { ExerciseRenderer } from '../components/ExerciseRenderer';

export function DailyChallenge() {
  const queryClient = useQueryClient();
  const applyFeedback = useAnswerFeedback();
  const addToast = useUiStore((state) => state.addToast);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const query = useQuery({ queryKey: ['daily-challenge'], queryFn: api.dailyChallenge });
  if (query.isLoading) return <Loading label="Sorteando o desafio de hoje..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const challenge = query.data.challenge;
  const exercise = challenge.exercise;

  async function submit(answer: unknown) {
    if (!exercise) return;
    setSubmitting(true);
    try {
      const data = await api.answerDaily(exercise.id, answer);
      setResult(data);
      applyFeedback(data);
      void queryClient.invalidateQueries({ queryKey: ['daily-challenge'] });
    } catch (error) {
      addToast({ tone: 'error', title: 'Falha ao validar', description: errorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Painel
      </Link>
      <header className="card p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <CalendarDays size={14} /> Desafio diário · {challenge.date}
        </p>
        <h1 className="mt-2 text-2xl font-bold">Um exercício por dia mantém o cérebro afiado.</h1>
        <p className="mt-2 text-sm text-muted">
          Vale XP bônus na primeira resposta correta do dia. Depois, você pode praticar à vontade.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge border-warn/30 text-warn"><Target size={12} /> +{challenge.bonusXp} XP bônus</span>
          {challenge.answered ? (
            <span className="badge border-accent/30 text-accent"><CheckCircle2 size={12} /> já respondido hoje</span>
          ) : null}
        </div>
      </header>

      {exercise ? (
        <ExerciseRenderer
          exercise={exercise}
          index={0}
          result={result ?? undefined}
          submitting={submitting}
          onSubmit={(answer) => void submit(answer)}
          onRetry={() => setResult(null)}
        />
      ) : (
        <div className="panel p-8 text-center text-sm text-muted">
          Ainda não há exercícios suficientes para o desafio diário. Conclua uma lição para liberar.
        </div>
      )}
      <div className="text-center">
        <Link to="/revisao" className="btn-secondary">Ir para a revisão espaçada</Link>
      </div>
    </div>
  );
}
