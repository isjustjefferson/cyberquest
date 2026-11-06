---
slug: "resposta-a-incidentes"
title: "Resposta a incidentes"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Resposta a incidentes”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Conhecer o ciclo de resposta e agir com método."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Conhecer o ciclo de resposta e agir com método. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "SIEM substitui a necessidade de fontes de log confiáveis."
    answer: false
    explanation: "SIEM correlaciona dados; se a fonte é ruim ou incompleta, a detecção também será."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Resposta a incidentes”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "preparação"
      - "detecção e análise"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: preparação, detecção e análise. Os outros itens pertencem a outras lições."
---

# Resposta a incidentes

> **Objetivo:** Conhecer o ciclo de resposta e agir com método.

Quando algo acontece, a pressa é inimiga: reagir sem método pode piorar o estrago ou apagar evidências. O ciclo é: **preparar**, **detectar e analisar**, **conter** (isolar o sistema afetado), **erradicar** (remover a causa), **recuperar** e **aprender**. Documente tudo em linha do tempo. A comunicação com gestores, jurídico e, quando aplicável, autoridades é parte da resposta.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Resposta a incidentes**, dentro do módulo **Resposta e investigação**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **preparação**
- **detecção e análise**
- **contenção**
- **erradicação**
- **recuperação**
- **lições aprendidas (NIST SP 800-61)**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **preparação** com minhas próprias palavras.
- [ ] Consigo explicar **detecção e análise** com minhas próprias palavras.
- [ ] Consigo explicar **contenção** com minhas próprias palavras.


### Aplique agora

1. Resuma **preparação** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **detecção e análise** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Resposta a incidentes**.

## Resumo

Conhecer o ciclo de resposta e agir com método. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
