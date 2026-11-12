---
slug: "rotinas-de-manutencao"
title: "Rotinas de manutenção"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["monitoramento-metricas-chave"]
lab_slug: null
exercises:
  - type: order
    xp: 12
    question: "Ordene as tarefas da mais frequente para a menos frequente."
    items:
      - "Teste completo de restauração e revisão de índices"
      - "Verificação diária de espaço e backups"
      - "Revisão semanal de consultas lentas"
    correctOrder: [1, 2, 0]
    explanation: "Diário verifica o básico; semanal analisa desempenho; mensal ensaia recuperação e revisa estruturas."
  - type: single_choice
    xp: 10
    question: "Para reconstruir um índice sem travar escritas, use…"
    options:
      - "REINDEX CONCURRENTLY"
      - "VACUUM FULL"
      - "TRUNCATE"
      - "DROP DATABASE"
    answerIndex: 0
    explanation: "REINDEX CONCURRENTLY reconstrói com bloqueios menores, ao custo de mais tempo e recursos."
---

# Rotinas de manutenção

Banco saudável tem calendário. Diariamente: verificar backups, espaço, WAL, conexões e alertas. Semanalmente: revisar consultas lentas, tuplas mortas, índices não usados e erros de log. Mensalmente: testar restauração, revisar permissões e planejar capacidade.

`VACUUM` e `ANALYZE` mantêm espaço e estatísticas. `REINDEX CONCURRENTLY` reconstrói índices com bloqueio reduzido. Limpeza de dados antigos controla crescimento. `pg_amcheck` ajuda a verificar integridade. Automatize com `pg_cron` ou cron do sistema e registre resultados.

Janelas de manutenção precisam de comunicação e critérios de reversão. Tarefas pesadas competem por I/O; agende com cuidado.

Um checklist deve registrar resultado, duração e responsável, não apenas marcar uma caixa. Se o backup ficou maior que o normal, se a replicação atrasou ou se o teste de integridade falhou, abra uma ação e acompanhe até resolver. `REINDEX CONCURRENTLY` pode deixar um índice inválido após falha; verifique `pg_index.indisvalid` antes de considerar a tarefa concluída. Toda rotina automatizada precisa de timeout, log de saída e alerta para falhas repetidas.

## Por que isso importa

Manutenção preventiva evita incidentes. Rotina escrita e registrada não depende da memória de uma pessoa.

## Conceitos-chave

- **checklist diário/semanal/mensal**
- **VACUUM/ANALYZE**
- **REINDEX CONCURRENTLY**
- **pg_amcheck**
- **pg_cron**
- **janela de manutenção**

## Erros comuns

Só agir em incidente. Esquecer teste de restore. Rodar tarefas pesadas no pico. Não registrar execução.

## Checklist de domínio

- [ ] Sei montar um calendário.
- [ ] Sei automatizar e registrar.
- [ ] Sei revisar índices e integridade.

## Resumo

Manutenção é rotina: verificar, limpar, reconstruir e testar. Automatize, registre e agende com cuidado.
