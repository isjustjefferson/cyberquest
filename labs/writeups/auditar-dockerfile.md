# Writeup — Auditar Dockerfile e compose inseguros

## Objetivo

Reconhecer configurações perigosas em containers: execução como root, privilégio excessivo e segredo embutido.

## Passos

1. Leia `http://target:8080/Dockerfile.insecure` e observe a ausência de `USER`.
2. Leia `/docker-compose.insecure.yml`.
3. Identifique `privileged: true`, a senha em `environment` e as flags associadas.
4. Submeta as três flags.

## Correção e defesa

Use imagens mínimas, execute como usuário sem privilégios, remova capabilities desnecessárias, aplique `no-new-privileges` e mantenha segredos em cofres externos ao repositório.
