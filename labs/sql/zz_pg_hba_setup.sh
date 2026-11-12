#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
CREATE ROLE app_rw LOGIN PASSWORD 'app2024';
SQL

# Regra quebrada de propósito: a senha foi armazenada como scram-sha-256,
# mas a regra manda autenticar com md5.
echo 'host padaria app_rw 172.16.0.0/12 md5' >> "$PGDATA/pg_hba.conf"
