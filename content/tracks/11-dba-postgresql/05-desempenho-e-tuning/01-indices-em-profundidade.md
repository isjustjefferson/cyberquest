---
slug: "indices-em-profundidade"
title: "Índices em profundidade"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["estrutura-de-diretorios-e-catalogos"]
lab_slug: null
exercises:
  - type: match
    xp: 14
    question: "Relacione o tipo de índice ao caso de uso mais típico."
    pairs:
      - ["B-tree", "Igualdade, faixas e ordenação"]
      - ["GIN", "JSONB, arrays e busca textual"]
      - ["BRIN", "Tabelas enormes e ordenadas por uma coluna"]
      - ["GiST", "Dados geométricos e buscas por proximidade"]
      - ["Hash", "Igualdade simples, sem ordenação"]
    explanation: "B-tree é o padrão. GIN indexa múltiplos valores; BRIN usa resumos de blocos; GiST atende tipos complexos; hash cobre igualdade."
  - type: single_choice
    xp: 10
    question: "Um índice composto em (a, b) ajuda uma consulta que filtra apenas por b?"
    options:
      - "Sim, sempre"
      - "Em geral, não, por causa da regra do prefixo mais à esquerda"
      - "Sim, desde que b seja texto"
      - "Somente se o índice for UNIQUE"
    answerIndex: 1
    explanation: "A ordem das colunas importa. O índice começa por a; sem filtro em a, o planejador normalmente não usa o índice para b."
  - type: multi_choice
    xp: 12
    question: "Quais índices tendem a ser bons candidatos para remoção?"
    options:
      - "Índices duplicados que cobrem as mesmas colunas"
      - "Índices nunca usados segundo pg_stat_user_indexes"
      - "Índices parciais pequenos e usados"
      - "Índices que só repetem o prefixo de outro índice maior"
    answerIndexes: [0, 1, 3]
    explanation: "Índices custam espaço e escrita. Duplicados, nunca usados e prefixos redundantes são candidatos, desde que a análise considere o ciclo completo de carga."
---

# Índices em profundidade

Índice é uma estrutura auxiliar que permite encontrar linhas sem varrer a tabela inteira. O B-tree é o padrão e atende igualdade, faixas, ordenação e prefixos de texto. Hash serve igualdade simples. GIN indexa valores múltiplos, como JSONB, arrays e vetores de busca textual. GiST atende geometria e tipos complexos. BRIN guarda resumos por bloco e brilha em tabelas enormes e naturalmente ordenadas, como séries temporais.

A ordem das colunas em um índice composto é decisiva. `(cliente_id, criado_em)` atende consultas que filtram por `cliente_id` e ordenam por `criado_em`; também atende apenas `cliente_id`. Já uma consulta que filtra só por `criado_em` normalmente não usa esse índice, pela regra do prefixo mais à esquerda. Pense no índice como uma lista telefônica ordenada por sobrenome e depois nome.

Índices parciais incluem apenas linhas que satisfazem uma condição. `CREATE INDEX ... ON pedidos (cliente_id) WHERE status = 'pendente'` fica pequeno e acelera exatamente a fila de pendentes. Índices de expressão indexam o resultado de uma função, como `lower(email)`, e só ajudam se a consulta usar a mesma expressão. `INCLUDE` adiciona colunas ao índice para permitir *index-only scan*.

Todo índice tem custo: espaço, manutenção e impacto em INSERT, UPDATE e DELETE. Monitore `pg_stat_user_indexes` e o tamanho com `pg_total_relation_size`. Remova o que não serve, mas cuidado com índices sazonais ou usados por relatórios mensais. `REINDEX CONCURRENTLY` reconstrói sem bloquear escritas.

## Por que isso importa

Um índice errado não acelera e ainda deixa a escrita mais lenta. O DBA escolhe índice a partir da consulta, da seletividade e do plano, não por receita.

## Conceitos-chave

- **B-tree:** padrão para igualdade, faixa e ordem.
- **GIN:** múltiplos valores por linha.
- **BRIN:** resumo de blocos para dados ordenados.
- **Índice parcial:** subconjunto por WHERE.
- **Prefixo mais à esquerda:** ordem das colunas limita o uso.
- **REINDEX CONCURRENTLY:** reconstrução sem bloqueio forte.

## Erros comuns

Criar índice para toda coluna. Ignorar a ordem em índices compostos. Indexar expressão diferente da consulta. Remover índice sem observar um ciclo completo de uso.

## Checklist de domínio

- [ ] Sei escolher o tipo de índice pelo padrão de consulta.
- [ ] Sei explicar o prefixo mais à esquerda.
- [ ] Sei quando usar índice parcial e de expressão.
- [ ] Sei avaliar custo e uso de um índice.

## Resumo

Índices servem consultas, não tabelas. Tipo, ordem, seletividade e custo definem a escolha. Meça o plano e monitore o uso antes de criar ou remover.
