#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
INSERT INTO pedidos (id, cliente_id, criado_em, status)
SELECT
  1000 + g,
  ((g - 1) % 40) + 1,
  TIMESTAMP '2024-06-01 08:00:00' + ((g - 1) % 30) * INTERVAL '1 day',
  (ARRAY['pago', 'pendente', 'entregue', 'cancelado'])[((g - 1) % 4) + 1]
FROM generate_series(1, 500) AS g;
SQL

pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -t pedidos \
  -f /var/lib/postgresql/pedidos_antes_do_incidente.dump

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
CREATE TABLE incidente_operacao (
  id serial PRIMARY KEY,
  descricao text NOT NULL,
  ocorrido_em timestamptz NOT NULL DEFAULT now()
);

INSERT INTO incidente_operacao (descricao)
VALUES ('DROP TABLE pedidos executado durante a janela de manutencao');

DELETE FROM itens_pedido;
DELETE FROM pedidos;
SQL
