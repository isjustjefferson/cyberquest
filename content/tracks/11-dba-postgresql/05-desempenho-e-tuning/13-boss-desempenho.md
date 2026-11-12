---
slug: "boss-desempenho"
title: "Boss: Desempenho"
kind: boss
difficulty: 4
est_minutes: 15
xp: 100
status: complete
prerequisites: ["indices-em-profundidade", "explain-e-planos-de-execucao", "mvcc-e-vacuum", "locks-e-deadlocks", "tuning-de-configuracao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 12
    question: "Uma consulta filtra por status e ordena por criado_em. Qual índice composto é o melhor ponto de partida?"
    options:
      - "(criado_em, status)"
      - "(status, criado_em)"
      - "(status)"
      - "(criado_em)"
    answerIndex: 1
    explanation: "A igualdade em status vem primeiro; criado_em atende a ordenação dentro do subconjunto filtrado."
  - type: match
    xp: 12
    question: "Relacione o sintoma à causa provável."
    pairs:
      - ["rows estimado muito menor que o real", "Estatísticas desatualizadas ou correlação"]
      - ["Seq Scan em tabela grande com filtro seletivo", "Índice ausente ou inadequado"]
      - ["Tabela cresce após muitos UPDATEs", "Bloat por tuplas mortas"]
      - ["Consultas novas esperam atrás de um ALTER TABLE", "Fila de lock ACCESS EXCLUSIVE"]
    explanation: "Cada sintoma aponta para uma investigação diferente. O plano e as estatísticas ajudam a separar as causas."
  - type: true_false
    xp: 10
    statement: "Aumentar work_mem globalmente é uma forma segura de acelerar todas as ordenações."
    answer: false
    explanation: "work_mem é por operação e por sessão. Com muitas conexões e múltiplas operações, o consumo pode explodir."
  - type: single_choice
    xp: 12
    question: "O que fazer primeiro ao perceber bloat em uma tabela crítica?"
    options:
      - "Rodar VACUUM FULL imediatamente em produção"
      - "Investigar transações longas e o comportamento do autovacuum"
      - "Criar mais índices"
      - "Aumentar max_connections"
    answerIndex: 1
    explanation: "Antes de reescrever, descubra por que a limpeza não acontece. Uma transação longa pode ser a causa raiz."
  - type: order
    xp: 12
    question: "Ordene um ciclo de otimização baseado em evidências."
    items:
      - "Medir o resultado e comparar com a linha de base"
      - "Identificar a consulta de maior impacto"
      - "Ler o plano e formular a hipótese"
      - "Aplicar uma mudança controlada"
    correctOrder: [1, 2, 3, 0]
    explanation: "Priorize, entenda, mude e meça. Sem linha de base, não há como provar ganho."
  - type: multi_choice
    xp: 12
    question: "Quais sinais merecem investigação de desempenho?"
    options:
      - "Aumento de tuplas mortas e tamanho da tabela"
      - "Consultas com tempo total alto"
      - "Sessões idle in transaction antigas"
      - "Todos os índices com uso zero em qualquer janela de cinco minutos"
      - "Espera frequente por locks"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Bloat, custo agregado, transações ociosas e locks são sinais fortes. Uso zero em janela curta não prova que um índice é inútil."
  - type: single_choice
    xp: 10
    question: "Qual é o efeito de CREATE INDEX CONCURRENTLY?"
    options:
      - "Cria o índice sem bloquear escritas por todo o período"
      - "Cria o índice mais rápido que o normal"
      - "Dispensa a necessidade de ANALYZE"
      - "Cria o índice apenas em réplicas"
    answerIndex: 0
    explanation: "CONCURRENTLY reduz o lock, mas custa mais tempo e exige verificar se o índice ficou válido."
  - type: true_false
    xp: 10
    statement: "EXPLAIN ANALYZE em um DELETE altera dados, a menos que seja executado dentro de uma transação com rollback."
    answer: true
    explanation: "ANALYZE executa o comando. Em DML, use BEGIN, EXPLAIN ANALYZE e ROLLBACK para investigar sem persistir a mudança."
---

# Boss: Desempenho

Este boss reúne os sinais que um DBA usa para diagnosticar lentidão. A regra central é não otimizar por intuição: meça a consulta, leia o plano, verifique estatísticas, observe bloat e locks. O mesmo sintoma pode ter causas diferentes; o plano e os contadores ajudam a separar.

Índices respondem a padrões de filtro e ordenação. Um índice composto só ajuda na ordem certa. Estatísticas atualizadas evitam que o planejador escolha um caminho baseado em estimativas ruins. MVCC e autovacuum mantêm o espaço sob controle. Locks explicam esperas que não aparecem no tempo de CPU.

Ao final, você deve conseguir olhar para um cenário e propor um próximo passo seguro. Seguro significa: medir antes, mudar uma coisa, verificar depois e saber reverter. Em produção, a pressa frequentemente transforma um problema de desempenho em um incidente maior.

## Checklist de domínio

- [ ] Sei escolher índice a partir do filtro e da ordem.
- [ ] Sei ler estimativa versus execução real.
- [ ] Sei relacionar bloat a transações e autovacuum.
- [ ] Sei investigar locks e deadlocks.
- [ ] Sei medir o efeito de um ajuste.

## Resumo

Desempenho é investigação. Priorize pelo impacto, confirme no plano, ajuste uma variável e comprove. Índice, estatística, vacuum e lock são partes do mesmo sistema.
