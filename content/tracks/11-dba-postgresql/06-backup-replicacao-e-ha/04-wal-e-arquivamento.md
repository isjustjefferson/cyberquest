---
slug: "wal-e-arquivamento"
title: "WAL e arquivamento"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["backup-fisico-pg-basebackup"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que o WAL guarda?"
    options:
      - "O registro de cada alteração antes de ela ser aplicada aos arquivos de dados"
      - "Apenas os dados de tabelas temporárias"
      - "As configurações do pg_hba.conf"
      - "Os planos de execução de todas as consultas"
    answerIndex: 0
    explanation: "O WAL é write-ahead: a alteração é registrada no diário antes de a página de dados ser consolidada. Isso garante durabilidade e recuperação."
  - type: single_choice
    xp: 10
    question: "Um slot de replicação esquecido pode causar qual problema?"
    options:
      - "Acúmulo de WAL e disco cheio"
      - "Perda automática de todas as permissões"
      - "Desligamento do autovacuum"
      - "Corrupção do pg_hba.conf"
    answerIndex: 0
    explanation: "O slot impede a remoção de WAL que ainda considera necessário. Se o consumidor não avança, o disco enche."
  - type: fill_command
    xp: 10
    question: "Complete a função que força a troca de segmento do WAL."
    template: "SELECT pg_switch___();"
    blanks: ["wal"]
    accepted: [["wal"]]
    explanation: "pg_switch_wal() força um novo segmento e permite que o arquivamento processe o anterior. É usado em testes e operações controladas."
---

# WAL e arquivamento

O **Write-Ahead Log** é o diário do PostgreSQL. Toda alteração é registrada no WAL antes de ser considerada durável nas páginas de dados. Em uma queda, o servidor reinicia, compara o último checkpoint com o WAL e reaplica o que falta. É por isso que desligar `fsync` ou apagar WAL manualmente destrói a garantia de recuperação.

O WAL é dividido em segmentos, normalmente de 16 MB. `wal_level` define quanto detalhe é registrado: `minimal` reduz informação, `replica` habilita replicação física e `logical` adiciona dados para replicação lógica. `archive_mode = on` e `archive_command` copiam cada segmento concluído para um local seguro. `restore_command` é usado na recuperação para buscar esses segmentos.

Arquivar WAL é a base do PITR. Com um backup base e a sequência de WAL arquivado, você restaura até um instante escolhido. Sem arquivamento, o backup base só recupera até o momento em que foi tirado. `pg_switch_wal()` força a troca de segmento; `pg_current_wal_lsn()` mostra a posição atual.

Slots de replicação são úteis para consumidores que não podem perder WAL, mas são perigosos quando abandonados: o servidor retém segmentos para sempre. Monitore `pg_replication_slots`, o espaço usado e o atraso do consumidor. Prefira limites e alertas a descobrir o problema quando o disco encher.

## Por que isso importa

WAL explica durabilidade, replicação e PITR. O arquivamento correto é o que permite voltar a um ponto no tempo; o gerenciamento de slots evita uma indisponibilidade por disco cheio.

## Conceitos-chave

- **WAL:** diário de alterações.
- **Segmento:** arquivo de WAL, tipicamente 16 MB.
- **archive_mode:** habilita arquivamento.
- **restore_command:** busca WAL na recuperação.
- **Slot de replicação:** retém WAL para um consumidor.
- **LSN:** posição no log.

## Erros comuns

Apagar WAL para liberar espaço. Deixar slot órfão. Não monitorar falhas de archive_command. Usar wal_level insuficiente para a replicação desejada.

## Checklist de domínio

- [ ] Sei explicar write-ahead.
- [ ] Sei configurar arquivamento.
- [ ] Sei diferenciar backup base de PITR.
- [ ] Sei monitorar slots e espaço.

## Resumo

WAL garante durabilidade e alimenta recuperação e replicação. Arquivar segmentos permite PITR. Slots exigem monitoramento para não encher o disco.
