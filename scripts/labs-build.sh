#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGES="$ROOT/labs/images"

echo "[labs] construindo imagens CyberQuest..."
docker build -t cyberquest/attacker:latest "$IMAGES/attacker"
docker build -t cyberquest/target:latest "$IMAGES/target"
docker build -t cyberquest/proxy:latest "$IMAGES/proxy"

echo "[labs] imagens prontas: cyberquest/attacker, cyberquest/target e cyberquest/proxy"
docker images --filter reference='cyberquest/*'
