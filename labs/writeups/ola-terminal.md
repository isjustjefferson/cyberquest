# Writeup — Olá, terminal

## Objetivo

Familiarizar-se com o terminal e com a validação de flags usando um alvo HTTP descartável.

## Passos

1. Confirme o alvo: `curl http://target:8080/`.
2. Leia a primeira flag: `curl http://target:8080/flag.txt`.
3. Acesse o arquivo oculto: `curl http://target:8080/home/ctf/.flag`.
4. Descubra o usuário do serviço: `curl http://target:8080/whoami`.
5. Submeta cada flag no painel do lab.

## Correção e defesa

Não publique arquivos sensíveis em diretórios web. Use controle de acesso, revisão de conteúdo publicado e princípio do menor privilégio.
