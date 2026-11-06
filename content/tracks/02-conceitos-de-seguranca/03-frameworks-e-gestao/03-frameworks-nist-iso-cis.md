---
slug: "frameworks-nist-iso-cis"
title: "Frameworks: NIST, ISO 27001 e CIS Controls"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["mitre-attack-e-kill-chain"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Frameworks: NIST, ISO 27001 e CIS Controls”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Saber para que serve cada um."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Saber para que serve cada um. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Defesa em profundidade significa depender de um único controle muito forte."
    answer: false
    explanation: "Defesa em profundidade usa camadas independentes para que a falha de uma não comprometa tudo."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Frameworks: NIST, ISO 27001 e CIS Controls”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente)"
      - "ISO/IEC 27001 (SGSI, certificável)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente), ISO/IEC 27001 (SGSI, certificável). Os outros itens pertencem a outras lições."
---

# Frameworks: NIST, ISO 27001 e CIS Controls

> **Objetivo:** Saber para que serve cada um.

Frameworks dão uma linguagem comum e um roteiro. O **NIST CSF** é um modelo de funções; a **ISO 27001** define um sistema de gestão que pode ser certificado; o **CIS Controls** é uma lista prática de controles priorizados. Não são concorrentes: organizações misturam conforme necessidade.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Frameworks: NIST, ISO 27001 e CIS Controls**, dentro do módulo **Frameworks e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente)**
- **ISO/IEC 27001 (SGSI, certificável)**
- **CIS Controls (lista prática priorizada)**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente)** com minhas próprias palavras.
- [ ] Consigo explicar **ISO/IEC 27001 (SGSI, certificável)** com minhas próprias palavras.
- [ ] Consigo explicar **CIS Controls (lista prática priorizada)** com minhas próprias palavras.


### Aplique agora

1. Resuma **NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **ISO/IEC 27001 (SGSI, certificável)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Frameworks: NIST, ISO 27001 e CIS Controls**.

## Resumo

Saber para que serve cada um. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
