---
slug: "replicacao-streaming"
title: "Replicação em streaming"
kind: lesson
difficulty: 4
est_minutes: 20
xp: 60
status: complete
prerequisites: ["wal-e-arquivamento"]
lab_slug: "replicacao-streaming"
exercises:
  - type: true_false
    xp: 10
    statement: "Uma réplica em streaming protege contra um DROP TABLE acidental."
    answer: false
    explanation: "O DROP também é replicado. Réplica aumenta disponibilidade e leitura, mas não substitui backup e PITR."
  - type: single_choice
    xp: 10
    question: "Qual visão mostra as réplicas conectadas ao primário?"
    options:
      - "pg_stat_replication"
      - "pg_stat_user_tables"
      - "pg_hba_file_rules"
      - "pg_roles"
    answerIndex: 0
    explanation: "pg_stat_replication mostra estado, WAL enviado, posições e atraso das réplicas conectadas."
  - type: match
    xp: 12
    question: "Relacione o modo de replicação à característica."
    pairs:
      - ["Assíncrona", "Primário confirma sem esperar a réplica"]
      - ["Síncrona", "Primário espera confirmação de standby"]
      - ["Hot standby", "Réplica aceita consultas de leitura"]
      - ["Promoção", "Standby passa a aceitar escritas"]
    explanation: "Assíncrona é mais rápida e pode perder as últimas transações; síncrona reduz essa janela ao custo de latência."
---

# Replicação em streaming

Na replicação física em streaming, o primário envia continuamente registros do WAL para um ou mais standbys. A réplica aplica esses registros e mantém uma cópia quase idêntica do cluster. Com `hot_standby`, ela pode atender consultas de leitura, aliviando o primário e melhorando a disponibilidade.

A configuração exige um papel com `REPLICATION`, regra no `pg_hba.conf`, um backup base no standby e `primary_conninfo` apontando para o primário. O arquivo `standby.signal` marca o diretório como standby. O servidor então inicia em recuperação contínua, recebendo WAL. `pg_stat_replication` no primário e `pg_stat_wal_receiver` no standby mostram o estado e o atraso.

Na replicação **assíncrona**, o primário confirma a transação sem esperar a réplica. É rápida, mas uma falha do primário pode perder as últimas transações. Na **síncrona**, o primário espera a confirmação de pelo menos um standby. A durabilidade aumenta, mas a latência também, e uma réplica lenta pode travar escritas.

Promover um standby transforma-o em primário. `pg_ctl promote` ou `pg_promote()` fazem isso. Depois, aplicações precisam ser redirecionadas e as outras réplicas reconfiguradas. Sem coordenação, dois primários podem aceitar escritas: **split-brain**. Ferramentas de HA automatizam detecção, fencing e promoção.

## Por que isso importa

Réplicas são a base de leitura escalável e alta disponibilidade. Entender modos e riscos evita a falsa sensação de segurança de achar que uma cópia substitui backup.

## Conceitos-chave

- **Primário:** aceita escritas e envia WAL.
- **Standby:** aplica WAL continuamente.
- **Hot standby:** standby com leitura.
- **Síncrona vs. assíncrona:** trade-off entre latência e perda.
- **Promoção:** standby vira primário.
- **Split-brain:** dois primários.

## Erros comuns

Tratar réplica como backup. Ignorar atraso. Promover sem fencing. Esquecer de reconfigurar aplicações. Usar replicação síncrona com standby instável.

## Checklist de domínio

- [ ] Sei explicar o fluxo de WAL.
- [ ] Sei diferenciar síncrona e assíncrona.
- [ ] Sei monitorar atraso.
- [ ] Sei descrever uma promoção segura.

## Resumo

Streaming replica o cluster via WAL. Hot standby serve leitura; promoção exige coordenação. Réplica melhora disponibilidade, mas não protege contra erro lógico.
