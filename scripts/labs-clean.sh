#!/usr/bin/env bash
set -euo pipefail

echo "[labs] removendo containers e redes gerenciados pelo CyberQuest..."
container_ids="$(docker ps -aq --filter label=cyberquest.managed=true)"
if [ -n "$container_ids" ]; then
  docker rm -f $container_ids >/dev/null
fi

network_ids="$(docker network ls -q --filter label=cyberquest.managed=true)"
if [ -n "$network_ids" ]; then
  for network_id in $network_ids; do
    docker network rm "$network_id" >/dev/null 2>&1 || true
  done
fi

echo "[labs] limpeza concluída."
