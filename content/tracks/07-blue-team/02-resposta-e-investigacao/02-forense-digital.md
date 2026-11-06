---
slug: "forense-digital"
title: "Forense digital"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["resposta-a-incidentes"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Forense digital”?"
    options:
      - "Entender princípios de coleta e preservação de evidências."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Entender princípios de coleta e preservação de evidências. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Logs com horário sincronizado ajudam a correlacionar eventos durante um incidente."
    answer: true
    explanation: "Sincronização de tempo é essencial para reconstruir a linha do tempo."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Forense digital”?"
    options:
      - "ordem de volatilidade (memória → disco)"
      - "cadeia de custódia"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: ordem de volatilidade (memória → disco), cadeia de custódia. Os outros itens pertencem a outras lições."
---

# Forense digital

> **Objetivo:** Entender princípios de coleta e preservação de evidências.

Evidência digital é frágil: ligar/desligar, copiar ou abrir arquivos pode alterá-la. Coleta-se primeiro o mais **volátil** (memória, conexões), depois o disco, sempre registrando quem fez o quê (cadeia de custódia) e calculando **hashes** para provar que a cópia é idêntica ao original.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Forense digital**, dentro do módulo **Resposta e investigação**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **ordem de volatilidade (memória → disco)**
- **cadeia de custódia**
- **imagem forense e hashes de integridade**
- **linha do tempo**
- **artefatos comuns (logs, histórico, arquivos recentes)**
- **aspectos legais**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **ordem de volatilidade (memória → disco)** com minhas próprias palavras.
- [ ] Consigo explicar **cadeia de custódia** com minhas próprias palavras.
- [ ] Consigo explicar **imagem forense e hashes de integridade** com minhas próprias palavras.


### Aplique agora

1. Resuma **ordem de volatilidade (memória → disco)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **cadeia de custódia** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Forense digital**.

## Resumo

Entender princípios de coleta e preservação de evidências. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
