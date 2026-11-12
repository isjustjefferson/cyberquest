---
slug: "lab-pitr"
title: "Lab: PITR na Padaria Byte"
kind: lab
difficulty: 4
est_minutes: 40
xp: 350
status: complete
prerequisites: ["pitr", "wal-e-arquivamento"]
lab_slug: "pitr"
exercises:
  - type: order
    xp: 14
    question: "Ordene a recuperação até antes do DROP TABLE."
    items:
      - "Iniciar o servidor e acompanhar o log"
      - "Restaurar o backup base"
      - "Definir recovery_target_time"
      - "Criar recovery.signal"
      - "Validar dados e promover"
    correctOrder: [1, 2, 3, 0, 4]
    explanation: "Backup base, configuração do alvo, sinal, início e validação. Promover antes de conferir consolida o estado errado."
  - type: single_choice
    xp: 12
    question: "Qual alvo é mais seguro para recuperar o momento imediatamente anterior ao DROP?"
    options:
      - "Um horário alguns segundos antes do DROP"
      - "Um horário depois do DROP"
      - "O fim do WAL disponível"
      - "O último checkpoint"
    answerIndex: 0
    explanation: "O objetivo é parar antes da alteração destrutiva. Segundos de margem evitam incluir a transação do DROP."
  - type: true_false
    xp: 10
    statement: "Após a recuperação, o PostgreSQL pode abrir uma nova timeline; recuperações futuras devem considerá-la."
    answer: true
    explanation: "PITR cria uma ramificação na história do cluster. Ferramentas e procedimentos precisam apontar para a timeline correta."
---

# Lab: PITR na Padaria Byte

Um estagiário rodou `DROP TABLE pedidos` às 14h07. O backup base da madrugada e o arquivo de WAL estão no servidor de laboratório. Sua missão é recuperar o banco até 14h06, provar que os pedidos voltaram e registrar o procedimento.

Comece inspecionando o backup e os segmentos de WAL disponíveis. Restaure a cópia base em um diretório separado, configure `restore_command` e `recovery_target_time` com uma margem de segurança, crie `recovery.signal` e inicie o servidor. Acompanhe o log: ele mostra os segmentos aplicados e o ponto de parada. Se o servidor não subir, verifique permissões, caminhos e a versão major.

Com o banco em recuperação, valide antes de promover: contagens, tabelas críticas, sequências e a ausência da transação destrutiva. O objetivo automático executa consultas no banco recuperado. Só depois permita novas conexões de escrita.

Documente o tempo total, o alvo escolhido e as dificuldades. Em um incidente real, o relatório acalma o time e melhora o próximo ensaio. Lembre que PITR não desfaz a causa raiz: revise permissões e processos que permitiram o DROP.

## Por que isso importa

PITR é a diferença entre perder um dia e perder minutos. O laboratório reproduz o estresse de um erro destrutivo com um ambiente seguro para errar.

## Conceitos-chave

- **Backup base:** ponto de partida.
- **WAL arquivado:** avanço até o alvo.
- **recovery_target_time:** instante de parada.
- **recovery.signal:** modo de recuperação.
- **Validação:** antes de promover.
- **Timeline:** nova ramificação.

## Erros comuns

Escolher alvo depois do erro. Promover sem validar. Não ter WAL do período. Ignorar versão major. Não documentar.

## Checklist de domínio

- [ ] Sei restaurar o backup base.
- [ ] Sei configurar o alvo.
- [ ] Sei validar antes de promover.
- [ ] Sei explicar timelines.

## Resumo

O lab percorre o ciclo completo de PITR: base, WAL, alvo, recuperação e validação. O painel confirma que os pedidos voltaram ao estado anterior ao DROP.
