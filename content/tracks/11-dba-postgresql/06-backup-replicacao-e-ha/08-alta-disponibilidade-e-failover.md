---
slug: "alta-disponibilidade-e-failover"
title: "Alta disponibilidade e failover"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["replicacao-streaming"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que é split-brain?"
    options:
      - "Dois nós acreditarem ser o primário ao mesmo tempo"
      - "Uma réplica ficar atrasada"
      - "O disco de WAL encher"
      - "Um índice ser corrompido"
    answerIndex: 0
    explanation: "Split-brain gera dois primários aceitando escritas e dados divergentes. Fencing e consenso tentam impedir esse cenário."
  - type: true_false
    xp: 8
    statement: "Basta ter uma réplica para ter alta disponibilidade automática."
    answer: false
    explanation: "É preciso detectar a falha, promover, redirecionar aplicações e evitar split-brain. Sem automação e teste, a réplica é apenas uma cópia."
  - type: match
    xp: 12
    question: "Relacione o componente à função em HA."
    pairs:
      - ["Consenso", "Evita que dois nós se declarem primários"]
      - ["Fencing", "Isola o nó antigo para não escrever"]
      - ["HAProxy", "Redireciona conexões para o nó ativo"]
      - ["Teste de failover", "Comprova que a troca funciona"]
    explanation: "HA combina detecção, decisão, isolamento e redirecionamento. Testar é a única forma de confiar no conjunto."
---

# Alta disponibilidade e failover

Alta disponibilidade significa manter o serviço no ar apesar de falhas. Ter uma réplica é apenas uma peça. É preciso detectar que o primário caiu, escolher um novo primário, promovê-lo, redirecionar aplicações e impedir que o nó antigo volte a aceitar escritas. Sem essa coordenação, o resultado pode ser **split-brain**: dois primários com dados divergentes.

Ferramentas como Patroni, repmgr e pg_auto_failover automatizam parte do processo. Elas usam um serviço de consenso (etcd, Consul, ZooKeeper) para decidir quem é o líder. **Fencing** isola o nó antigo, por exemplo desligando a máquina ou bloqueando a rede. Um proxy ou IP virtual redireciona as conexões.

A aplicação precisa colaborar. Strings de conexão com múltiplos hosts e `target_session_attrs=read-write` ajudam a encontrar o primário. Transações em andamento durante o failover podem falhar; a aplicação deve ter retry idempotente. Conexões antigas para o nó promovido podem precisar ser recriadas.

O único jeito de confiar é testar. Faça game days: derrube o primário, observe a promoção, valide o redirecionamento e meça o tempo de indisponibilidade. Documente o runbook e os critérios de decisão. HA não é um produto que se instala; é um processo testado.

## Por que isso importa

Uma promoção malfeita pode causar perda de dados ou indisponibilidade maior que a falha original. O DBA precisa entender o mecanismo, não só a ferramenta.

## Conceitos-chave

- **HA:** continuidade do serviço.
- **Failover:** troca para outro nó.
- **Split-brain:** dois primários.
- **Fencing:** isolamento do nó antigo.
- **Consenso:** decisão distribuída.
- **Game day:** teste controlado de falha.

## Erros comuns

Promover sem fencing. Não testar redirecionamento. Assumir que a aplicação reconecta sozinha. Ignorar transações em voo. Confundir DR com HA.

## Checklist de domínio

- [ ] Sei explicar o risco de split-brain.
- [ ] Sei citar o papel do consenso e do fencing.
- [ ] Sei planejar redirecionamento.
- [ ] Sei executar um teste de failover.

## Resumo

HA exige detecção, promoção, isolamento e redirecionamento. Ferramentas ajudam, mas o processo precisa ser testado. Split-brain é o cenário a evitar.
