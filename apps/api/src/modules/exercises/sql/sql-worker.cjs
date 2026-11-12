const { parentPort, workerData } = require('node:worker_threads');
const { PGlite } = require('@electric-sql/pglite');

function errorMessage(error) {
  const message = String((error && error.message) || error || 'Erro SQL desconhecido');
  return message.split('\n')[0].slice(0, 500);
}

function toResult(result, startedAt, maxRows) {
  const columns = (result.fields || []).map((field) => ({
    name: field.name,
    type: String(field.dataTypeID || '')
  }));
  const allRows = result.rows || [];
  const rows = allRows.slice(0, maxRows).map((row) => {
    const output = {};
    for (const column of columns) output[column.name] = row[column.name];
    return output;
  });
  return {
    columns,
    rows,
    rowCount: allRows.length,
    durationMs: Date.now() - startedAt
  };
}

async function runRead(db, sql, maxRows) {
  const startedAt = Date.now();
  try {
    const result = await db.query(sql);
    return toResult(result, startedAt, maxRows);
  } catch (error) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      durationMs: Date.now() - startedAt,
      error: errorMessage(error)
    };
  }
}

async function execScript(db, sql) {
  const startedAt = Date.now();
  try {
    await db.exec(sql);
    return { durationMs: Date.now() - startedAt };
  } catch (error) {
    return { durationMs: Date.now() - startedAt, error: errorMessage(error) };
  }
}

async function loadDataset(db, datasetSql, setup) {
  await db.exec(datasetSql);
  if (setup) await db.exec(setup);
}

function notifyReady() {
  parentPort.postMessage({ ready: true });
}

async function runMode() {
  const db = new PGlite();
  try {
    await loadDataset(db, workerData.datasetSql, workerData.setup);
    notifyReady();
    const script = workerData.sql.trim();
    const isRead = /^(select|with|show|explain|values|table)\b/i.test(script);
    if (isRead) return await runRead(db, script, workerData.maxRows);
    const executed = await execScript(db, script);
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      durationMs: executed.durationMs,
      ...(executed.error ? { error: executed.error } : {})
    };
  } finally {
    await db.close();
  }
}

async function resultMatchMode() {
  const db = new PGlite();
  try {
    await loadDataset(db, workerData.datasetSql, workerData.setup);
    notifyReady();
    const expected = await runRead(db, workerData.expectedSql, workerData.maxRows);
    if (expected.error) throw new Error(`expected_sql inválido: ${expected.error}`);
    const actual = await runRead(db, workerData.sql, workerData.maxRows);
    return { actual, expected };
  } finally {
    await db.close();
  }
}

async function stateCheckMode() {
  const studentDb = new PGlite();
  const expectedDb = new PGlite();
  try {
    await Promise.all([
      loadDataset(studentDb, workerData.datasetSql, workerData.setup),
      loadDataset(expectedDb, workerData.datasetSql, workerData.setup)
    ]);
    notifyReady();

    const studentScript = await execScript(studentDb, workerData.sql);
    if (studentScript.error) {
      return {
        actual: {
          columns: [],
          rows: [],
          rowCount: 0,
          durationMs: studentScript.durationMs,
          error: studentScript.error
        }
      };
    }
    const actual = await runRead(studentDb, workerData.checkSql, workerData.maxRows);
    if (actual.error) throw new Error(`check_sql inválido: ${actual.error}`);

    const expectedScript = await execScript(expectedDb, workerData.expectedSql);
    if (expectedScript.error) throw new Error(`expected_sql inválido: ${expectedScript.error}`);
    const expected = await runRead(expectedDb, workerData.checkSql, workerData.maxRows);
    if (expected.error) throw new Error(`check_sql inválido: ${expected.error}`);
    return { actual, expected };
  } finally {
    await Promise.allSettled([studentDb.close(), expectedDb.close()]);
  }
}

async function planCheckMode() {
  const db = new PGlite();
  try {
    await loadDataset(db, workerData.datasetSql, workerData.setup);
    notifyReady();
    const sql = workerData.sql.trim().replace(/;\s*$/, '');
    const plan = await runRead(db, `EXPLAIN ${sql}`, workerData.maxRows);
    if (plan.error) return { plan: '', error: plan.error };
    const text = plan.rows.map((row) => String(row['QUERY PLAN'] || Object.values(row)[0] || '')).join('\n');
    return { plan: text };
  } finally {
    await db.close();
  }
}

async function schemaMode() {
  const db = new PGlite();
  try {
    await loadDataset(db, workerData.datasetSql, workerData.setup);
    notifyReady();
    const columnResult = await db.query(
      `SELECT table_name, column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public'
       ORDER BY table_name, ordinal_position`
    );
    const primaryResult = await db.query(
      `SELECT tc.table_name, kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON kcu.constraint_name = tc.constraint_name
        AND kcu.table_schema = tc.table_schema
       WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'`
    );
    const primary = new Set(
      (primaryResult.rows || []).map((row) => `${String(row.table_name)}.${String(row.column_name)}`)
    );
    const tables = new Map();
    for (const row of columnResult.rows || []) {
      const tableName = String(row.table_name);
      if (!tables.has(tableName)) tables.set(tableName, { name: tableName, columns: [] });
      tables.get(tableName).columns.push({
        name: String(row.column_name),
        type: String(row.data_type),
        nullable: row.is_nullable === 'YES',
        defaultValue: row.column_default == null ? null : String(row.column_default),
        primaryKey: primary.has(`${tableName}.${String(row.column_name)}`)
      });
    }
    return { tables: Array.from(tables.values()) };
  } finally {
    await db.close();
  }
}

async function main() {
  switch (workerData.mode) {
    case 'run':
      return runMode();
    case 'result_match':
      return resultMatchMode();
    case 'state_check':
      return stateCheckMode();
    case 'plan_check':
      return planCheckMode();
    case 'schema':
      return schemaMode();
    default:
      throw new Error(`Modo SQL desconhecido: ${workerData.mode}`);
  }
}

main()
  .then((result) => parentPort.postMessage({ ok: true, result }))
  .catch((error) => parentPort.postMessage({ ok: false, error: errorMessage(error) }));
