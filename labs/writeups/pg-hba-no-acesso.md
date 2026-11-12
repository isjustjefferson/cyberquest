# O acesso que não entra (pg_hba)

A aplicação usa o papel `app_rw`, mas a conexão falha. O terminal deste lab abre **no container do banco**, como `postgres`.

## Diagnóstico

```bash
echo $PGDATA
grep app_rw "$PGDATA/pg_hba.conf"
tail -n 50 "$PGDATA/log/"*.log 2>/dev/null
```

A regra foi criada com `md5`, mas a senha do papel foi armazenada com `scram-sha-256`. O PostgreSQL compara o método da regra com o hash da senha e recusa a autenticação com `password authentication failed`.

## Objetivo 1 — localizar a regra

A linha problemática é parecida com:

```
host padaria app_rw 172.16.0.0/12 md5
```

## Objetivo 2 — corrigir para scram-sha-256

Edite o `pg_hba.conf` (use `nano`, `vim-tiny` ou `sed`) e troque `md5` por `scram-sha-256`:

```bash
sed -i 's|^host padaria app_rw 172.16.0.0/12 md5$|host padaria app_rw 172.16.0.0/12 scram-sha-256|' "$PGDATA/pg_hba.conf"
pg_ctl reload -D "$PGDATA"
```

O `reload` relê o `pg_hba.conf` sem reiniciar o servidor. Confira com:

```bash
psql -h db -U app_rw -d padaria -c "SELECT current_user;"
```

(a senha do papel é `app2024`; de dentro do container você pode usar o socket local).

## Objetivo 3 — nenhuma regra trust aberta

Nunca deixe uma regra como:

```
host all all 0.0.0.0/0 trust
```

`trust` aceita qualquer conexão sem senha. Prefira `scram-sha-256` e restrinja a rede de origem.

## Ordem importa

O PostgreSQL usa a **primeira** regra que casa. Regras mais específicas devem vir antes das genéricas. Depois de qualquer edição, valide a sintaxe com um `reload` e acompanhe o log.

## Correção e defesa

- Prefira `scram-sha-256` a `md5` (md5 é legado e mais fraco).
- Mantenha o `pg_hba.conf` versionado e revisado.
- Use `pg_ctl reload`, não `restart`, para mudanças de autenticação.
