---
slug: "explain-e-planos-de-execucao"
title: "EXPLAIN e planos de execução"
kind: lesson
difficulty: 3
est_minutes: 25
xp: 60
status: complete
prerequisites: ["indices-em-profundidade"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que EXPLAIN ANALYZE faz de diferente de EXPLAIN?"
    options:
      - "Executa a consulta e mostra tempos reais"
      - "Cria um índice automaticamente"
      - "Atualiza as estatísticas do planejador"
      - "Reescreve a consulta para a forma mais rápida"
    answerIndex: 0
    explanation: "EXPLAIN estima; ANALYZE executa. Por isso, cuidado ao rodar EXPLAIN ANALYZE em UPDATE ou DELETE: a alteração acontece de verdade."
  - type: match
    xp: 14
    question: "Relacione o nó do plano ao comportamento."
    pairs:
      - ["Seq Scan", "Varre a tabela inteira"]
      - ["Index Scan", "Percorre um índice e busca as linhas"]
      - ["Index Only Scan", "Responde só com o índice, quando possível"]
      - ["Bitmap Heap Scan", "Combina bits de índice e visita páginas"]
      - ["Hash Join", "Constrói uma tabela hash para a junção"]
    explanation: "Cada nó descreve uma estratégia. O custo e o tempo reais devem ser lidos junto com as linhas estimadas e reais."
  - type: true_false
    xp: 10
    statement: "Uma grande diferença entre rows estimadas e rows reais costuma indicar estatísticas inadequadas ou correlação entre colunas."
    answer: true
    explanation: "O planejador decide com estatísticas. Quando a estimativa erra muito, o plano escolhido pode ser ruim; ANALYZE ou estatísticas estendidas podem corrigir."
---

# EXPLAIN e planos de execução

`EXPLAIN` mostra como o planejador pretende executar uma consulta. A saída é uma árvore: os nós mais internos produzem linhas que alimentam os externos. Leia de baixo para cima e observe o custo, o número de linhas estimadas e a largura média. `EXPLAIN (ANALYZE, BUFFERS)` executa a consulta e traz tempo real, linhas reais, loops e acesso a buffers.

Os nós contam a história. `Seq Scan` lê a tabela inteira; pode ser ótimo para tabelas pequenas ou consultas que retornam grande parte das linhas. `Index Scan` percorre o índice e busca as páginas da tabela. `Index Only Scan` evita a tabela quando todas as colunas estão no índice e o *visibility map* está favorável. `Bitmap Heap Scan` combina índices e visita páginas em ordem física. Junções aparecem como `Nested Loop`, `Hash Join` ou `Merge Join`, cada uma com custo diferente conforme o volume.

O sinal mais valioso é a discrepância entre linhas estimadas (`rows=`) e reais (`actual rows=`). Se o planejador espera 10 linhas e encontra 100 mil, escolheu um plano baseado em ficção. As causas comuns são estatísticas desatualizadas, dados correlacionados, expressões opacas e parâmetros genéricos. A correção pode ser `ANALYZE`, estatísticas estendidas, reescrita da consulta ou índice adequado.

Cuidado com efeitos colaterais. `EXPLAIN ANALYZE` em `UPDATE`, `DELETE` ou `INSERT` altera dados. Para investigar com segurança, abra uma transação, execute o comando e faça `ROLLBACK`. Em produção, meça com consultas reais ou em réplica, respeitando o custo de rodar a consulta novamente.

## Por que isso importa

Sem ler planos, o tuning vira tentativa e erro. O plano mostra se o problema é falta de índice, estatística ruim, junção inadequada ou volume excessivo.

## Conceitos-chave

- **Custo estimado:** unidade relativa do planejador.
- **ANALYZE:** executa e coleta tempo real.
- **BUFFERS:** mostra leitura de cache e disco.
- **rows estimado vs. real:** principal sinal de estimativa ruim.
- **loops:** repetições de um nó interno.
- **Rollback seguro:** evita alterar dados ao analisar DML.

## Erros comuns

Ler só o custo total e ignorar linhas reais. Rodar EXPLAIN ANALYZE em DELETE sem transação. Concluir que Seq Scan é sempre ruim. Ignorar buffers e I/O.

## Checklist de domínio

- [ ] Sei ler uma árvore de plano.
- [ ] Sei diferenciar estimativa e execução real.
- [ ] Sei identificar discrepância de linhas.
- [ ] Sei investigar DML com rollback.

## Resumo

Planos explicam decisões do planejador. Compare estimado e real, leia os nós e os buffers. Corrija estatísticas antes de culpar o banco.
