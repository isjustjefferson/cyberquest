#!/bin/bash

nohup bash -c '
  until pg_isready -h 127.0.0.1 -q; do sleep 1; done
  exec psql -X -v ON_ERROR_STOP=1 -c "BEGIN; UPDATE pedidos SET status = status WHERE id = 1; SELECT pg_sleep(86400);"
' >/tmp/cq_idle.log 2>&1 &
