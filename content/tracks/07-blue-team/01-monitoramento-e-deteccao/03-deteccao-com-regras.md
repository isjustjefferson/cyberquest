---
slug: "deteccao-com-regras"
title: "Detecção com regras (Sigma/YARA — conceito)"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["siem-conceitos"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Detecção com regras (Sigma/YARA — conceito)”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Entender regras de detecção como código."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Entender regras de detecção como código. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Uma regra de detecção precisa ser testada com eventos normais e anômalos."
    answer: true
    explanation: "Testes reduzem falsos positivos e confirmam que a regra dispara no cenário correto."
---

# Detecção com regras (Sigma/YARA — conceito)

> **Objetivo:** Entender regras de detecção como código.

Uma regra descreve o que procurar: um padrão de log (Sigma) ou características de um arquivo (YARA). Boas regras são testadas contra dados reais de atividade normal para reduzir falsos positivos e versionadas como código.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Detecção com regras (Sigma/YARA — conceito)**, dentro do módulo **Monitoramento e detecção**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **assinaturas vs. comportamento**
- **Sigma (regras de log, agnósticas de plataforma)**
- **YARA (padrões em arquivos)**
- **Indicadores de comprometimento (IoCs)**
- **ciclo de teste e ajuste**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **assinaturas vs. comportamento** com minhas próprias palavras.
- [ ] Consigo explicar **Sigma (regras de log, agnósticas de plataforma)** com minhas próprias palavras.
- [ ] Consigo explicar **YARA (padrões em arquivos)** com minhas próprias palavras.


## Resumo

Entender regras de detecção como código. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
