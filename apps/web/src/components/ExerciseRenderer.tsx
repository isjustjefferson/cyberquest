import { useEffect, useMemo, useState } from 'react';
import type { AnswerResult, PublicExercise } from '@cyberquest/shared';
import { extractBlanks } from '@cyberquest/shared';
import { Check, ChevronDown, ChevronUp, RotateCcw, Send, X } from 'lucide-react';
import { SimTerminal, type SimState } from './SimTerminal';
import { Markdown } from './Markdown';

interface Props {
  exercise: PublicExercise;
  index: number;
  result?: AnswerResult;
  disabled?: boolean;
  onSubmit: (answer: unknown) => void;
  onRetry: () => void;
  submitting?: boolean;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let value = seed;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const target = Math.floor((value / 233280) * (index + 1));
    [copy[index], copy[target]] = [copy[target]!, copy[index]!];
  }
  return copy;
}

function optionClass(active: boolean, state?: 'correct' | 'wrong'): string {
  const base =
    'w-full rounded-lg border px-3 py-2.5 text-left text-sm transition disabled:cursor-default';
  if (state === 'correct') return `${base} border-accent/60 bg-accent/10 text-accent`;
  if (state === 'wrong') return `${base} border-danger/60 bg-danger/10 text-danger`;
  if (active) return `${base} border-accent/60 bg-accent/10 text-text`;
  return `${base} border-border bg-bg/50 text-text/90 hover:border-accent/40`;
}

