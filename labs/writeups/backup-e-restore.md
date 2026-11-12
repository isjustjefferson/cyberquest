# Backup e restauração

Alguém executou `DROP TABLE clientes CASCADE` na Padaria Byte. Os pedidos novos continuam lá. Seu objetivo é restaurar **somente** a tabela perdida.

A estação `workstation` compartilha `/home/student` com o container `backup`, que deixou um dump lógico em `/home/student/backup/clientes.dump`.

## Objetivo 1 — backup antes de mexer

Sempre faça um backup do estado atual antes de uma restauração:

```bash
pg_dump -Fc -f ~/antes.dump padaria
```

`PGHOST`, `PGUSER` e `PGPASSWORD` já estão no ambiente. O formato `-Fc` é o custom do PostgreSQL (`pg_restore`).

## Objetivo 2 — restaurar apenas clientes

O dump disponível é SQL puro:

```bash
head -n 20 /home/student/backup/clientes.dump
psql -d padaria -f /home/student/backup/clientes.dump
```

Confira:

```sql
SELECT count(*) FROM clientes;   -- 40
```

Evite `DROP DATABASE`, `pg_restore --clean` no banco inteiro ou recriar o cluster: você apagaria os pedidos novos.

## Objetivo 3 — pedidos preservados

```sql
SELECT count(*) FROM pedidos;    -- 800
```

Os 300 pedidos originais e os 500 criados depois do incidente continuam intactos. A tabela `clientes` restaurada não recria a FK que foi removida pelo `CASCADE`; recriá-la é um passo opcional de saneamento após conferir os dados.

## Correção e defesa

- Teste a restauração periodicamente; backup que nunca foi restaurado não é backup.
- Prefira restaurar em um banco novo e migrar dados específicos quando possível.
- Documente RPO e RTO: quanto dado pode ser perdido e em quanto tempo o serviço volta.
- Para desastres maiores, combine dump lógico com backup físico/PITR (próximos labs).
