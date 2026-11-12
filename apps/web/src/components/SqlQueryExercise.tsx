import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CodeMirror from '@uiw/react-codemirror';
import { sql as sqlLanguage } from '@codemirror/lang-sql';
import type { AnswerResult, PublicExercise, SqlResult } from '@cyberquest/shared';
import { Database, Lightbulb, Loader2, Play, Send } from 'lucide-react';
import { api, errorMessage } from '../lib/api';

interface Props {
  exercise: PublicExercise;
  result?: AnswerResult;
  disabled?: boolean;
  submitting?: boolean;
  onAnswer: (answer: unknown) => void;
}

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function SqlQueryExercise({ exercise, result, disabled, submitting, onAnswer }: Props) {
  const payload = exercise.payload as Record<string, unknown>;
  const dataset = String(payload.dataset ?? '');
  const starter = String(payload.starter ?? '');
  const hints = Array.isArray(payload.hints)
    ? (payload.hints as Array<{ text?: unknown; costBits?: unknown }>)
        .filter((hint) => typeof hint?.text === 'string')
        .map((hint) => ({ text: String(hint.text), costBits: Number(hint.costBits) || 0 }))
    : [];
  const [sql, setSql] = useState(starter);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<SqlResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const locked = Boolean(result) || disabled;

  useEffect(() => {
    setSql(starter);
    setRunResult(null);
    setRunError(null);
  }, [exercise.id, starter]);

  const schemaQuery = useQuery({
    queryKey: ['dataset-schema', dataset],
    queryFn: () => api.datasetSchema(dataset),
    enabled: Boolean(dataset),
    staleTime: 5 * 60_000
  });

  async function run() {
    if (!sql.trim() || locked) return;
    setRunning(true);
    setRunError(null);
    try {
      setRunResult(await api.runSql(exercise.id, sql));
    } catch (error) {
      setRunError(errorMessage(error));
    } finally {
      setRunning(false);
    }
  }

  function submit() {
    if (!sql.trim() || locked) return;
    onAnswer({ sql });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div
        className="min-w-0 space-y-3"
        onKeyDownCapture={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            void run();
          }
        }}
      >
        {payload.prompt ? (
          <p className="whitespace-pre-wrap text-sm text-text/90">{String(payload.prompt)}</p>
        ) : null}
        <div className="overflow-hidden rounded-lg border border-border bg-[#0a0f15]">
          <CodeMirror
            value={sql}
            height="170px"
            theme="dark"
            extensions={[sqlLanguage()]}
            onChange={setSql}
            editable={!locked}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              autocompletion: true
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-secondary" onClick={() => void run()} disabled={!sql.trim() || locked || running}>
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? 'Executando...' : 'Executar'}
          </button>
          <button type="button" className="btn-primary" onClick={submit} disabled={!sql.trim() || locked || submitting}>
            <Send size={14} /> {submitting ? 'Corrigindo...' : 'Enviar'}
          </button>
          <span className="text-[11px] text-muted">Ctrl+Enter executa sem conceder XP.</span>
        </div>

        {runError ? (
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-xs text-danger">{runError}</div>
        ) : null}

        {runResult ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-panel/70 px-3 py-2 text-[11px] text-muted">
              <span>
                {runResult.rowCount} linha(s) · {runResult.durationMs} ms
              </span>
              {runResult.rows.length < runResult.rowCount ? (
                <span>Exibindo as primeiras {runResult.rows.length}</span>
              ) : null}
            </div>
            {runResult.error ? (
              <p className="p-3 text-xs text-danger">{runResult.error}</p>
            ) : runResult.columns.length === 0 ? (
              <p className="p-3 text-xs text-muted">Comando executado com sucesso. Nenhuma linha retornada.</p>
            ) : (
              <div className="max-h-72 overflow-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-[#0d141b] text-muted">
                    <tr>
                      {runResult.columns.map((column) => (
                        <th key={column.name} className="whitespace-nowrap border-b border-border px-3 py-2 font-medium">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {runResult.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-white/[0.015]">
                        {runResult.columns.map((column) => (
                          <td key={column.name} className="whitespace-pre-wrap border-b border-border/60 px-3 py-1.5 font-mono">
                            {cellValue(row[column.name])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <aside className="rounded-lg border border-border bg-bg/40 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-text">
          <Database size={14} className="text-cyber" /> Esquema · {dataset}
        </p>
        {schemaQuery.isLoading ? <p className="mt-2 text-[11px] text-muted">Carregando esquema...</p> : null}
        {schemaQuery.isError ? <p className="mt-2 text-[11px] text-danger">{errorMessage(schemaQuery.error)}</p> : null}
        {schemaQuery.data ? (
          <div className="mt-2 space-y-2">
            {schemaQuery.data.schema.tables.map((table) => (
              <details key={table.name} className="rounded-md border border-border/70 px-2 py-1.5">
                <summary className="cursor-pointer text-[11px] font-semibold text-text/90">{table.name}</summary>
                <ul className="mt-1.5 space-y-1">
                  {table.columns.map((column) => (
                    <li key={column.name} className="flex items-start justify-between gap-2 text-[10px] leading-4">
                      <span className="font-mono text-text/80">
                        {column.name}
                        {column.primaryKey ? <span className="ml-1 text-warn">PK</span> : null}
                      </span>
                      <span className="shrink-0 text-muted">{column.type}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        ) : null}
        {hints.length > 0 ? (
          <details className="mt-3 rounded-md border border-warn/30 bg-warn/5 px-2 py-1.5">
            <summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-warn">
              <Lightbulb size={12} /> Dicas ({hints.length})
            </summary>
            <ul className="mt-2 space-y-1.5">
              {hints.map((hint, index) => (
                <li key={index} className="text-[10px] leading-4 text-text/80">
                  {hint.text}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </aside>
    </div>
  );
}
