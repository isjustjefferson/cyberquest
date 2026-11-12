export type SqlGradeMode = 'result_match' | 'state_check' | 'plan_check';

export interface SqlColumn {
  name: string;
  type: string;
}

export interface SqlResult {
  columns: SqlColumn[];
  rows: Array<Record<string, unknown>>;
  rowCount: number;
  durationMs: number;
  error?: string;
}

export interface SqlDatasetColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  primaryKey: boolean;
}

export interface SqlDatasetTable {
  name: string;
  columns: SqlDatasetColumn[];
}

export interface SqlDatasetSchema {
  name: string;
  tables: SqlDatasetTable[];
}
