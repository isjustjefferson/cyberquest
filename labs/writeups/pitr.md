# PITR: recuperação a um ponto no tempo

Um `DROP TABLE pedidos` apagou os dados. O laboratório fornece uma cópia de recuperação em `/var/lib/postgresql/pedidos_antes_do_incidente.dump`. Em produção, o fluxo equivalente combina backup base e WAL arquivado.

## Objetivo 1 — backup do estado atual

Antes de qualquer recuperação, preserve o que ainda existe:

```bash
pg_dump -Fc -f /var/lib/postgresql/antes_da_recuperacao.dump padaria
```

Se a recuperação falhar ou restaurar demais, esse arquivo é a rede de segurança.

## Objetivo 2 — restaurar os pedidos

A cópia contém a tabela `pedidos` no estado anterior ao incidente. Restaure apenas os dados:

```bash
pg_restore -a -t pedidos -d padaria /var/lib/postgresql/pedidos_antes_do_incidente.dump
```

`-a` restaura somente dados; `-t pedidos` restringe à tabela. A tabela precisa existir. Se houver conflito de chave, investigue antes de truncar: apagar dados novos pode piorar o incidente.

## Objetivo 3 — validar a integridade

```sql
SELECT (SELECT count(*) FROM clientes) AS clientes,
       (SELECT count(*) FROM produtos) AS produtos,
       (SELECT count(DISTINCT id) FROM pedidos) AS pedidos_unicos;
```

Espere 40 clientes, 25 produtos e 800 pedidos únicos. Valide também a aplicação e as sequências.

## PITR real

1. Restaure um **backup base** em um diretório separado.
2. Configure `restore_command` para buscar o WAL arquivado.
3. Defina `recovery_target_time` alguns segundos antes do incidente.
4. Crie `recovery.signal` e inicie o servidor.
5. Acompanhe o log, valide os dados e promova.

Nunca apague `pg_wal` manualmente. Sem o WAL, o backup base só recupera até o instante em que foi tirado. O laboratório usa um dump para focar no procedimento de recuperação e validação; pratique o fluxo completo em uma instância separada antes de um incidente real.
