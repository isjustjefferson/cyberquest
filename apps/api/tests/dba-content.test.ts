import { describe, expect, it, beforeAll } from 'vitest';

process.env.CONTENT_DIR = '../../content';
process.env.SQL_MAX_CONCURRENT = '3';

type LoadContent = typeof import('../src/content/loader').loadContent;
type RunSql = typeof import('../src/modules/exercises/sql/runner').runSql;
type ReadDatasetSql = typeof import('../src/modules/exercises/sql/dataset').readDatasetSql;
type SqlExercise = Extract<import('@cyberquest/shared').Exercise, { type: 'sql_query' }>;

let loadContent: LoadContent;
let runSql: RunSql;
let readDatasetSql: ReadDatasetSql;

beforeAll(async () => {
  loadContent = (await import('../src/content/loader')).loadContent;
  runSql = (await import('../src/modules/exercises/sql/runner')).runSql;
  readDatasetSql = (await import('../src/modules/exercises/sql/dataset')).readDatasetSql;
});

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

describe('trilha 11-dba-postgresql', { timeout: 240_000 }, () => {
  it('todo sql_query executa o gabarito e a verificação sem erro', async () => {
    const track = loadContent().find((item) => item.dir === '11-dba-postgresql');
    expect(track).toBeDefined();

    const datasets = new Map<string, string>();
    const entries: Array<{ path: string; exercise: SqlExercise }> = [];
    for (const module of track?.modules ?? []) {
      for (const lesson of module.lessons) {
        for (const exercise of lesson.frontmatter.exercises) {
          if (exercise.type !== 'sql_query') continue;
          entries.push({ path: lesson.relativePath, exercise });
        }
      }
    }

    const failures = await mapWithConcurrency(entries, 3, async ({ path, exercise }) => {
      if (!datasets.has(exercise.dataset)) {
        datasets.set(exercise.dataset, readDatasetSql(exercise.dataset));
      }
      const expected = exercise.grade.expected_sql ?? '';
      const suffix = exercise.grade.check_sql ? `;\n${exercise.grade.check_sql}` : '';
      const result = await runSql({
        mode: 'run',
        datasetSql: datasets.get(exercise.dataset) ?? '',
        setup: exercise.setup,
        sql: `${expected}${suffix}`
      });
      return result.error ? `${path}: ${result.error}` : null;
    });

    expect(entries.length).toBeGreaterThanOrEqual(40);
    expect(failures.filter((failure): failure is string => failure !== null)).toEqual([]);
  });

  it('respeita a profundidade de conteúdo prevista para os módulos DBA', () => {
    const track = loadContent().find((item) => item.dir === '11-dba-postgresql');
    expect(track).toBeDefined();
    const completeInDraftModules = new Map([
      ['07-programacao-no-banco', new Set(['plpgsql-funcoes-e-procedures'])],
      ['08-operacao-e-automacao', new Set(['monitoramento-metricas-chave', 'lab-resgate-padaria-byte'])],
      ['09-carreira-dba', new Set(['perfis-dba-sre-data-engineer'])]
    ]);
    const violations: string[] = [];

    for (const module of track?.modules ?? []) {
      for (const lesson of module.lessons) {
        if (Number(module.frontmatter.position) <= 5) {
          if (lesson.frontmatter.status !== 'complete') violations.push(`${lesson.relativePath}: deveria estar complete`);
          continue;
        }

        const expectedComplete = completeInDraftModules.get(module.frontmatter.slug)?.has(lesson.frontmatter.slug) ?? false;
        if (lesson.frontmatter.status !== (expectedComplete ? 'complete' : 'draft')) {
          violations.push(`${lesson.relativePath}: status inesperado ${lesson.frontmatter.status}`);
        }
        if (!expectedComplete) {
          const wordCount = lesson.body.trim().split(/\s+/).filter(Boolean).length;
          if (wordCount < 250) violations.push(`${lesson.relativePath}: ${wordCount} palavras, mínimo 250`);
          if (lesson.frontmatter.exercises.length < 2) {
            violations.push(`${lesson.relativePath}: menos de 2 exercícios`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
