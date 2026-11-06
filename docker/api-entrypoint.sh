#!/bin/sh
set -eu

SOCKET="${DOCKER_SOCKET:-/var/run/docker.sock}"

if [ -S "$SOCKET" ]; then
  SOCKET_GID="$(stat -c '%g' "$SOCKET")"
  GROUP_NAME="$(getent group "$SOCKET_GID" | cut -d: -f1 || true)"
  if [ -z "$GROUP_NAME" ]; then
    GROUP_NAME="cq-docker"
    groupadd --gid "$SOCKET_GID" "$GROUP_NAME" 2>/dev/null || true
  fi
  usermod -aG "$GROUP_NAME" node 2>/dev/null || true
fi

if [ -d /app/data ]; then
  chown -R node:node /app/data 2>/dev/null || true
fi

exec gosu node "$@"
