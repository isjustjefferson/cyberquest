---
slug: "boss-backup-e-ha"
title: "Boss: Backup e alta disponibilidade"
kind: boss
difficulty: 4
est_minutes: 15
xp: 100
status: complete
prerequisites: ["estrategias-de-backup", "pitr", "replicacao-streaming", "alta-disponibilidade-e-failover"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 12
    question: "A empresa aceita perder até 5 minutos de dados e voltar em 1 hora. Qual combinação atende melhor?"
    options:
      - "Backup base diário, WAL arquivado contínuo e procedimento de PITR testado"
      - "Dump semanal apenas"
      - "Uma réplica assíncrona sem backup"
      - "Backup no mesmo disco a cada hora"
    answerIndex: 0
    explanation: "WAL contínuo limita a perda a minutos; um procedimento testado busca atender ao RTO. Dump semanal não atende ao RPO."
  - type: match
    xp: 14
    question: "Relacione o cenário à solução principal."
    pairs:
      - ["Erro de DROP TABLE às 14h", "PITR"]
      - ["Somente uma tabela precisa voltar", "pg_restore seletivo"]
      - ["Leitura escalável e standby pronto", "Replicação streaming"]
      - ["Migrar de versão com pouca parada", "Replicação lógica"]
      - ["Excesso de conexões ociosas", "PgBouncer"]
    explanation: "Cada problema tem uma ferramenta adequada. Usar a errada pode aumentar o custo ou o risco."
  - type: true_false
    xp: 10
    statement: "Um failover automático bem-sucedido dispensa testes de restauração de backup."
    answer: false
    explanation: "Failover cobre disponibilidade, não erro lógico nem corrupção. Backup e restauração testados continuam necessários."
  - type: multi_choice
    xp: 14
    question: "Quais itens pertencem a um runbook de recuperação?"
    options:
      - "Critérios para declarar desastre"
      - "Contatos e responsáveis"
      - "Passos de restauração e validação"
      - "Lista de desejos de features"
      - "Plano de comunicação"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Um runbook orienta decisão, execução e comunicação. Roadmap de produto não pertence ao procedimento de recuperação."
  - type: order
    xp: 12
    question: "Ordene a resposta a uma corrupção detectada no primário."
    items:
      - "Validar a integridade e comunicar o incidente"
      - "Isolar o primário e impedir novas escritas"
      - "Escolher o ponto de recuperação e restaurar"
      - "Promover, redirecionar e acompanhar"
    correctOrder: [1, 0, 2, 3]
    explanation: "Primeiro contenha o dano, depois confirme e comunique, recupere e só então devolva o serviço."
  - type: single_choice
    xp: 10
    question: "Por que monitorar o atraso de replicação?"
    options:
      - "Para saber a exposição a perda de dados e o estado da leitura"
      - "Para aumentar o WAL automaticamente"
      - "Para remover a necessidade de índices"
      - "Para substituir o autovacuum"
    answerIndex: 0
    explanation: "Atraso indica quanto uma promoção perderia e se leituras na réplica estão defasadas."
  - type: true_false
    xp: 10
    statement: "Arquivar WAL em um diretório no mesmo servidor protege contra a perda total da máquina."
    answer: false
    explanation: "Se a máquina sumir, o WAL arquivado some junto. O arquivo precisa estar em local independente e protegido."
---

# Boss: Backup e alta disponibilidade

Este boss combina recuperação e continuidade. A pergunta central não é "qual ferramenta existe", mas "qual combinação atende ao RPO e ao RTO com risco aceitável". Backup lógico, físico, WAL, réplicas e poolers resolvem problemas diferentes.

Erro lógico pede PITR ou restore seletivo. Falha de máquina pede réplica e failover. Migração de versão pede dump/restore, pg_upgrade ou replicação lógica. Excesso de conexões pede pooler. Confundir cenários leva a soluções caras que não resolvem o problema.

Um plano maduro tem cópias redundantes, cifradas e fora do site, além de restaurações testadas. Tem também runbook, responsáveis, comunicação e critérios de abortar. A réplica não substitui backup: o DROP é replicado. O backup não substitui HA: restaurar leva tempo.

Ao final, você deve conseguir desenhar uma arquitetura simples e justificar cada peça. Simplicidade operacional é uma virtude; cada componente adiciona modos de falha.

## Checklist de domínio

- [ ] Sei traduzir RPO/RTO em arquitetura.
- [ ] Sei escolher entre restore, PITR e failover.
- [ ] Sei explicar os riscos de réplica sem backup.
- [ ] Sei montar um runbook de recuperação.

## Resumo

Backup protege contra perda e erro; HA protege contra falha de nó. Juntos, com testes e documentação, formam uma operação confiável.
