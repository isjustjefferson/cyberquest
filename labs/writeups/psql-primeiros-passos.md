# Primeiros passos com psql

Você recebeu uma estação `workstation` já configurada com `PGHOST=db`, `PGUSER=postgres`, `PGPASSWORD` e `PGDATABASE=padaria`. O `psql` conecta direto ao servidor.

## Explorando

```bash
psql            # conecta ao banco padaria
\l              # lista bancos
\c padaria      # troca de banco
\dt             # lista tabelas
\d clientes     # descreve a tabela
\du             # lista papéis
SELECT version();
```

Os comandos com barra invertida são meta-comandos do cliente `psql`, não SQL.

## Objetivo 1 — tabela clientes acessível

```sql
SELECT count(*) FROM clientes;   -- 40 linhas
```

## Objetivo 2 — criar o banco padaria_dev

```sql
CREATE DATABASE padaria_dev;
```

Conecte com `\c padaria_dev` para conferir. Bancos são objetos do cluster, não do banco atual.

## Objetivo 3 — versão major

```sql
SHOW server_version;             -- 16.x
SHOW server_version_num;         -- 16000x
```

A versão major é `16`. Ela fica visível também em `SELECT version();`.

## Correção e defesa

- `\l` e `\c` são a forma mais rápida de navegar entre bancos.
- `SELECT version()` é útil em tickets e relatórios de compatibilidade.
- Em produção, evite conectar como superusuário: crie um papel com o menor privilégio possível (próximo lab).
