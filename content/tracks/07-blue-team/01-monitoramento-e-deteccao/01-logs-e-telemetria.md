---
slug: "logs-e-telemetria"
title: "Logs e telemetria"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Logs e telemetria”?"
    options:
      - "Saber quais logs importam e como lê-los."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Saber quais logs importam e como lê-los. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Logs com horário sincronizado ajudam a correlacionar eventos durante um incidente."
    answer: true
    explanation: "Sincronização de tempo é essencial para reconstruir a linha do tempo."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Logs e telemetria”?"
    options:
      - "logs de autenticação (/var/log/auth.log), web (access/error), sistema (journald), firewall"
      - "Windows Event Logs (logon 4624/4625)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: logs de autenticação (/var/log/auth.log), web (access/error), sistema (journald), firewall, Windows Event Logs (logon 4624/4625). Os outros itens pertencem a outras lições."
---

# Logs e telemetria

> **Objetivo:** Saber quais logs importam e como lê-los.

Logs são a "caixa-preta" de um sistema: sem eles, não há como saber o que aconteceu. Um padrão simples como muitas falhas de login seguidas de um sucesso do mesmo IP merece investigação. Para correlacionar eventos entre máquinas, os **relógios precisam estar sincronizados**, e para evitar que um invasor apague pistas, logs devem ser enviados a um local central.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Logs e telemetria**, dentro do módulo **Monitoramento e detecção**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **logs de autenticação (/var/log/auth.log), web (access/error), sistema (journald), firewall**
- **Windows Event Logs (logon 4624/4625)**
- **sincronização de relógio (NTP)**
- **retenção**
- **centralização**
- **integridade dos logs**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **logs de autenticação (/var/log/auth.log), web (access/error), sistema (journald), firewall** com minhas próprias palavras.
- [ ] Consigo explicar **Windows Event Logs (logon 4624/4625)** com minhas próprias palavras.
- [ ] Consigo explicar **sincronização de relógio (NTP)** com minhas próprias palavras.


### Aplique agora

1. Resuma **logs de autenticação (/var/log/auth.log), web (access/error), sistema (journald), firewall** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **Windows Event Logs (logon 4624/4625)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Logs e telemetria**.

## Resumo

Saber quais logs importam e como lê-los. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
