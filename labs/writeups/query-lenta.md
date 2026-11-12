# Caça à query lenta

A tabela `pedidos` cresceu para 500 mil linhas e o relatório por cliente ficou lento. A estação já está conectada ao banco `padaria`.

## Objetivo 1 — instrumentação

```sql
SHOW shared_preload_libraries;        -- pg_stat_statements
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 5;
```

O módulo precisa estar em `shared_preload_libraries` para coletar estatísticas desde o início do servidor.

## Objetivo 2 — índice válido

```sql
CREATE INDEX CONCURRENTLY idx_pedidos_cliente ON pedidos (cliente_id);
```

`CONCURRENTLY` constrói o índice sem bloquear escritas. Em troca, demora mais e não pode rodar dentro de uma transação.

Confira:

```sql
SELECT indexrelid::regclass, indisvalid
FROM pg_index i
JOIN pg_class t ON t.oid = i.indrelid
WHERE t.relname = 'pedidos';
```

## Objetivo 3 — plano mudou

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*) FROM pedidos WHERE cliente_id = 3;
```

Com o índice, o plano deve mostrar `Index Scan` ou `Bitmap Index Scan`. Compare o tempo antes/depois.

## Objetivo 4 — índice duplicado

Havia um índice duplicado mantido pelo script de carga:

```sql
DROP INDEX CONCURRENTLY idx_pedidos_cliente_dup;
```

Índices redundantes custam escrita, espaço e manutenção de estatísticas.

## Correção e defesa

- Meça antes de otimizar: `pg_stat_statements` mostra onde o tempo realmente vai.
- Crie índices em colunas usadas em `WHERE`, `JOIN` e `ORDER BY` com seletividade.
- Não crie índices "por garantia": cada um aumenta o custo de escrita.
- Use `EXPLAIN (ANALYZE, BUFFERS)` em produção com cuidado: o `ANALYZE` executa a consulta.
