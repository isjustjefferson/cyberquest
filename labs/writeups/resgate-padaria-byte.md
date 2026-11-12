# O plantão da Padaria Byte

Black Friday, 3h da manhã. O site caiu e há vários sintomas encadeados. A ordem é conter, diagnosticar, mitigar e registrar.

## Fase 1 — conexões esgotadas

```sql
SELECT pid, usename, state, wait_event_type, left(query, 60), state_change
FROM pg_stat_activity
ORDER BY state_change;
```

Procure sessões `idle in transaction` e consultas com `pg_sleep`. Encerre apenas a culpada:

```sql
SELECT pg_terminate_backend(<pid>);
```

Encerrar em massa pode derrubar a aplicação. Se o problema voltar, há vazamento de conexões ou pool mal dimensionado.

## Fase 2 — consulta lenta

```sql
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM pedidos WHERE status = 'pendente';
```

Crie o índice sem bloquear escritas:

```sql
CREATE INDEX CONCURRENTLY idx_pedidos_status ON pedidos (status);
```

Meça antes e depois. `CONCURRENTLY` demora mais, mas reduz o lock.

## Fase 3 — bloat e autovacuum

```sql
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables WHERE relname = 'clientes';

ALTER TABLE clientes SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.05
);

VACUUM (ANALYZE) clientes;
```

Transações longas impedem a limpeza. Verifique `idle_in_transaction_session_timeout`.

## Fase 4 — regra trust

```sql
SELECT line_number, type, database, user_name, address, auth_method
FROM pg_hba_file_rules;
```

Remova a linha `host all all 0.0.0.0/0 trust` de `$PGDATA/pg_hba.conf` e recarregue:

```sql
SELECT pg_reload_conf();
```

Teste o acesso legítimo depois. Não reinicie o servidor sem necessidade.

## Fase 5 — desastre

A cópia dos pedidos e itens apagados está em `/var/lib/postgresql/pedidos_ultima_hora.dump`. Restaure primeiro para as tabelas de estágio, que já existem vazias:

```bash
pg_restore -a -t pedidos_ultima_hora -t itens_ultima_hora \
  -d padaria /var/lib/postgresql/pedidos_ultima_hora.dump
```

Copie os pedidos antes dos itens para respeitar a FK:

```sql
INSERT INTO pedidos SELECT * FROM pedidos_ultima_hora;
INSERT INTO itens_pedido SELECT * FROM itens_ultima_hora;
```

Valide 300 pedidos e 800 itens sem duplicatas. Em produção, use backup + WAL até o instante anterior ao `DELETE`.

## Fase 6 — post-mortem

```sql
INSERT INTO postmortem (causa, impacto, linha_do_tempo, acoes)
VALUES (
  'Sessão ociosa em transação segurando conexões e limpeza',
  'Site indisponível por 25 minutos na Black Friday',
  '02:35 alerta; 02:42 diagnóstico; 03:00 recuperação',
  'Limitar conexões, alertar transações longas, testar restauração mensal'
);
```

Um bom post-mortem tem causa, impacto, linha do tempo e ações com dono e prazo. Sem culpa, com foco em prevenção.

## Prevenção

- Alertas para conexões, locks, disco e transações longas.
- `idle_in_transaction_session_timeout` e pool dimensionado.
- Índices medidos, autovacuum ajustado por tabela.
- `pg_hba.conf` revisado e testado.
- Backup e PITR ensaiados regularmente.
