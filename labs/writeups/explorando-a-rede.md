# Writeup — Explorando a rede

## Objetivo

Resolver nomes internos, inspecionar cabeçalhos HTTP e interagir com um serviço TCP.

## Passos

1. Leia `http://target:8080/dns.txt`.
2. Inspecione cabeçalhos: `curl -i http://target:8080/headers`.
3. Conecte ao serviço TCP: `nc target 2222` ou `curl http://target:2222/`.
4. Submeta as flags dos três objetivos.

## Correção e defesa

Evite serviços desnecessários, restrinja cabeçalhos que revelem informação e segmente a rede. Serviços internos ainda precisam de autenticação e monitoramento.
