# Replicação em streaming

O primário tem a Padaria Byte e o standby foi preparado para receber WAL. Confirme o estado, valide a leitura e promova a réplica.

## Preparação que já aconteceu

No primário, um papel `replicator` foi criado com `REPLICATION` e uma regra foi adicionada ao `pg_hba.conf`. O standby recebeu um backup base com:

```bash
pg_basebackup -h primary -U replicator -D "$PGDATA" -R -X stream -c fast
```

O `-R` gera `primary_conninfo` e `standby.signal`. O servidor sobe em recuperação contínua.

## Objetivo 1 — confirmar o streaming

No primário:

```sql
SELECT pid, state, sent_lsn, replay_lsn, replay_lag
FROM pg_stat_replication;
```

No standby:

```sql
SELECT status, received_lsn, latest_end_lsn
FROM pg_stat_wal_receiver;
```

O estado esperado é `streaming`. Atraso alto indica rede, carga ou aplicação de WAL lenta.

## Objetivo 2 — validar dados

```sql
SELECT count(*) FROM clientes;
```

O standby em hot standby aceita leitura. Se a consulta falhar por recuperação, aguarde a aplicação do WAL. Escrita é recusada até a promoção.

## Objetivo 3 — promover

```sql
SELECT pg_promote();
SELECT pg_is_in_recovery();
```

Após a promoção, `pg_is_in_recovery()` retorna `false` e o nó aceita escrita. Em produção, a promoção precisa de fencing, redirecionamento da aplicação e reconfiguração das outras réplicas.

## Cuidados

- Réplica não substitui backup: um `DROP` também é replicado.
- Monitore `replay_lag` e espaço em disco.
- Evite split-brain com consenso e fencing.
- Teste o failover antes de precisar dele.
