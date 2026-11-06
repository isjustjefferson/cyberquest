---
slug: "mitre-attack-e-kill-chain"
title: "MITRE ATT&CK e Cyber Kill Chain"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["modelagem-de-ameacas-stride"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “MITRE ATT&CK e Cyber Kill Chain”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Usar frameworks para descrever comportamento de atacantes."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Usar frameworks para descrever comportamento de atacantes. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um risco existe mesmo sem uma vulnerabilidade explorável ou uma ameaça concreta."
    answer: false
    explanation: "Risco combina ativo, ameaça e vulnerabilidade. Sem caminho plausível de exploração, o risco muda de natureza."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “MITRE ATT&CK e Cyber Kill Chain”?"
    options:
      - "ATT&CK (táticas e técnicas)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações), ATT&CK (táticas e técnicas). Os outros itens pertencem a outras lições."
---

# MITRE ATT&CK e Cyber Kill Chain

> **Objetivo:** Usar frameworks para descrever comportamento de atacantes.

A Kill Chain mostra as etapas de um ataque; interrompendo uma delas, você o impede. O **MITRE ATT&CK** é um catálogo de táticas (o "porquê", como *Acesso inicial*) e técnicas (o "como") observadas em ataques reais. Red teams planejam exercícios com ele; blue teams medem cobertura de detecção.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **MITRE ATT&CK e Cyber Kill Chain**, dentro do módulo **Frameworks e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações)**
- **ATT&CK (táticas e técnicas)**
- **uso por red e blue team**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações)** com minhas próprias palavras.
- [ ] Consigo explicar **ATT&CK (táticas e técnicas)** com minhas próprias palavras.
- [ ] Consigo explicar **uso por red e blue team** com minhas próprias palavras.


### Aplique agora

1. Resuma **Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **ATT&CK (táticas e técnicas)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **MITRE ATT&CK e Cyber Kill Chain**.

## Resumo

Usar frameworks para descrever comportamento de atacantes. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