export function ExerciseRenderer({
  exercise,
  index,
  result,
  disabled,
  onSubmit,
  onRetry,
  submitting
}: Props) {
  const payload = exercise.payload as Record<string, unknown>;
  const [single, setSingle] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [booleanAnswer, setBooleanAnswer] = useState<boolean | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [blanks, setBlanks] = useState<string[]>([]);
  const [codeLines, setCodeLines] = useState<number[]>([]);
  const [flag, setFlag] = useState('');
  const [simState, setSimState] = useState<SimState>({ history: [], files: [], cwd: '' });

  const locked = Boolean(result) || disabled;

  const items = (payload.items as string[] | undefined) ?? [];
  const left = (payload.left as string[] | undefined) ?? [];
  const right = useMemo(
    () => seededShuffle((payload.right as string[] | undefined) ?? [], exercise.id + 7),
    [payload.right, exercise.id]
  );
  const blanksCount = useMemo(() => {
    const template = String(payload.template ?? '');
    const extracted = extractBlanks(template);
    const listed = payload.blanks as string[] | undefined;
    return listed && listed.length > 0 ? listed.length : extracted.length;
  }, [payload.template, payload.blanks]);
  const code = String(payload.code ?? '');
  const codeLinesArray = code.split('\n');

  useEffect(() => {
    setSingle(null);
    setMulti([]);
    setBooleanAnswer(null);
    setOrder(items.map((_, idx) => idx));
    setMatches({});
    setBlanks(Array.from({ length: blanksCount }, () => ''));
    setCodeLines([]);
    setFlag('');
    setSimState({ history: [], files: [], cwd: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, blanksCount]);

  const question = String(payload.question ?? payload.statement ?? payload.goal ?? exercise.question ?? '');

  function toggleMulti(idx: number) {
    setMulti((prev) => (prev.includes(idx) ? prev.filter((value) => value !== idx) : [...prev, idx]));
  }

  function toggleCode(line: number) {
    setCodeLines((prev) => (prev.includes(line) ? prev.filter((value) => value !== line) : [...prev, line]));
  }

  function moveOrder(indexToMove: number, direction: -1 | 1) {
    const target = indexToMove + direction;
    if (target < 0 || target >= order.length) return;
    const copy = [...order];
    [copy[indexToMove], copy[target]] = [copy[target]!, copy[indexToMove]!];
    setOrder(copy);
  }

  function canSubmit(): boolean {
    switch (exercise.type) {
      case 'single_choice':
        return single !== null;
      case 'multi_choice':
        return multi.length > 0;
      case 'true_false':
        return booleanAnswer !== null;
      case 'order':
        return order.length === items.length;
      case 'match':
        return left.every((_, idx) => Boolean(matches[idx]));
      case 'fill_command':
        return blanks.every((value) => value.trim().length > 0);
      case 'sim_terminal':
        return simState.history.length > 0;
      case 'code_review':
        return codeLines.length > 0;
      case 'flag':
        return flag.trim().length > 0;
      default:
        return false;
    }
  }

  function buildAnswer(): unknown {
    switch (exercise.type) {
      case 'single_choice':
        return single;
      case 'multi_choice':
        return multi;
      case 'true_false':
        return booleanAnswer;
      case 'order':
        return order;
      case 'match':
        return left.map((leftItem, idx) => [leftItem, matches[idx] ?? '']);
      case 'fill_command':
        return blanks;
      case 'sim_terminal':
        return { history: simState.history, files: simState.files, cwd: simState.cwd };
      case 'code_review':
        return codeLines;
      case 'flag':
        return flag.trim();
      default:
        return null;
    }
  }

  const correctAnswer =
    result?.correct === true
      ? exercise.type === 'single_choice'
        ? (payload.options as string[])?.[Number(single)]
        : undefined
      : undefined;

  return (
    <article className="panel p-4 md:p-5">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Exercício {index + 1} · {exercise.type.replace('_', ' ')}
          </p>
          {exercise.question && exercise.type !== 'sim_terminal' ? (
            <h3 className="mt-1 text-sm font-semibold leading-6">{exercise.question}</h3>
          ) : null}
        </div>
        <span className="badge shrink-0 text-warn">+{exercise.xp} XP</span>
      </header>

      {exercise.type === 'single_choice' ? (
        <div className="space-y-2">
          {question ? <p className="text-sm text-text/90">{question}</p> : null}
          {((payload.options as string[]) ?? []).map((option, idx) => (
            <button
              key={option}
              type="button"
              className={optionClass(single === idx, result ? (result.correct && single === idx ? 'correct' : single === idx ? 'wrong' : undefined) : undefined)}
              onClick={() => setSingle(idx)}
              disabled={locked}
            >
              <span className="mr-2 font-mono text-xs text-muted">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          ))}
        </div>
      ) : null}

      {exercise.type === 'multi_choice' ? (
        <div className="space-y-2">
          {question ? <p className="text-sm text-text/90">{question}</p> : null}
          {((payload.options as string[]) ?? []).map((option, idx) => (
            <button
              key={option}
              type="button"
              className={optionClass(multi.includes(idx))}
              onClick={() => toggleMulti(idx)}
              disabled={locked}
            >
              <span className={`mr-2 inline-grid h-4 w-4 place-items-center rounded border ${multi.includes(idx) ? 'border-accent bg-accent text-bg' : 'border-border'}`}>
                {multi.includes(idx) ? <Check size={11} /> : null}
              </span>
              {option}
            </button>
          ))}
          <p className="text-[11px] text-muted">Selecione todas as alternativas corretas.</p>
        </div>
      ) : null}

      {exercise.type === 'true_false' ? (
        <div>
          <p className="mb-3 text-sm text-text/90">{String(payload.statement ?? '')}</p>
          <div className="flex gap-2">
            {[
              { label: 'Verdadeiro', value: true },
              { label: 'Falso', value: false }
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                className={optionClass(booleanAnswer === option.value)}
                onClick={() => setBooleanAnswer(option.value)}
                disabled={locked}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {exercise.type === 'order' ? (
        <div>
          {question ? <p className="mb-3 text-sm text-text/90">{question}</p> : null}
          <div className="space-y-2">
            {order.map((originalIndex, position) => (
              <div key={originalIndex} className="flex items-center gap-2 rounded-lg border border-border bg-bg/50 px-3 py-2">
                <span className="font-mono text-xs text-muted">{position + 1}.</span>
                <span className="flex-1 text-sm">{items[originalIndex]}</span>
                <button
                  type="button"
                  className="btn-ghost p-1"
                  onClick={() => moveOrder(position, -1)}
                  disabled={locked || position === 0}
                  aria-label="Mover para cima"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  className="btn-ghost p-1"
                  onClick={() => moveOrder(position, 1)}
                  disabled={locked || position === order.length - 1}
                  aria-label="Mover para baixo"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {exercise.type === 'match' ? (
        <div>
          {question ? <p className="mb-3 text-sm text-text/90">{question}</p> : null}
          <div className="space-y-2">
            {left.map((leftItem, idx) => (
              <div key={leftItem} className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
                <span className="rounded-lg border border-border bg-bg/50 px-3 py-2 text-sm">{leftItem}</span>
                <span className="text-center text-muted">→</span>
                <select
                  className="input"
                  value={matches[idx] ?? ''}
                  onChange={(event) => setMatches((prev) => ({ ...prev, [idx]: event.target.value }))}
                  disabled={locked}
                >
                  <option value="">Selecione...</option>
                  {right.map((rightItem) => (
                    <option key={rightItem} value={rightItem}>{rightItem}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {exercise.type === 'fill_command' ? (
        <div>
          {question ? <p className="mb-3 text-sm text-text/90">{question}</p> : null}
          <div className="rounded-lg border border-border bg-[#0a0f15] p-3 font-mono text-sm leading-8">
            {String(payload.template ?? '')
              .split(/(_{2,})/)
              .map((part, idx) => {
                if (!/^_{2,}$/.test(part)) return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
                const blankIndex = Math.floor(idx / 2);
                return (
                  <input
                    key={idx}
                    className="mx-1 inline-block w-28 rounded border border-border bg-panel px-2 py-0.5 text-center font-mono text-xs text-accent outline-none focus:border-accent/60"
                    value={blanks[blankIndex] ?? ''}
                    placeholder={(payload.blanks as string[])?.[blankIndex] ?? 'resposta'}
                    onChange={(event) =>
                      setBlanks((prev) => {
                        const copy = [...prev];
                        copy[blankIndex] = event.target.value;
                        return copy;
                      })
                    }
                    disabled={locked}
                    aria-label={`Lacuna ${blankIndex + 1}`}
                  />
                );
              })}
          </div>
        </div>
      ) : null}

      {exercise.type === 'sim_terminal' ? (
        <div>
          <div className="mb-3 rounded-lg border border-cyber/20 bg-cyber/5 p-3 text-sm">
            <p className="font-semibold text-cyber">Missão</p>
            <p className="mt-1 text-text/85">{String(payload.goal ?? '')}</p>
            {question && question !== payload.goal ? <p className="mt-1 text-xs text-muted">{question}</p> : null}
          </div>
          <SimTerminal
            scenario={String(payload.scenario ?? 'basico-terminal')}
            goal={String(payload.goal ?? '')}
            allowedCommands={(payload.allowedCommands as string[] | undefined) ?? []}
            onChange={setSimState}
          />
        </div>
      ) : null}

      {exercise.type === 'code_review' ? (
        <div>
          {question ? <p className="mb-3 text-sm text-text/90">{question}</p> : null}
          <div className="overflow-hidden rounded-lg border border-border bg-[#0a0f15]">
            {codeLinesArray.map((line, idx) => {
              const lineNumber = idx + 1;
              return (
                <label
                  key={`${lineNumber}-${line}`}
                  className={`flex cursor-pointer items-start gap-3 px-3 py-1 font-mono text-xs ${
                    codeLines.includes(lineNumber) ? 'bg-danger/10' : 'hover:bg-panel/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#38f2a0]"
                    checked={codeLines.includes(lineNumber)}
                    onChange={() => toggleCode(lineNumber)}
                    disabled={locked}
                  />
                  <span className="w-6 shrink-0 select-none text-right text-muted">{lineNumber}</span>
                  <span className="whitespace-pre-wrap break-words text-text/85">{line || ' '}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted">Marque todas as linhas com falha de segurança.</p>
        </div>
      ) : null}

      {exercise.type === 'flag' ? (
        <div>
          {question ? <p className="mb-3 text-sm text-text/90">{question}</p> : null}
          <input
            className="input font-mono"
            value={flag}
            onChange={(event) => setFlag(event.target.value)}
            placeholder="CQ{...}"
            disabled={locked}
          />
        </div>
      ) : null}

      {result ? (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            result.correct ? 'border-accent/30 bg-accent/5' : 'border-danger/30 bg-danger/5'
          }`}
        >
          <p className={`flex items-center gap-2 font-semibold ${result.correct ? 'text-accent' : 'text-danger'}`}>
            {result.correct ? <Check size={16} /> : <X size={16} />}
            {result.correct ? `Correto!${result.xpGained ? ` +${result.xpGained} XP` : ''}` : 'Resposta incorreta'}
          </p>
          <div className="mt-1 text-text/80">
            <Markdown content={result.explanation || 'Sem explicação adicional.'} />
          </div>
          {!result.correct ? (
            <button type="button" className="btn-secondary mt-3" onClick={onRetry}>
              <RotateCcw size={14} /> Tentar novamente
            </button>
          ) : correctAnswer ? (
            <p className="mt-2 text-xs text-muted">Resposta: {correctAnswer}</p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="btn-primary"
            onClick={() => onSubmit(buildAnswer())}
            disabled={!canSubmit() || submitting}
          >
            {submitting ? 'Validando...' : 'Enviar resposta'} <Send size={14} />
          </button>
        </div>
      )}
    </article>
  );
}
