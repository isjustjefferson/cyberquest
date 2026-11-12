---
slug: "lab-query-lenta"
title: "Lab: Caça à query lenta"
kind: lab
difficulty: 3
est_minutes: 30
xp: 300
status: complete
prerequisites: ["pg-stat-statements-e-diagnostico", "indices-em-profundidade"]
lab_slug: "query-lenta"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual visão ajuda a identificar a consulta que mais consome tempo total?"
    options:
      - "pg_stat_statements"
      - "pg_roles"
      - "pg_hba_file_rules"
      - "information_schema.tables"
    answerIndex: 0
    explanation: "pg_stat_statements agrega calls, tempo total e médio por formato de consulta. É o ponto de partida para priorizar."
  - type: true_false
    xp: 10
    statement: "CREATE INDEX CONCURRENTLY evita bloquear escritas durante a criação do índice."
    answer: true
    explanation: "A opção CONCURRENTLY reduz o lock, mas demora mais e pode falhar; verifique se o índice ficou válido em pg_index."
  - type: fill_command
    xp: 10
    question: "Complete a consulta que mostra o plano real com buffers de uma consulta."
    template: "EXPLAIN (ANALYZE, ___) SELECT ...;"
    blanks: ["BUFFERS"]
    accepted: [["BUFFERS"], ["buffers"]]
    explanation: "BUFFERS mostra leitura de cache e disco. ANALYZE executa a consulta; em DML, use transação com rollback."
---

# Lab: Caça à query lenta

O relatório de vendas da Padaria Byte demora dezenas de segundos desde que a base cresceu. O laboratório entrega um PostgreSQL com `pg_stat_statements` habilitado, a tabela `pedidos` populada e um índice duplicado escondido. Seu trabalho é encontrar a consulta cara, corrigir sem bloquear escritas e provar que o plano mudou.

Comece confirmando que a extensão está ativa: `SHOW shared_preload_libraries;` e `SELECT * FROM pg_stat_statements;`. Ordene pelo tempo total para achar o maior consumidor. Não confie só na média: uma consulta rápida chamada muitas vezes pode ser a verdadeira vilã. Anote o texto normalizado e o número de chamadas.

Depois, use `EXPLAIN (ANALYZE, BUFFERS)` para ver o plano. Procure `Seq Scan` em uma tabela grande, filtros seletivos sem índice e estimativas muito distantes do real. Crie o índice adequado com `CREATE INDEX CONCURRENTLY`. Confirme que ele está válido e que o plano passou a usar `Index Scan` ou `Bitmap Index Scan`.

Por fim, procure o índice duplicado `idx_pedidos_cliente_dup`. Remova-o com `DROP INDEX CONCURRENTLY` e verifique se não era usado por outra consulta. O objetivo bônus existe para lembrar que tuning também é remover o que sobra. A verificação automática consulta o catálogo e o plano, não a sua explicação.

## Por que isso importa

Este é o fluxo real de otimização: medir, explicar, corrigir e comprovar. Pular a medição leva a criar índices inúteis; pular a verificação deixa dúvida sobre o ganho.

## Conceitos-chave

- **pg_stat_statements:** priorização por custo.
- **EXPLAIN ANALYZE:** tempo real.
- **CONCURRENTLY:** criação e remoção sem bloqueio forte.
- **pg_index:** validade do índice.
- **Índice duplicado:** custo sem benefício.

## Erros comuns

Criar índice sem medir. Usar CREATE INDEX comum em horário de pico. Esquecer de validar o índice. Remover índice usado por relatório mensal.

## Checklist de domínio

- [ ] Sei achar a consulta mais cara.
- [ ] Sei justificar o índice pelo plano.
- [ ] Sei criar índice concurrente.
- [ ] Sei comprovar a mudança e remover duplicata.

## Resumo

O lab treina o ciclo completo de desempenho. Meça, leia o plano, crie o índice certo, verifique o resultado e remova o desperdício. O painel mostra os objetivos automáticos.
