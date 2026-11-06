# Writeup — Padaria Byte

## Objetivo

Encadear reconhecimento, arquivo de backup exposto, credenciais padrão e IDOR.

## Passos

1. Leia `http://target:8080/robots.txt` e encontre `/backup/`.
2. Acesse `/backup/config.txt` e obtenha usuário, senha e uma flag.
3. Use autenticação básica: `curl -u padaria:pao2024 http://target:8080/admin`.
4. Compare `/api/orders/1` e `/api/orders/2` para obter a flag do IDOR.
5. Submeta as quatro flags.

## Correção e defesa

Não publique backups, remova credenciais padrão, aplique autorização por objeto e proteja diretórios administrativos com MFA e controle de acesso.
