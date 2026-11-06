---
slug: "gestao-de-vulnerabilidades-e-patching"
title: "Gestão de vulnerabilidades e patching"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["hardening"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Gestão de vulnerabilidades e patching”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Manter sistemas atualizados com método."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Manter sistemas atualizados com método. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "SIEM substitui a necessidade de fontes de log confiáveis."
    answer: false
    explanation: "SIEM correlaciona dados; se a fonte é ruim ou incompleta, a detecção também será."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Gestão de vulnerabilidades e patching”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "inventário"
      - "varredura periódica"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: inventário, varredura periódica. Os outros itens pertencem a outras lições."
---

# Gestão de vulnerabilidades e patching

> **Objetivo:** Manter sistemas atualizados com método.

Não se corrige tudo ao mesmo tempo: prioriza-se por **risco real**. Um sistema exposto à internet com falha explorada ativamente vem antes de um servidor interno com falha teórica. Sem inventário, não há gestão: não dá para corrigir o que você não sabe que existe.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Gestão de vulnerabilidades e patching**, dentro do módulo **Hardening e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **inventário**
- **varredura periódica**
- **priorização (CVSS + exposição + exploração conhecida)**
- **prazos (SLA)**
- **janela de manutenção**
- **testes antes de aplicar**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **inventário** com minhas próprias palavras.
- [ ] Consigo explicar **varredura periódica** com minhas próprias palavras.
- [ ] Consigo explicar **priorização (CVSS + exposição + exploração conhecida)** com minhas próprias palavras.


### Aplique agora

1. Resuma **inventário** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **varredura periódica** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Gestão de vulnerabilidades e patching**.

## Resumo

Manter sistemas atualizados com método. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
