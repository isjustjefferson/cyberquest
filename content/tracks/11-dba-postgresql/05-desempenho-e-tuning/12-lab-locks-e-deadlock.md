---
slug: "lab-locks-e-deadlock"
title: "Lab: Locks e deadlock"
kind: lab
difficulty: 4
est_minutes: 30
xp: 300
status: complete
prerequisites: ["locks-e-deadlocks"]
lab_slug: "locks-e-deadlock"
exercises:
  - type: single_choice
    xp: 10
    question: "Você precisa descobrir qual sessão bloqueia outra. Qual consulta ajuda diretamente?"
    options:
      - "SELECT pg_blocking_pids(pid) FROM pg_stat_activity;"
      - "SELECT * FROM pg_roles;"
      - "VACUUM FULL pedidos;"
      - "DROP TABLE pg_locks;"
    answerIndex: 0
    explanation: "pg_blocking_pids retorna os PIDs bloqueadores de uma sessão. Combine com pg_stat_activity para ver usuário, estado e consulta."
  - type: true_false
    xp: 10
    statement: "Um deadlock é um ciclo de espera; o PostgreSQL detecta e aborta uma das transações."
    answer: true
    explanation: "Diferente de uma espera longa, o deadlock nunca se resolve sozinho. O servidor escolhe uma vítima para liberar o ciclo."
  - type: order
    xp: 10
    question: "Ordene uma investigação segura de bloqueio."
    items:
      - "Confirmar o impacto e escolher a ação menos invasiva"
      - "Identificar a sessão bloqueada e os bloqueadores"
      - "Verificar a consulta e a transação de cada lado"
      - "Registrar o ocorrido e a prevenção"
    correctOrder: [1, 2, 0, 3]
    explanation: "Primeiro entenda o grafo de espera e o contexto; depois escolha cancelar, terminar ou aguardar; por fim documente."
---

# Lab: Locks e deadlock

O laboratório entrega duas sessões no mesmo PostgreSQL. Na primeira, uma transação fica aberta segurando um lock de linha. Na segunda, um `UPDATE` espera indefinidamente. Depois, você reproduz um deadlock e lê a mensagem no log. O objetivo é diagnosticar, resolver sem perder dados e entender como prevenir.

Para investigar, consulte `pg_stat_activity` e `pg_locks`. A coluna `wait_event_type` e `wait_event` mostra se a sessão espera lock, I/O ou outro recurso. `pg_blocking_pids(pid)` entrega os bloqueadores. Cruze os PIDs com usuário, aplicação, horário de início e consulta. Não encerre a primeira sessão que parecer suspeita: identifique qual é a origem e qual é a vítima.

A resolução depende do contexto. `pg_cancel_backend` interrompe a consulta e costuma ser suficiente para um relatório travado. `pg_terminate_backend` encerra a sessão e deve ser usado quando a transação está ociosa ou não responde. Em ambos os casos, confirme que a aplicação consegue repetir a operação com segurança.

Para reproduzir o deadlock, abra duas transações, faça cada uma segurar uma linha e depois tentar a linha da outra. O servidor detectará o ciclo e abortará uma. A mensagem do log é a evidência pedida pelo objetivo. Ao final, proponha prevenção: ordem consistente de acesso, transações curtas, processamento em lote e `lock_timeout`.

## Por que isso importa

Um lock esquecido pode congelar uma tabela inteira. O plantão exige diagnóstico rápido, ação mínima e comunicação clara.

## Conceitos-chave

- **pg_locks:** locks concedidos e pendentes.
- **pg_stat_activity:** sessões e estados.
- **pg_blocking_pids:** grafo direto de bloqueio.
- **cancel vs. terminate:** interromper consulta ou sessão.
- **Deadlock:** ciclo detectado e abortado.
- **lock_timeout:** falha rápida em vez de espera infinita.

## Erros comuns

Encerrar a sessão errada. Usar terminate para tudo. Ignorar a aplicação que reabre a transação. Não registrar a causa.

## Checklist de domínio

- [ ] Sei montar o grafo de bloqueio.
- [ ] Sei escolher cancel ou terminate.
- [ ] Sei reproduzir e ler um deadlock.
- [ ] Sei propor prevenção.

## Resumo

O lab treina diagnóstico e ação sob pressão. Leia locks, identifique bloqueadores, escolha a intervenção mínima e documente a prevenção. O painel valida os objetivos.
