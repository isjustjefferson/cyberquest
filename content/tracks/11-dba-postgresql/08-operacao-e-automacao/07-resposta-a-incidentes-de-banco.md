---
slug: "resposta-a-incidentes-de-banco"
title: "Resposta a incidentes de banco"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: draft
prerequisites: ["seguranca-e-hardening-de-banco"]
lab_slug: null
exercises:
  - type: order
    xp: 14
    question: "Ordene a resposta a um disco cheio causado por WAL acumulado."
    items:
      - "Remover ou corrigir o slot/retenção que prende o WAL"
      - "Confirmar que não há backup nem recuperação em andamento"
      - "Verificar espaço e retomar a operação"
      - "Comunicar o incidente e registrar a causa"
    correctOrder: [1, 0, 2, 3]
    explanation: "Primeiro entenda por que o WAL está retido; depois libere a causa, confirme espaço e documente. Apagar arquivos manualmente é perigoso."
  - type: single_choice
    xp: 12
    question: "Qual atitude é perigosa ao ver pg_wal ocupando muito espaço?"
    options:
      - "Apagar os arquivos manualmente"
      - "Investigar slots e archive_command"
      - "Verificar backups em andamento"
      - "Aumentar o disco se necessário"
    answerIndex: 0
    explanation: "Apagar WAL pode impedir recuperação e quebrar réplicas. A causa precisa ser identificada e corrigida."
  - type: true_false
    xp: 8
    statement: "Durante um incidente, aumentar max_connections sem investigar quem consome conexões é uma boa primeira ação."
    answer: false
    explanation: "Aumentar o limite pode piorar consumo de memória e esconder vazamentos. Primeiro identifique a origem."
---

# Resposta a incidentes de banco

Incidentes comuns: disco cheio, conexões esgotadas, consulta descontrolada, lock em cascata, réplica atrasada, bloat extremo e corrupção. A ordem é **estancar**, **comunicar**, **corrigir** e **aprender**.

Disco cheio pode vir de WAL retido por slot órfão, logs ou backup. Nunca apague `pg_wal` manualmente. Conexões esgotadas pedem identificar consumidores, transações ociosas e pool. Consulta descontrolada pode exigir `pg_cancel_backend`; sessão travada pode exigir `pg_terminate_backend`. Evite `kill -9` no postmaster e `pg_resetwal` sem diagnóstico.

Comunique impacto e previsão. Registre a linha do tempo. Após estabilizar, faça post-mortem sem culpa: causa raiz, detecção, resposta e ações preventivas com responsáveis e prazos.

Na triagem, preserve evidências úteis: horário, PID, consulta, estado da réplica, espaço em disco e mudanças recentes. Declare o impacto em termos do serviço e dos dados, não só em mensagens técnicas. Mitigação pode ser temporária; deixe claro o risco e o próximo passo para corrigir a causa. Se não houver certeza, escolha a ação reversível e escale cedo. O post-mortem fecha o ciclo ao transformar um incidente em alertas, limites ou procedimentos que evitem a repetição.

## Por que isso importa

Sob pressão, ações impulsivas transformam um incidente em desastre. Procedimento e comunicação salvam dados e reputação.

## Conceitos-chave

- **triagem**
- **mitigação rápida**
- **pg_terminate_backend**
- **o que não fazer**
- **comunicação**
- **post-mortem**

## Erros comuns

Apagar WAL. Matar o postmaster com -9. Aumentar conexões sem análise. Promover sem fencing. Pular post-mortem.

## Checklist de domínio

- [ ] Sei priorizar contenção.
- [ ] Sei investigar antes de mudar limites.
- [ ] Sei evitar ações destrutivas.
- [ ] Sei conduzir post-mortem.

## Resumo

Incidentes pedem contenção, comunicação, correção e aprendizado. Entenda a causa antes de apagar ou reiniciar.
