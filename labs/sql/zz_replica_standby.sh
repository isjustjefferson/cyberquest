#!/bin/bash
set -e

: "${PGDATA:=/var/lib/postgresql/data}"

until pg_isready -h primary -U postgres -q; do
  sleep 1
done

mkdir -p "$PGDATA"
find "$PGDATA" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
chown -R postgres:postgres "$PGDATA"

PGPASSWORD=replicator123 gosu postgres pg_basebackup \
  -h primary \
  -U replicator \
  -D "$PGDATA" \
  -R \
  -X stream \
  -c fast

chown -R postgres:postgres "$PGDATA"
chmod 700 "$PGDATA"
exec gosu postgres postgres
