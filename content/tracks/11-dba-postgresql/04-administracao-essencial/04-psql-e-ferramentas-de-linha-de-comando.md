---
slug: "psql-e-ferramentas-de-linha-de-comando"
title: "psql e ferramentas de linha de comando"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["instalacao-e-docker"]
lab_slug: "psql-primeiros-passos"
exercises:
  - type: match
    xp: 12
    question: "Relacione cada meta-comando do psql à sua função."
    pairs:
      - ["\\x", "Alterna a exibição expandida"]
      - ["\\timing", "Mostra o tempo de execução"]
      - ["\\watch 2", "Repete a última consulta a cada 2 segundos"]
      - ["\\i arquivo.sql", "Executa um arquivo SQL"]
      - ["\\copy", "Copia dados entre tabela e arquivo no cliente"]
    explanation: "Meta-comandos são recursos do cliente. Eles não funcionam dentro de um driver ou de um script enviado como SQL."
  - type: fill_command
    xp: 10
    question: "Complete o meta-comando que repete a consulta atual a cada 5 segundos."
    template: "\\___ 5"
    blanks: ["watch"]
    accepted: [["watch"]]
    explanation: "\\watch N repete a última consulta. É útil para observar contadores e sessões em tempo real."
  - type: single_choice
    xp: 10
    question: "Onde guardar a senha para conexões automatizadas com psql?"
    options:
      - "No arquivo .pgpass, com permissão restrita"
      - "Na variável PGPASSWORD dentro do .bashrc do root"
      - "No histórico do shell, para reutilizar"
      - "Em um comentário no script de backup"
    answerIndex: 0
    explanation: "O .pgpass evita expor a senha em processos e histórico. Deve ter permissão 0600 e nunca ser versionado."
---

# psql e ferramentas de linha de comando

O `psql` é o canivete do DBA. Além de executar SQL, ele oferece meta-comandos que inspecionam e controlam a sessão. `\l` lista bancos, `\c` troca a conexão, `\dt` lista tabelas, `\d nome` descreve um objeto, `\du` lista roles, `\dn` lista schemas e `\df` lista funções. `\x` alterna o formato expandido, essencial para linhas largas. `\timing` mostra o tempo de cada comando e `\watch N` repete a última consulta a cada N segundos.

Para scripts, `\i arquivo.sql` executa um arquivo e `\copy` copia dados no lado do cliente. A diferença entre `COPY` e `\copy` importa: `COPY` lê arquivos no servidor e exige privilégios elevados; `\copy` lê no cliente e é mais adequado a operações locais. Variáveis como `\set` permitem parametrizar scripts, e um `.psqlrc` pode definir padrões de exibição.

Fora do `psql`, o ecossistema inclui `pg_isready` para checar disponibilidade, `createdb` e `dropdb` para bancos, `pg_ctl` para controlar o servidor, `pg_dump` e `pg_restore` para backup lógico e `pgbench` para carga sintética. Cada ferramenta faz uma coisa bem e conversa com o servidor por strings de conexão ou variáveis de ambiente.

Credenciais merecem cuidado. Use `.pgpass` com permissão `0600`, variáveis apenas quando necessário e nunca deixe senha em linha de comando compartilhada. Em automação, prefira um cofre de segredos. Uma senha no histórico do shell ou em `ps` pode vazar para qualquer usuário do host.

## Por que isso importa

O terminal funciona em servidores remotos, containers e pipelines. Saber inspecionar sem GUI reduz o tempo de diagnóstico e evita alterações às cegas.

## Conceitos-chave

- **Meta-comando:** instrução do cliente, iniciada por `\`.
- **`\x`:** saída expandida.
- **`\watch`:** repetição periódica.
- **`.pgpass`:** arquivo de credenciais com permissão restrita.
- **`pg_isready`:** verifica se o servidor aceita conexões.

## Erros comuns

Rodar `\dt` no banco errado. Tentar usar meta-comandos dentro de um driver. Colocar senha no comando e expô-la no histórico. Confundir `COPY` no servidor com `\copy` no cliente.

## Checklist de domínio

- [ ] Sei navegar por bancos e tabelas só com psql.
- [ ] Sei usar `\x`, `\timing` e `\watch`.
- [ ] Sei configurar `.pgpass`.
- [ ] Sei diferenciar COPY de `\copy`.

## Resumo

`psql` combina SQL e meta-comandos. Ferramentas externas cobrem disponibilidade, backup e benchmark. Credenciais ficam em arquivo restrito, nunca no comando.
