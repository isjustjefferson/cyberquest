# Writeup — Bypass de login com SQL Injection

## Objetivo

Entender como concatenação de entrada em SQL permite bypass de autenticação e acesso indevido.

## Passos

1. Abra `http://target:8080/login`.
2. Envie usuário `' OR '1'='1` e uma senha qualquer.
3. Leia a flag do bypass e abra `/admin?admin=1`.
4. Compare `/users?id=1` e `/users?id=2` para explorar o IDOR.
5. Submeta as flags.

## Correção e defesa

Use consultas parametrizadas, valide entrada no servidor e verifique autorização em cada recurso. Não concatene entrada do usuário em SQL e registre tentativas suspeitas.
