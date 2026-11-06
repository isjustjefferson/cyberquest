---
slug: "ativos-ameacas-vulnerabilidades-riscos"
title: "Ativos, ameaças, vulnerabilidades e riscos"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["defesa-em-profundidade-e-menor-privilegio"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Ativos, ameaças, vulnerabilidades e riscos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Usar o vocabulário corretamente."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Usar o vocabulário corretamente. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O princípio do menor privilégio reduz o impacto de uma conta comprometida."
    answer: true
    explanation: "Cada identidade deve ter apenas as permissões necessárias para sua função."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Ativos, ameaças, vulnerabilidades e riscos”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "ativo"
      - "ameaça"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: ativo, ameaça. Os outros itens pertencem a outras lições."
---

# Ativos, ameaças, vulnerabilidades e riscos

> **Objetivo:** Usar o vocabulário corretamente.

**Ativo** é o que tem valor (dados, servidor, reputação). **Ameaça** é o que pode causar dano (um criminoso, um erro humano, uma enchente). **Vulnerabilidade** é uma fraqueza (software desatualizado). **Risco** é a possibilidade de uma ameaça explorar uma vulnerabilidade causando impacto. Ter uma vulnerabilidade sem ameaça relevante ou sem ativo valioso pode significar risco baixo, por isso se prioriza.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Ativos, ameaças, vulnerabilidades e riscos**, dentro do módulo **Fundamentos**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **ativo**
- **ameaça**
- **vulnerabilidade**
- **exploit**
- **impacto e probabilidade**
- **risco = probabilidade × impacto**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **ativo** com minhas próprias palavras.
- [ ] Consigo explicar **ameaça** com minhas próprias palavras.
- [ ] Consigo explicar **vulnerabilidade** com minhas próprias palavras.


### Aplique agora

1. Resuma **ativo** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **ameaça** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Ativos, ameaças, vulnerabilidades e riscos**.

## Resumo

Usar o vocabulário corretamente. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
