---
slug: "boss-operacao"
title: "Boss: Operação"
kind: boss
difficulty: 4
est_minutes: 15
xp: 100
status: draft
prerequisites: ["monitoramento-metricas-chave", "logs-e-auditoria", "rotinas-de-manutencao", "seguranca-e-hardening-de-banco", "resposta-a-incidentes-de-banco"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 12
    question: "O disco está em 95%. Qual é a primeira verificação?"
    options:
      - "Crescimento de WAL, logs e backups, além de slots de replicação"
      - "Criar um novo índice"
      - "Aumentar work_mem"
      - "Reiniciar o PostgreSQL"
    answerIndex: 0
    explanation: "Antes de agir, descubra o que está consumindo espaço. WAL retido por slot órfão é uma causa comum."
  - type: multi_choice
    xp: 14
    question: "Quais itens compõem um checklist mensal?"
    options:
      - "Teste de restauração"
      - "Revisão de índices não usados"
      - "Revisão de permissões e papéis"
      - "Recriar todos os bancos"
      - "Planejamento de capacidade"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Restauração, índices, permissões e capacidade são rotinas mensais. Recriar bancos não é manutenção de rotina."
  - type: match
    xp: 12
    question: "Relacione o sinal à ação inicial."
    pairs:
      - ["Conexões no limite", "Identificar sessões e vazamentos"]
      - ["Réplica atrasada", "Verificar WAL, rede e carga"]
      - ["Tuplas mortas altas", "Investigar transações longas e autovacuum"]
      - ["Regra trust aberta", "Revisar pg_hba.conf e logs"]
    explanation: "Cada sinal tem uma investigação própria. Agir sem diagnosticar pode piorar o incidente."
  - type: true_false
    xp: 10
    statement: "Um alerta sem runbook ainda é melhor que nenhum alerta."
    answer: false
    explanation: "Alertas sem ação geram fadiga e são ignorados. Melhor ter poucos alertas acionáveis do que muitos ruídos."
  - type: order
    xp: 12
    question: "Ordene a resposta a conexões esgotadas."
    items:
      - "Identificar consumidores e estados"
      - "Comunicar e conter o impacto"
      - "Encerrar apenas o necessário e validar"
      - "Registrar causa e prevenção"
    correctOrder: [1, 0, 2, 3]
    explanation: "Comunique e contenha; investigue; aja no mínimo necessário; documente."
---

# Boss: Operação

Operação é decidir com informação. Disco, conexões, réplica, vacuum e segurança têm sinais e ações próprios. A pressa sem diagnóstico costuma trocar um problema por outro.

Um checklist maduro cobre dia, semana e mês. Alertas têm runbook. Logs são úteis e protegidos. Hardening é camada. Incidentes terminam com post-mortem e ações com dono e prazo.

Considere o ciclo de vida do sinal: uma métrica é coletada, comparada com uma linha de base, transformada em alerta e ligada a uma ação. Se o alerta dispara sem impacto, revise o limiar; se o incidente ocorreu sem alerta, melhore a cobertura. Para mudanças operacionais, registre quem fez, quando e por quê. Em serviços gerenciados, combine métricas do provedor com as visões do PostgreSQL para não confundir limite de infraestrutura com gargalo de consulta.

Depois de estabilizar, confirme que backups recentes existem, que o serviço voltou a atender e que não há réplicas ou filas degradadas. Um incidente só termina quando a recuperação foi validada e a equipe sabe o que acompanhar.

Ao final, você deve conseguir ler um cenário e escolher a primeira ação segura. Segurança aqui significa não destruir dados, não mascarar a causa e comunicar.

## Checklist de domínio

- [ ] Sei priorizar sinais.
- [ ] Sei montar checklist de manutenção.
- [ ] Sei reconhecer riscos de configuração.
- [ ] Sei responder sem ações destrutivas.

## Resumo

Operação combina monitoramento, rotina, segurança e resposta. Diagnostique antes de agir e feche cada incidente com aprendizado.
