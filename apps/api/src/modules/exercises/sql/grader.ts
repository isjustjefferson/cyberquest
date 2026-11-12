import type { Exercise, SqlResult } from '@cyberquest/shared';
import { config } from '../../../config';
import { logger } from '../../../logger';
import { AppError } from '../../../utils/errors';
import type { GradeResult } from '../grader';
import { readDatasetSql } from './dataset';
import { compareSql, inspectPlan } from './runner';

type SqlExercise = Extract<Exercise, { type: 'sql_query' }>;

function extractSql(answer: unknown): string {
  const value =
    typeof answer === 'string'
      ? answer
      : answer && typeof answer === 'object' && 'sql' in answer
        ? (answer as { sql?: unknown }).sql
        : undefined;
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(400, 'INVALID_SQL_ANSWER', 'Envie uma consulta SQL para correção.');
  }
  if (Buffer.byteLength(value, 'utf8') > config.SQL_MAX_SQL_BYTES) {
    throw new AppError(413, 'SQL_TOO_LARGE', 'A consulta SQL enviada é muito grande.');
  }
  return value;
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function numericValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function sameValue(left: unknown, right: unknown, tolerance: number): boolean {
  if (left === right) return true;
  if (left == null || right == null) return left === right;
  const leftNumber = numericValue(left);
  const rightNumber = numericValue(right);
  if (leftNumber !== null && rightNumber !== null) return Math.abs(leftNumber - rightNumber) <= tolerance;
  return String(left) === String(right);
}

function values(row: Record<string, unknown>, columns: string[]): unknown[] {
  return columns.map((column) => row[column]);
}

function compareResults(actual: SqlResult, expected: SqlResult, exercise: SqlExercise): { correct: boolean; summary: string } {
  const grade = exercise.grade;
  if (actual.error) return { correct: false, summary: `Erro SQL: ${actual.error}` };
  if (expected.error) throw new Error(`Resultado esperado inválido: ${expected.error}`);

  if (grade.compare_column_names) {
    const actualNames = actual.columns.map((column) => normalizeName(column.name));
    const expectedNames = expected.columns.map((column) => normalizeName(column.name));
    if (
      actualNames.length !== expectedNames.length ||
      actualNames.some((name, index) => name !== expectedNames[index])
    ) {
      return {
        correct: false,
        summary: `Colunas recebidas: ${actualNames.join(', ') || '(nenhuma)'}. Colunas esperadas: ${expectedNames.join(', ') || '(nenhuma)'}.`
      };
    }
  }

  if (actual.rowCount !== expected.rowCount) {
    return {
      correct: false,
      summary: `A consulta retornou ${actual.rowCount} linha(s); o esperado era ${expected.rowCount}.`
    };
  }

  const tolerance = grade.numeric_tolerance;
  const actualRows = actual.rows.map((row) => values(row, actual.columns.map((column) => column.name)));
  const expectedRows = expected.rows.map((row) => values(row, expected.columns.map((column) => column.name)));

  if (grade.ordered) {
    const same = actualRows.every((row, index) =>
      expectedRows[index]?.every((value, columnIndex) => sameValue(row[columnIndex], value, tolerance))
    );
    return same
      ? { correct: true, summary: 'Resultado correto.' }
      : { correct: false, summary: 'As linhas estão corretas, mas a ordem (ou algum valor) não corresponde.' };
  }

  const remaining = [...expectedRows];
  for (const row of actualRows) {
    const match = remaining.findIndex((candidate) =>
      candidate.every((value, index) => sameValue(row[index], value, tolerance))
    );
    if (match === -1) {
      return { correct: false, summary: 'Os valores retornados não correspondem ao resultado esperado.' };
    }
    remaining.splice(match, 1);
  }
  return remaining.length === 0
    ? { correct: true, summary: 'Resultado correto.' }
    : { correct: false, summary: 'Faltam linhas no resultado.' };
}

function withSummary(exercise: SqlExercise, summary: string): string {
  const explanation = exercise.explanation?.trim();
  return explanation ? `${explanation}\n\n${summary}` : summary;
}

function wrong(exercise: SqlExercise, summary: string): GradeResult {
  return { correct: false, explanation: withSummary(exercise, summary) };
}

export async function gradeSqlExercise(exercise: SqlExercise, answer: unknown): Promise<GradeResult> {
  const sql = extractSql(answer);
  const datasetSql = readDatasetSql(exercise.dataset);

  try {
    if (exercise.grade.mode === 'plan_check') {
      const result = await inspectPlan({
        mode: 'plan_check',
        datasetSql,
        setup: exercise.setup,
        sql
      });
      if (result.error) return wrong(exercise, `Erro SQL: ${result.error}`);
      const plan = result.plan.toLowerCase();
      const missing = exercise.grade.must_contain.filter((pattern) => !plan.includes(pattern.toLowerCase()));
      const forbidden = exercise.grade.must_not_contain.filter((pattern) => plan.includes(pattern.toLowerCase()));
      if (missing.length > 0 || forbidden.length > 0) {
        return wrong(exercise, 'O plano de execução ainda não atende ao objetivo da lição.');
      }
      return { correct: true, explanation: withSummary(exercise, 'Plano de execução correto.') };
    }

    const comparison = await compareSql({
      mode: exercise.grade.mode,
      datasetSql,
      setup: exercise.setup,
      sql,
      expectedSql: exercise.grade.expected_sql,
      checkSql: exercise.grade.check_sql
    });
    const graded = compareResults(comparison.actual, comparison.expected, exercise);
    return graded.correct
      ? { correct: true, explanation: withSummary(exercise, graded.summary) }
      : wrong(exercise, graded.summary);
  } catch (error) {
    if (error instanceof AppError && error.code === 'SQL_TIMEOUT') {
      return wrong(exercise, error.message);
    }
    logger.error({ err: error, exerciseId: exercise.prompt }, 'Falha ao corrigir exercício SQL');
    throw new AppError(500, 'SQL_ENGINE_ERROR', 'Não foi possível executar este exercício SQL.');
  }
}
