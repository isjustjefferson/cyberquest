import { beforeAll, describe, expect, it } from 'vitest';
import type { Exercise } from '@cyberquest/shared';

process.env.CONTENT_DIR = '../../content';

let datasetSql = '';
let runSql: typeof import('../src/modules/exercises/sql/runner').runSql;
let compareSql: typeof import('../src/modules/exercises/sql/runner').compareSql;
let inspectPlan: typeof import('../src/modules/exercises/sql/runner').inspectPlan;
let loadDatasetSchema: typeof import('../src/modules/exercises/sql/runner').loadDatasetSchema;
let gradeSqlExercise: typeof import('../src/modules/exercises/sql/grader').gradeSqlExercise;

beforeAll(async () => {
  const dataset = await import('../src/modules/exercises/sql/dataset');
  const runner = await import('../src/modules/exercises/sql/runner');
  const grader = await import('../src/modules/exercises/sql/grader');
  datasetSql = dataset.readDatasetSql('padaria_byte');
  runSql = runner.runSql;
  compareSql = runner.compareSql;
  inspectPlan = runner.inspectPlan;
  loadDatasetSchema = runner.loadDatasetSchema;
  gradeSqlExercise = grader.gradeSqlExercise;
});

function sqlExercise(overrides: Partial<Extract<Exercise, { type: 'sql_query' }>> = {}): Extract<Exercise, { type: 'sql_query' }> {
  return {
    type: 'sql_query',
    xp: 10,
    prompt: 'Liste os produtos',
    dataset: 'padaria_byte',
    setup: '',
    starter: '',
    explanation: 'Use SELECT.',
    hints: [],
    grade: {
      mode: 'result_match',
      expected_sql: 'SELECT nome, preco FROM produtos WHERE categoria = \'Pães\' ORDER BY preco DESC',
      ordered: true,
      compare_column_names: true,
      numeric_tolerance: 0.001,
      must_contain: [],
      must_not_contain: []
    },
    ...overrides
  };
}

describe('motor SQL', { timeout: 30_000 }, () => {
  it('carrega o dataset determinístico com as contagens esperadas', async () => {
    const countsSql = `SELECT
      (SELECT count(*)::int FROM clientes) AS clientes,
      (SELECT count(*)::int FROM produtos) AS produtos,
      (SELECT count(*)::int FROM pedidos) AS pedidos,
      (SELECT count(*)::int FROM itens_pedido) AS itens`;
    const first = await runSql({ mode: 'run', datasetSql, sql: countsSql });
    const second = await runSql({ mode: 'run', datasetSql, sql: countsSql });
    expect(first.error).toBeUndefined();
    expect(first.rows).toEqual(second.rows);
    expect(first.rows[0]).toEqual({ clientes: 40, produtos: 25, pedidos: 300, itens: 800 });
  });

  it('expõe o esquema do dataset', async () => {
    const schema = await loadDatasetSchema(datasetSql, 'padaria_byte');
    const produtos = schema.tables.find((table) => table.name === 'produtos');
    expect(produtos?.columns.find((column) => column.name === 'id')?.primaryKey).toBe(true);
    expect(produtos?.columns.map((column) => column.name)).toContain('preco');
  });

  it('devolve mensagem didática para SQL inválido', async () => {
    const result = await runSql({ mode: 'run', datasetSql, sql: 'SELECT * FROM' });
    expect(result.error).toMatch(/syntax|erro/i);
  });

  it('corrige result_match com e sem ordem', async () => {
    const exercise = sqlExercise();
    const correct = await gradeSqlExercise(
      exercise,
      "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco DESC"
    );
    expect(correct.correct).toBe(true);

    const wrongOrder = await gradeSqlExercise(
      exercise,
      "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco"
    );
    expect(wrongOrder.correct).toBe(false);

    const unordered = await gradeSqlExercise(
      sqlExercise({ grade: { ...exercise.grade, ordered: false } }),
      "SELECT nome, preco FROM produtos WHERE categoria = 'Pães'"
    );
    expect(unordered.correct).toBe(true);
  });

  it('corrige state_check comparando o estado final', async () => {
    const exercise = sqlExercise({
      grade: {
        mode: 'state_check',
        expected_sql: `CREATE TABLE produtos_novos (id INTEGER PRIMARY KEY, nome TEXT);
                       INSERT INTO produtos_novos VALUES (1, 'Pão de Fermentação Natural');`,
        check_sql: 'SELECT id, nome FROM produtos_novos ORDER BY id',
        ordered: true,
        compare_column_names: true,
        numeric_tolerance: 0.001,
        must_contain: [],
        must_not_contain: []
      }
    });
    const result = await gradeSqlExercise(
      exercise,
      `CREATE TABLE produtos_novos (id INTEGER PRIMARY KEY, nome TEXT);
       INSERT INTO produtos_novos VALUES (1, 'Pão de Fermentação Natural');`
    );
    expect(result.correct).toBe(true);
  });

  it('corrige plan_check por padrões do plano', async () => {
    const exercise = sqlExercise({
      grade: {
        mode: 'plan_check',
        ordered: true,
        compare_column_names: true,
        numeric_tolerance: 0.001,
        must_contain: ['Seq Scan'],
        must_not_contain: []
      }
    });
    const result = await gradeSqlExercise(exercise, 'SELECT * FROM pedidos WHERE cliente_id = 1');
    expect(result.correct).toBe(true);
  });

  it('aborta consulta acima do timeout sem derrubar o processo', async () => {
    await expect(
      runSql(
        {
          mode: 'run',
          datasetSql,
          sql: 'SELECT pg_sleep(5)'
        },
        1_500
      )
    ).rejects.toMatchObject({ code: 'SQL_TIMEOUT' });
  });

  it('compara resultados numéricos com tolerância', async () => {
    const compared = await compareSql({
      mode: 'result_match',
      datasetSql,
      sql: 'SELECT 1.0004::numeric AS valor',
      expectedSql: 'SELECT 1.0000::numeric AS valor'
    });
    expect(compared.actual.error).toBeUndefined();
    const exercise = sqlExercise({
      grade: {
        mode: 'result_match',
        expected_sql: 'SELECT 1.0 AS valor',
        ordered: true,
        compare_column_names: true,
        numeric_tolerance: 0.001,
        must_contain: [],
        must_not_contain: []
      }
    });
    expect((await gradeSqlExercise(exercise, 'SELECT 1.0004 AS valor')).correct).toBe(true);
  });

  it('mantém o plano disponível para inspeção', async () => {
    const plan = await inspectPlan({
      mode: 'plan_check',
      datasetSql,
      sql: 'SELECT * FROM pedidos WHERE cliente_id = 1'
    });
    expect(plan.plan).toContain('Seq Scan');
  });
});
