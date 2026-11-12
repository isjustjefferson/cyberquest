---
slug: "lab-resgate-padaria-byte"
title: "Lab final: O plantão da Padaria Byte"
kind: lab
difficulty: 5
est_minutes: 60
xp: 500
status: complete
prerequisites: ["monitoramento-metricas-chave", "resposta-a-incidentes-de-banco", "seguranca-e-hardening-de-banco"]
lab_slug: "resgate-padaria-byte"
exercises:
  - type: order
    xp: 14
    question: "Ordene a triagem de um incidente com o site fora do ar."
    items:
      - "Verificar conexões, locks e consultas em execução"
      - "Confirmar o impacto e iniciar a comunicação"
      - "Aplicar a mitigação menos invasiva"
      - "Registrar a linha do tempo e a causa provável"
    correctOrder: [1, 0, 2, 3]
    explanation: "Primeiro dimensione e comunique; depois investigue, mitigue e registre. A ordem evita ações cegas."
  - type: single_choice
    xp: 12
    question: "O que fazer antes de encerrar sessões que consomem conexões?"
    options:
      - "Identificar quais são da aplicação, o estado e a consulta"
      - "Encerrar todas as sessões imediatamente"
      - "Aumentar max_connections para 10.000"
      - "Reiniciar o servidor"
    answerIndex: 0
    explanation: "Sem identificar a origem, você pode derrubar a aplicação inteira ou mascarar um vazamento de conexões."
  - type: true_false
    xp: 10
    statement: "O post-mortem deve focar em causas e ações, não em culpar pessoas."
    answer: true
    explanation: "Cultura sem culpa produz informação honesta. O objetivo é evitar recorrência, não punir."
  - type: multi_choice
    xp: 14
    question: "Quais evidências ajudam a corrigir uma regra trust aberta?"
    options:
      - "pg_hba.conf e pg_hba_file_rules"
      - "Logs de conexão e usuários"
      - "A aplicação que precisa continuar acessando"
      - "A lista de produtos da padaria"
      - "Teste de conexão após a mudança"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Regras, logs, dependências e validação formam o conjunto. Catálogo de produtos é irrelevante para o acesso."
  - type: single_choice
    xp: 12
    question: "Para recuperar pedidos apagados por um DELETE sem WHERE, a melhor combinação é…"
    options:
      - "Backup/PITR e validação de contagem"
      - "VACUUM FULL"
      - "Criar um índice"
      - "Aumentar work_mem"
    answerIndex: 0
    explanation: "O DELETE é uma alteração lógica; recuperação exige backup e WAL até antes do comando, com validação do estado."
---

# Lab final: O plantão da Padaria Byte

São 3h da manhã de uma Black Friday. O site da Padaria Byte está lento e, minutos depois, fora do ar. Você é o DBA de plantão. O laboratório entrega uma workstation e um PostgreSQL com problemas encadeados; cada fase só libera a próxima quando você conclui a anterior.

**Fase 1 — Conexões esgotadas.** A aplicação não conecta. Use `pg_stat_activity` para descobrir quem consome as conexões, identifique sessões ociosas em transação e encerre apenas a culpada. O objetivo automático confirma que `app_rw` volta a conectar.

**Fase 2 — Consulta lenta.** O site responde, mas devagar. Encontre a consulta de maior custo em `pg_stat_statements`, leia o plano e crie o índice adequado com `CREATE INDEX CONCURRENTLY`. Meça antes e depois.

**Fase 3 — Bloat e transação esquecida.** Uma tabela crítica cresceu. Há uma transação antiga segurando a limpeza. Libere-a, ajuste o autovacuum da tabela e confirme a redução de tuplas mortas.

**Fase 4 — Acesso indevido.** Uma regra `trust` aberta permite conexão sem senha. Descubra via log e `pg_hba.conf`, corrija sem derrubar a aplicação e valide o acesso legítimo.

**Fase 5 — Desastre.** Um `DELETE` sem `WHERE` apagou pedidos da última hora. Restaure usando o backup e o WAL fornecidos até o instante anterior, ou o dump indicado pela variante. Comprove a contagem.

**Fase 6 — Post-mortem.** Escreva causa, impacto, linha do tempo e ações preventivas. O campo é avaliado por itens esperados e concede bônus.

Registre cada passo. Em um incidente real, a comunicação e o registro são tão importantes quanto o comando. O painel mostra os objetivos e o XP de cada fase.

## Por que isso importa

Este lab reúne administração, desempenho, segurança e recuperação. É o teste final de plantão: diagnosticar sob pressão, agir com o mínimo necessário e aprender com o ocorrido.

## Conceitos-chave

- **triagem de conexões**
- **pg_stat_statements**
- **índice CONCURRENTLY**
- **autovacuum e transação longa**
- **pg_hba.conf**
- **PITR**
- **post-mortem**

## Erros comuns

Reiniciar sem investigar. Encerrar sessões em massa. Apagar WAL. Promover sem validar. Pular o post-mortem.

## Checklist de domínio

- [ ] Sei diagnosticar conexões esgotadas.
- [ ] Sei otimizar com evidência.
- [ ] Sei corrigir acesso sem derrubar a aplicação.
- [ ] Sei recuperar dados com backup e WAL.
- [ ] Sei escrever um post-mortem útil.

## Resumo

O plantão combina contenção, diagnóstico, mitigação e recuperação. Cada fase exige evidência e validação. Ao final, o post-mortem fecha o ciclo de aprendizado.
