---
slug: "lab-analise-de-logs"
title: "Lab: Análise de logs de um servidor comprometido"
kind: lab
difficulty: 3
est_minutes: 30
xp: 250
status: complete
prerequisites: ["forense-digital"]
lab_slug: "analise-de-logs"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Análise de logs de um servidor comprometido”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Reconstruir uma linha do tempo a partir de logs fictícios."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Reconstruir uma linha do tempo a partir de logs fictícios. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Apagar rapidamente os arquivos suspeitos é sempre o primeiro passo da resposta."
    answer: false
    explanation: "Preservar evidências vem antes da limpeza; apagar pode destruir informações necessárias."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Análise de logs de um servidor comprometido”?"
    options:
      - "cadeia de custódia"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "ordem de volatilidade (memória → disco)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: ordem de volatilidade (memória → disco), cadeia de custódia. Os outros itens pertencem a outras lições."
---

# Lab: Análise de logs de um servidor comprometido

> **Objetivo:** Reconstruir uma linha do tempo a partir de logs fictícios.

O ambiente fornece logs de autenticação, web e processos de um servidor fictício que foi "comprometido". Usando as técnicas da trilha 1 (grep, sort, uniq), você identifica o IP atacante, o momento do acesso e a conta usada, e propõe ações de contenção.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Lab: Análise de logs de um servidor comprometido**, dentro do módulo **Resposta e investigação**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **ordem de volatilidade (memória → disco)**
- **cadeia de custódia**
- **imagem forense e hashes de integridade**
- **linha do tempo**
- **artefatos comuns (logs, histórico, arquivos recentes)**
- **aspectos legais**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Análise de logs de um servidor comprometido**.

## Resumo

Reconstruir uma linha do tempo a partir de logs fictícios. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
