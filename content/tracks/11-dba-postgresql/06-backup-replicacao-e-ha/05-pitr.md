---
slug: "pitr"
title: "PITR: recuperação a um ponto no tempo"
kind: lesson
difficulty: 4
est_minutes: 20
xp: 60
status: complete
prerequisites: ["wal-e-arquivamento"]
lab_slug: "pitr"
exercises:
  - type: order
    xp: 14
    question: "Ordene o procedimento de uma recuperação PITR."
    items:
      - "Iniciar o servidor e acompanhar o log de recuperação"
      - "Restaurar o backup base em um diretório novo"
      - "Configurar restore_command e recovery_target_time"
      - "Validar os dados antes de liberar a aplicação"
      - "Criar o arquivo recovery.signal"
    correctOrder: [1, 2, 4, 0, 3]
    explanation: "A cópia base vem primeiro; depois configuração, sinal de recovery, início e validação. Promover sem conferir pode consolidar um estado errado."
  - type: single_choice
    xp: 10
    question: "Qual arquivo sinaliza ao PostgreSQL que ele deve iniciar em modo de recuperação?"
    options:
      - "recovery.signal"
      - "standby.signal"
      - "postmaster.pid"
      - "pg_hba.conf"
    answerIndex: 0
    explanation: "recovery.signal solicita recuperação até um alvo. standby.signal é usado para uma réplica em standby contínuo."
  - type: single_choice
    xp: 10
    question: "PITR exige necessariamente…"
    options:
      - "Backup base e WAL arquivado contínuo"
      - "Apenas um dump lógico"
      - "Uma réplica síncrona"
      - "pg_upgrade"
    answerIndex: 0
    explanation: "Sem backup base não há ponto de partida; sem WAL arquivado não há como avançar até o instante desejado."
---

# PITR: recuperação a um ponto no tempo

Às 14h07 alguém executa `DROP TABLE pedidos`. O backup da madrugada existe, mas restaurá-lo perderia o dia inteiro. Com **PITR** (Point-In-Time Recovery), você restaura o backup base e reaplica o WAL até 14h06, imediatamente antes do erro. O banco volta ao estado correto sem depender de um dump posterior.

O procedimento começa com um backup base confiável e o arquivo de WAL contínuo. Restaure o backup em um diretório novo, configure `restore_command` para buscar segmentos arquivados e defina `recovery_target_time` (ou `xid`, `name`, `lsn`). Crie o arquivo `recovery.signal` na raiz do `PGDATA` e inicie o servidor. O log mostrará os segmentos sendo aplicados e o ponto de parada.

Após a recuperação, o servidor pode pausar ou promover, conforme `recovery_target_action`. Antes de liberar a aplicação, valide os dados: contagens, tabelas críticas, sequências e integridade. Se o alvo estiver errado, refaça a partir do backup base. Cada tentativa cria uma nova linha do tempo; entenda esse conceito antes de promover.

O procedimento precisa estar escrito e ensaiado. Em um desastre real, ninguém aprende PITR sob pressão. Guarde o backup, o WAL e as instruções em locais que sobrevivam à falha do servidor principal. Teste com alvos conhecidos e meça o tempo total.

## Por que isso importa

PITR transforma um erro destrutivo em um incidente recuperável. É a diferença entre perder o dia e perder minutos.

## Conceitos-chave

- **Backup base:** ponto de partida.
- **WAL arquivado:** avanço até o alvo.
- **recovery_target_time:** instante desejado.
- **recovery.signal:** modo de recuperação.
- **recovery_target_action:** pausar, promover ou desligar.
- **Timeline:** ramificação após recuperação.

## Erros comuns

Não ter WAL do período. Escolher um alvo sem validar. Promover antes de conferir. Não documentar o procedimento. Testar apenas com backup, sem WAL.

## Checklist de domínio

- [ ] Sei listar os pré-requisitos.
- [ ] Sei configurar alvo e sinal.
- [ ] Sei validar antes de promover.
- [ ] Sei explicar timelines.

## Resumo

PITR combina backup base e WAL até um instante. O sinal inicia a recuperação; a validação decide se o resultado serve. O laboratório pratica o ciclo completo.
