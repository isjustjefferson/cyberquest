---
slug: "hardening"
title: "Hardening de Linux e Windows"
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
    question: "Qual alternativa descreve o foco principal da lição “Hardening de Linux e Windows”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Reduzir a superfície de ataque com configurações seguras."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Reduzir a superfície de ataque com configurações seguras. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Uma regra de detecção precisa ser testada com eventos normais e anômalos."
    answer: true
    explanation: "Testes reduzem falsos positivos e confirmam que a regra dispara no cenário correto."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Hardening de Linux e Windows”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "remover serviços e pacotes desnecessários"
      - "SSH (chaves, sem root, sem senha)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: remover serviços e pacotes desnecessários, SSH (chaves, sem root, sem senha). Os outros itens pertencem a outras lições."
---

# Hardening de Linux e Windows

> **Objetivo:** Reduzir a superfície de ataque com configurações seguras.

Hardening é "tirar o que sobra e trancar o que fica". Em SSH, use autenticação por chave, desative login de root e limite quem pode entrar. Ative atualizações, remova serviços sem uso e registre eventos relevantes. Benchmarks como o CIS fornecem listas de verificação verificáveis.

## Por que isso importa

Detecção e resposta dependem de telemetria confiável. Logs bons contam a história de um incidente; logs ruins geram alertas barulhentos e investigações incompletas. Nesta lição, o foco é **Hardening de Linux e Windows**, dentro do módulo **Hardening e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **remover serviços e pacotes desnecessários**
- **SSH (chaves, sem root, sem senha)**
- **firewall**
- **atualizações automáticas**
- **permissões**
- **auditoria (auditd)**

Comece pela pergunta de detecção, valide a fonte de log e teste a regra com eventos normais e anômalos. Preserve evidências antes de limpar qualquer sistema. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- coletar logs sem retenção adequada.
- alertar sem contexto e gerar fadiga.
- apagar evidências durante a resposta.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **remover serviços e pacotes desnecessários** com minhas próprias palavras.
- [ ] Consigo explicar **SSH (chaves, sem root, sem senha)** com minhas próprias palavras.
- [ ] Consigo explicar **firewall** com minhas próprias palavras.


### Aplique agora

1. Resuma **remover serviços e pacotes desnecessários** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **SSH (chaves, sem root, sem senha)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Hardening de Linux e Windows**.

## Resumo

Reduzir a superfície de ataque com configurações seguras. Blue team é um ciclo: prevenir, detectar, responder e aprender. Cada incidente deve melhorar controles e detecção. Pratique em ambiente controlado e documente o que aprendeu.
