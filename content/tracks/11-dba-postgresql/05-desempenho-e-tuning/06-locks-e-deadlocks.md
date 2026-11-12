---
slug: "locks-e-deadlocks"
title: "Locks e deadlocks"
kind: lesson
difficulty: 4
est_minutes: 20
xp: 60
status: complete
prerequisites: ["mvcc-e-vacuum"]
lab_slug: "locks-e-deadlock"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual função mostra os PIDs que estão bloqueando uma sessão?"
    options:
      - "pg_blocking_pids()"
      - "pg_terminate_backend()"
      - "pg_stat_user_tables()"
      - "pg_reload_conf()"
    answerIndex: 0
    explanation: "pg_blocking_pids(pid) retorna os processos que seguram locks necessários. pg_terminate_backend encerra a sessão, mas não diagnostica."
  - type: order
    xp: 14
    question: "Ordene a sequência que forma um deadlock clássico."
    items:
      - "A transação B tenta atualizar a linha 1 e espera"
      - "A transação A atualiza a linha 1 e mantém o lock"
      - "O PostgreSQL detecta o ciclo e aborta uma transação"
      - "A transação B atualiza a linha 2 e mantém o lock"
      - "A transação A tenta atualizar a linha 2 e espera"
    correctOrder: [1, 3, 0, 4, 2]
    explanation: "Cada transação segura uma linha e espera a outra. O ciclo de espera é um deadlock; o servidor detecta e encerra uma das partes."
  - type: multi_choice
    xp: 12
    question: "Quais medidas reduzem deadlocks?"
    options:
      - "Acessar tabelas e linhas em ordem consistente"
      - "Manter transações curtas"
      - "Usar lock_timeout para falhar rápido"
      - "Executar DDL em horário de pico"
      - "Abrir transações e esperar entrada do usuário"
    answerIndexes: [0, 1, 2]
    explanation: "Ordem consistente evita ciclos; transações curtas reduzem a janela; lock_timeout evita espera infinita. DDL em pico e transações interativas aumentam o risco."
---

# Locks e deadlocks

Locks protegem dados e objetos durante alterações. Um `UPDATE` adquire lock de linha; um `SELECT ... FOR UPDATE` reserva linhas para alteração posterior. Locks de tabela vão de `ACCESS SHARE`, usado por leituras, até `ACCESS EXCLUSIVE`, usado por operações como `DROP TABLE` e `ALTER TABLE`. Quanto mais forte o lock, menos concorrência ele permite.

A fila de locks é parte do problema. Um `ALTER TABLE` esperando `ACCESS EXCLUSIVE` bloqueia as novas consultas atrás dele, mesmo que elas só precisem de `ACCESS SHARE`. A tabela parece congelar. Por isso migrações usam `lock_timeout` e, quando possível, operações online. Sempre saiba qual lock seu comando pede e por quanto tempo pretende mantê-lo.

Um **deadlock** ocorre quando duas transações seguram recursos e cada uma espera pelo recurso da outra. O PostgreSQL detecta o ciclo e aborta uma das transações, liberando o restante. Já a espera comum pode durar indefinidamente. Para diagnosticar, junte `pg_locks` com `pg_stat_activity` e use `pg_blocking_pids(pid)`. `pg_cancel_backend` interrompe a consulta; `pg_terminate_backend` encerra a sessão. Prefira o mais suave que resolve.

As melhores prevenções são de desenho: transações curtas, acesso na mesma ordem, processamento em lotes, `SKIP LOCKED` para filas e timeout configurado. Em produção, um deadlock eventual é normal; uma epidemia indica padrão de acesso inconsistente ou transações longas.

## Por que isso importa

Locks mal compreendidos causam indisponibilidade total em uma tabela. Diagnosticar bloqueios e evitar deadlocks é parte essencial do plantão.

## Conceitos-chave

- **Lock de linha:** reserva uma linha específica.
- **ACCESS EXCLUSIVE:** bloqueia leituras e escritas.
- **Fila de locks:** novas consultas esperam atrás de um lock forte.
- **pg_blocking_pids:** identifica bloqueadores.
- **Deadlock:** ciclo de espera detectado e abortado.
- **lock_timeout:** limita a espera.

## Erros comuns

Rodar DDL sem timeout em horário de pico. Encerrar a sessão errada. Usar transações interativas. Ignorar a ordem de acesso entre tabelas.

## Checklist de domínio

- [ ] Sei identificar quem bloqueia quem.
- [ ] Sei diferenciar cancel e terminate.
- [ ] Sei explicar um deadlock.
- [ ] Sei aplicar prevenção com ordem e timeout.

## Resumo

Locks protegem e também enfileiram. Deadlocks são ciclos detectados pelo servidor. Diagnostique com pg_locks e pg_blocking_pids e previna com transações curtas e ordem consistente.
