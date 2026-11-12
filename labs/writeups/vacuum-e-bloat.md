# Vacuum e bloat

Um lote de `UPDATE`s deixou a tabela `pedidos` inchada. O autovacuum está desligado nessa tabela e uma transação esquecida segura recursos.

## Objetivo 1 — achar e encerrar a sessão

```sql
SELECT pid, state, wait_event_type, left(query, 60)
FROM pg_stat_activity
WHERE query ILIKE '%pg_sleep%';
```

Encerre **apenas** a sessão que prende a transação:

```sql
SELECT pg_terminate_backend(<pid>);
```

Evite `pg_terminate_backend` em massa: você pode derrubar conexões legítimas.

## Objetivo 2 — VACUUM (ANALYZE)

```sql
VACUUM (ANALYZE) pedidos;
```

`VACUUM` devolve espaço de tuplas mortas para reutilização; `ANALYZE` atualiza estatísticas do planejador. Confira:

```sql
SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_analyze
FROM pg_stat_user_tables WHERE relname = 'pedidos';
```

## Objetivo 3 — ajustar o autovacuum da tabela

```sql
ALTER TABLE pedidos SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.05
);
```

O valor global costuma ser alto demais para tabelas grandes. Ajustar **por tabela** evita mexer no comportamento do cluster inteiro.

Também vale considerar `autovacuum_vacuum_threshold` e `autovacuum_analyze_scale_factor`.

## Correção e defesa

- Monitore `n_dead_tup` e `last_autovacuum`.
- Transações `idle in transaction` impedem a limpeza: configure `idle_in_transaction_session_timeout`.
- Bloat não é só espaço: planos e I/O pioram junto.
- Em tabelas muito grandes, avalie `VACUUM (FULL)` só em janelas de manutenção — ele bloqueia escritas e leituras.
