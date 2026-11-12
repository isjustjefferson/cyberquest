---
slug: "estatisticas-e-analyze"
title: "Estatísticas e ANALYZE"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["explain-e-planos-de-execucao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que ANALYZE atualiza?"
    options:
      - "Os índices da tabela"
      - "As estatísticas usadas pelo planejador"
      - "As permissões dos papéis"
      - "O arquivo pg_hba.conf"
    answerIndex: 1
    explanation: "ANALYZE coleta distribuição, n_distinct, histogramas e valores mais comuns. Essas estatísticas alimentam as estimativas de custo."
  - type: true_false
    xp: 8
    statement: "Depois de importar milhões de linhas, é boa prática executar ANALYZE."
    answer: true
    explanation: "Cargas grandes mudam a distribuição. Sem ANALYZE, o planejador continua usando um retrato antigo e pode escolher um plano ruim."
  - type: match
    xp: 12
    question: "Relacione o conceito à sua função."
    pairs:
      - ["pg_stats", "Visão com estatísticas por coluna"]
      - ["n_distinct", "Número estimado de valores distintos"]
      - ["default_statistics_target", "Granularidade padrão da coleta"]
      - ["CREATE STATISTICS", "Estatísticas estendidas para colunas correlacionadas"]
    explanation: "Estatísticas descrevem a distribuição. Quando colunas são correlacionadas, estatísticas estendidas ajudam o planejador a estimar melhor."
---

# Estatísticas e ANALYZE

O planejador não varre a tabela a cada consulta para descobrir quantas linhas existem. Ele consulta um resumo: número de linhas, número de páginas, valores distintos, valores mais comuns e histogramas. `ANALYZE` coleta esse resumo. O autovacuum também executa `ANALYZE` depois de certa quantidade de mudanças, mas cargas em massa podem precisar de uma execução manual.

A visão `pg_stats` mostra o que o planejador sabe por coluna. `n_distinct` estima quantos valores diferentes existem; os valores mais comuns aparecem em `most_common_vals` e `most_common_freqs`; os histogramas resumem a distribuição do restante. Uma coluna com forte correlação entre duas dimensões, como cidade e estado, pode enganar o planejador se cada coluna for analisada isoladamente.

`default_statistics_target` controla a granularidade padrão. Valores maiores melhoram a estimativa e aumentam o custo de `ANALYZE` e o tamanho das estatísticas. Para colunas específicas, use `ALTER TABLE ... ALTER COLUMN ... SET STATISTICS`. Para correlação, `CREATE STATISTICS` cria estatísticas multivariadas que o planejador pode usar.

A regra prática é: depois de grandes cargas, mudanças de distribuição ou criação de tabelas novas, rode `ANALYZE`. Em tabelas particionadas, analise as partições relevantes. Estatísticas ruins não causam erro de SQL; causam planos silenciosamente ruins, que aparecem como lentidão difícil de explicar.

## Por que isso importa

Muitos "problemas de índice" são, na verdade, problemas de estimativa. Atualizar estatísticas é barato e resolve casos em que o índice existe, mas o planejador não o escolhe.

## Conceitos-chave

- **ANALYZE:** coleta estatísticas.
- **pg_stats:** visão por coluna.
- **n_distinct:** cardinalidade estimada.
- **Histograma:** distribuição de valores.
- **Estatísticas estendidas:** correlação entre colunas.
- **statistics target:** granularidade.

## Erros comuns

Confundir VACUUM com ANALYZE. Rodar ANALYZE só uma vez após a carga inicial. Aumentar statistics target em todas as colunas sem necessidade. Ignorar correlação entre colunas.

## Checklist de domínio

- [ ] Sei explicar o que ANALYZE coleta.
- [ ] Sei consultar pg_stats.
- [ ] Sei quando aumentar o target.
- [ ] Sei quando usar estatísticas estendidas.

## Resumo

O planejador decide com estatísticas. ANALYZE mantém esse retrato atualizado; pg_stats mostra o que ele sabe. Distribuição e correlação explicam muitas estimativas erradas.
