---
slug: "monitoramento-metricas-chave"
title: "Monitoramento e métricas-chave"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["tuning-de-configuracao", "pg-stat-statements-e-diagnostico"]
lab_slug: null
exercises:
  - type: multi_choice
    xp: 12
    question: "Quais sinais são essenciais no painel de um DBA?"
    options:
      - "Conexões usadas versus max_connections"
      - "Disco e crescimento do WAL"
      - "Atraso de replicação"
      - "Quantidade de seguidores no blog"
      - "Idade da transação mais antiga e tuplas mortas"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Conexões, disco/WAL, replicação e saúde do vacuum são sinais de risco. Métricas de vaidade não orientam operação."
  - type: single_choice
    xp: 10
    question: "Por que cada alerta deve ter um runbook?"
    options:
      - "Para que quem for acionado saiba exatamente o que fazer"
      - "Para aumentar o número de alertas"
      - "Para substituir o monitoramento"
      - "Para eliminar a necessidade de plantão"
    answerIndex: 0
    explanation: "Alerta sem ação vira ruído. O runbook transforma o sinal em procedimento e reduz o tempo de resposta."
  - type: match
    xp: 12
    question: "Relacione a visão à informação."
    pairs:
      - ["pg_stat_activity", "Sessões e consultas em execução"]
      - ["pg_stat_database", "Transações, leituras e cache por banco"]
      - ["pg_stat_user_tables", "Tuplas mortas e vacuum por tabela"]
      - ["pg_stat_replication", "Estado e atraso das réplicas"]
      - ["pg_stat_io", "Atividade de I/O por backend e contexto"]
    explanation: "Cada visão responde a uma pergunta diferente. Combine-as para formar um diagnóstico."
  - type: true_false
    xp: 8
    statement: "A taxa de acerto de cache deve ser analisada junto com o tipo de carga e o tamanho do working set."
    answer: true
    explanation: "Um número alto ou baixo isolado não diz tudo. Carga analítica pode ter mais leituras físicas sem estar doente."
  - type: fill_command
    xp: 10
    question: "Complete a expressão que mede a idade da transação mais antiga em uma visão de vacuum."
    template: "SELECT max(age(___)) FROM pg_class;"
    blanks: ["relfrozenxid"]
    accepted: [["relfrozenxid"]]
    explanation: "age(relfrozenxid) indica o quão antiga é a referência de congelamento. Valores altos aumentam o risco de wraparound."
---

# Monitoramento e métricas-chave

Monitorar é escolher poucos sinais que antecipam problemas. O DBA olha para cinco áreas: **conexões**, **disco e WAL**, **atraso de replicação**, **saúde do vacuum** e **latência das consultas**. Cada uma responde a uma pergunta diferente e juntas formam o painel mínimo.

`pg_stat_activity` mostra sessões, estados e consultas. `pg_stat_database` traz transações, blocos lidos e cache por banco. `pg_stat_user_tables` revela tuplas mortas, último vacuum e último analyze. `pg_stat_replication` mostra réplicas e atraso. `pg_stat_io`, disponível em versões recentes, detalha I/O por backend. `pg_stat_statements` agrega custo de consultas.

Métricas precisam de contexto. Taxa de acerto de cache alta é comum em OLTP, mas carga analítica pode ler mais do disco sem estar doente. Conexões perto do limite podem ser normais em pico e graves se nunca caem. Compare com a linha de base e com o histórico.

Alertas úteis têm limiar, janela e ação. "Uso de disco acima de 80% por 10 minutos" é acionável; "CPU alta" sem contexto gera ruído. Cada alerta aponta para um runbook com diagnóstico, mitigação e escalonamento. Revise os alertas: se ninguém age, remova ou ajuste.

Ferramentas como postgres_exporter, Prometheus e Grafana automatizam coleta e visualização. Elas não substituem o entendimento dos sinais. O painel serve para decidir, não para decorar.

## Por que isso importa

Problemas de banco aparecem primeiro nos sinais. Um painel enxuto e alertas acionáveis reduzem indisponibilidade e estresse no plantão.

## Conceitos-chave

- **Conexões:** uso versus limite.
- **Disco/WAL:** capacidade e crescimento.
- **Replicação:** atraso e estado.
- **Vacuum:** tuplas mortas e idade.
- **Latência:** custo por consulta.
- **Runbook:** ação para cada alerta.

## Erros comuns

Monitorar tudo e não olhar nada. Alertar sem ação. Ignorar linha de base. Confiar só em CPU. Não revisar limiares.

## Checklist de domínio

- [ ] Sei listar as cinco áreas essenciais.
- [ ] Sei associar visões a perguntas.
- [ ] Sei interpretar métricas com contexto.
- [ ] Sei escrever um alerta acionável.

## Resumo

Monitore conexões, disco/WAL, replicação, vacuum e latência. Cada alerta precisa de runbook. Contexto e linha de base transformam números em decisão.
