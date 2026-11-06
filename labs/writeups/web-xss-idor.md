# Writeup — XSS e IDOR

## Objetivo

Praticar XSS refletido, XSS armazenado e controle de acesso quebrado em um alvo descartável.

## Passos

1. Acesse `/search?q=<script>alert(1)</script>` e observe a reflexão sem escape.
2. Envie um comentário: `curl -X POST -d 'comment=<script>alert(1)</script>' http://target:8080/comment`.
3. Leia `/comments` e confirme o XSS armazenado.
4. Acesse `/profile?id=2` e obtenha a flag do IDOR.
5. Submeta as flags.

## Correção e defesa

Escapar saída conforme o contexto, usar CSP, cookies HttpOnly e validar autorização no servidor. Nunca confie no cliente para decidir quem pode acessar um recurso.
