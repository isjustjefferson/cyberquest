#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
CREATE TABLE postmortem (
  id serial PRIMARY KEY,
  causa text NOT NULL,
  impacto text NOT NULL,
  linha_do_tempo text NOT NULL,
  acoes text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE ROLE app_rw LOGIN PASSWORD 'app_rw_local';
GRANT CONNECT ON DATABASE padaria TO app_rw;

CREATE TABLE pedidos_ultima_hora (LIKE pedidos INCLUDING ALL);
CREATE TABLE itens_ultima_hora (LIKE itens_pedido INCLUDING ALL);
INSERT INTO pedidos_ultima_hora SELECT * FROM pedidos WHERE id > 200;
INSERT INTO itens_ultima_hora
SELECT i.* FROM itens_pedido i JOIN pedidos p ON p.id = i.pedido_id WHERE p.id > 200;

ALTER TABLE clientes SET (autovacuum_enabled = false);
UPDATE clientes SET nome = nome;
UPDATE clientes SET nome = nome;
UPDATE clientes SET nome = nome;

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SQL

pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
  -t pedidos_ultima_hora -t itens_ultima_hora \
  -f /var/lib/postgresql/pedidos_ultima_hora.dump

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
DELETE FROM itens_pedido WHERE pedido_id > 200;
DELETE FROM pedidos WHERE id > 200;
TRUNCATE itens_ultima_hora, pedidos_ultima_hora;

SQL

temporary_hba=$(mktemp)
printf '%s\n' "host all all 0.0.0.0/0 trust" > "$temporary_hba"
cat "$PGDATA/pg_hba.conf" >> "$temporary_hba"
cat "$temporary_hba" > "$PGDATA/pg_hba.conf"
rm -f "$temporary_hba"

