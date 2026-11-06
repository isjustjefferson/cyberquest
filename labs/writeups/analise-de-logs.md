# Writeup — Análise de logs de um servidor comprometido

## Objetivo

Reconstruir uma linha do tempo a partir de logs de autenticação e acesso.

## Passos

1. Leia `/logs/auth.log` e procure `Failed password` seguido de `Accepted password` do mesmo IP.
2. Leia `/logs/access.log` e localize a requisição com SQLi.
3. No `auth.log`, observe `useradd`, `usermod` e a entrada cron de persistência.
4. Submeta as flags encontradas.

## Correção e defesa

Centralize logs, sincronize horários e crie alertas para força bruta, criação de usuários privilegiados e persistência via cron. Preserve evidências antes de qualquer limpeza.
