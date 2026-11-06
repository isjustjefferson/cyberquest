# Writeup — Reconhecimento com nmap

## Objetivo

Mapear portas e serviços de um alvo autorizado sem executar ações destrutivas.

## Passos

1. Descubra portas: `nmap -sT target`.
2. Confirme o serviço web e leia `http://target:8080/flag-web`.
3. Inspecione cabeçalhos: `curl -i http://target:8080/headers`.
4. Leia o banner TCP: `nc target 2222`.
5. Submeta as flags.

## Correção e defesa

Reduza a superfície de ataque, feche serviços não usados e não exponha banners com informação sensível. Monitore varreduras e mantenha inventário atualizado.
