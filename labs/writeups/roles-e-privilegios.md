# Roles e privilégios

O servidor da Padaria Byte só tinha o superusuário. A missão é separar a aplicação em papéis com o menor privilégio possível.

## Objetivo 1 — app_ro

```sql
CREATE ROLE app_ro LOGIN PASSWORD 'app_ro';
GRANT USAGE ON SCHEMA public TO app_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;
```

`USAGE` no esquema permite enxergar os objetos; `SELECT` nas tabelas permite ler.

## Objetivo 2 — app_rw sem apagar clientes

```sql
CREATE ROLE app_rw LOGIN PASSWORD 'app_rw';
GRANT USAGE ON SCHEMA public TO app_rw;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_rw;
```

Não conceda `DELETE` em `clientes`. A aplicação raramente precisa apagar cadastros; prefira inativar.

Confira:

```sql
SELECT has_table_privilege('app_rw', 'clientes', 'DELETE');   -- false
```

## Objetivo 3 — privilégios padrão

Tabelas criadas depois não herdam os `GRANT`s acima. Para isso existem os privilégios padrão:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_ro;
```

Eles valem para objetos criados pelo papel que executou o `ALTER DEFAULT PRIVILEGES` (normalmente o dono do esquema).

## Objetivo 4 — PUBLIC

Todo banco concede alguns privilégios a `PUBLIC` por padrão, incluindo `TEMP`.

```sql
REVOKE TEMP ON DATABASE padaria FROM PUBLIC;
```

## Correção e defesa

- Use `LOGIN` apenas em papéis de aplicação; papéis de grupo não precisam.
- Revise periodicamente com `\du` e `information_schema.role_table_grants`.
- Nunca use superusuário na string de conexão da aplicação.
- `REVOKE ALL ON DATABASE ... FROM PUBLIC` pode ser agressivo; revogue o necessário.
