# Writeup — Linux Basics

## Objetivo

Praticar descoberta de arquivos, leitura de relatórios, identificação de portas e filtragem de logs.

## Passos

1. Leia `/relatorio.txt` e identifique o campo `Dono`.
2. Encontre `/.config_secreta` e extraia a flag.
3. Em `/proc/net/tcp`, converta a porta em hexadecimal (`1F90` = `8080`).
4. Filtre o log: `curl -s http://target:8080/logs/access.log | grep 10.0.0.7`.
5. Submeta as flags encontradas.

## Correção e defesa

Arquivos de configuração não devem ficar em diretórios públicos. Restrinja permissões, remova dados sensíveis de logs e mantenha inventário das portas expostas.
