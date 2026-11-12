# Locks e deadlock

Uma transação aberta mantém um `UPDATE` travado. Depois de liberar o bloqueio, você deve reproduzir um deadlock em duas sessões.

## Objetivo 1 — quem bloqueia quem

```sql
SELECT
  a.pid,
  a.state,
  a.wait_event_type,
  left(a.query, 60) AS query,
  l.locktype,
  l.granted
FROM pg_locks l
JOIN pg_stat_activity a ON a.pid = l.pid
WHERE NOT l.granted;
```

Para ver o bloqueador, cruze `pg_locks` com `pg_stat_activity`:

```sql
SELECT blocked.pid AS bloqueado, blocking.pid AS bloqueador
FROM pg_stat_activity blocked
JOIN pg_locks l ON l.pid = blocked.pid AND NOT l.granted
JOIN pg_locks bl ON bl.locktype = l.locktype
  AND bl.database IS NOT DISTINCT FROM l.database
  AND bl.relation IS NOT DISTINCT FROM l.relation
  AND bl.granted
JOIN pg_stat_activity blocking ON blocking.pid = bl.pid
WHERE blocked.pid <> pg_backend_pid();
```

## Objetivo 2 — liberar sem perder dados

Encerre a sessão bloqueadora, não o `postgres` inteiro:

```sql
SELECT pg_terminate_backend(<pid_do_bloqueador>);
```

Se o objetivo ainda não validar, aguarde alguns segundos e clique em **Verificar** de novo.

## Objetivo 3 — reproduzir um deadlock

Abra duas sessões `psql`. Na sessão A:

```sql
BEGIN;
UPDATE pedidos SET status = status WHERE id = 1;
-- não faça COMMIT ainda
```

Na sessão B:

```sql
BEGIN;
UPDATE pedidos SET status = status WHERE id = 2;
```

Agora cada uma tenta a linha da outra:

```sql
-- sessão A
UPDATE pedidos SET status = status WHERE id = 2;
-- sessão B
UPDATE pedidos SET status = status WHERE id = 1;
```

O PostgreSQL detecta o ciclo em ~1 s e aborta uma das transações com:

```
ERROR: deadlock detected
```

Confira o contador:

```sql
SELECT datname, deadlocks FROM pg_stat_database WHERE datname = current_database();
```

## Correção e defesa

- Acesse tabelas/linhas **sempre na mesma ordem** para evitar ciclos.
- Mantenha transações curtas e evite esperar por entrada do usuário dentro delas.
- Configure `lock_timeout` e `statement_timeout` para falhar rápido.
- Monitore `pg_locks` e `pg_stat_activity` em incidentes.
