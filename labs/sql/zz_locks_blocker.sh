#!/bin/bash

nohup bash -c '
  until pg_isready -h 127.0.0.1 -q; do sleep 1; done
  exec psql -X -v ON_ERROR_STOP=1 -c "BEGIN; UPDATE pedidos SET status = status WHERE id = 1; SELECT pg_sleep(86400);"
' >/tmp/cq_blocker.log 2>&1 &

nohup bash -c '
  until pg_isready -h 127.0.0.1 -q; do sleep 1; done
  sleep 3
  exec psql -X -v ON_ERROR_STOP=1 -c "UPDATE pedidos SET status = status WHERE id = 1;"
' >/tmp/cq_waiter.log 2>&1 &
