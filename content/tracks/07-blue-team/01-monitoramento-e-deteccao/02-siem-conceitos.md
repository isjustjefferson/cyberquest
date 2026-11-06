---
slug: "siem-conceitos"
title: "SIEM: conceitos"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["logs-e-telemetria"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “SIEM: conceitos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender o que um SIEM faz."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender o que um SIEM faz. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Apagar rapidamente os arquivos suspeitos é sempre o primeiro passo da resposta."
    answer: false
    explanation: "Preservar evidências vem antes da limpeza; apagar pode destruir informações necessárias."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “SIEM: conceitos”?"
    options:
      - "casos de uso"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "coleta, normalização, correlação, alertas, painéis"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: coleta, normalização, correlação, alertas, painéis, casos de uso. Os outros itens pertencem a outras lições."
---

# SIEM: conceitos

> **Objetivo:** Entender o que um SIEM faz.

Um SIEM junta logs de várias fontes, os padroniza e aplica regras de correlação para gerar alertas. O valor está nos **casos de uso** bem definidos ("detectar força bruta seguida de login bem-sucedido"), não em coletar tudo sem critério.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **SIEM: conceitos**, dentro do módulo **Monitoramento e detecção**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **coleta, normalização, correlação, alertas, painéis**
- **casos de uso**
- **ruído e ajuste de regras**
- **exemplos (Wazuh/Elastic — visão geral)**
- **SOC e níveis de analista**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **coleta, normalização, correlação, alertas, painéis** com minhas próprias palavras.
- [ ] Consigo explicar **casos de uso** com minhas próprias palavras.
- [ ] Consigo explicar **ruído e ajuste de regras** com minhas próprias palavras.


### Aplique agora

1. Resuma **coleta, normalização, correlação, alertas, painéis** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **casos de uso** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **SIEM: conceitos**.

## Resumo

Entender o que um SIEM faz. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
