---
slug: "aaa"
title: "AAA: Autenticação, Autorização e Auditoria"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: ["cia-e-extensoes"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “AAA: Autenticação, Autorização e Auditoria”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Diferenciar provar quem você é, o que pode fazer e o que fez."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Diferenciar provar quem você é, o que pode fazer e o que fez. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um risco existe mesmo sem uma vulnerabilidade explorável ou uma ameaça concreta."
    answer: false
    explanation: "Risco combina ativo, ameaça e vulnerabilidade. Sem caminho plausível de exploração, o risco muda de natureza."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “AAA: Autenticação, Autorização e Auditoria”?"
    options:
      - "autorização (RBAC)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "fatores (algo que sabe, tem, é)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: fatores (algo que sabe, tem, é), autorização (RBAC). Os outros itens pertencem a outras lições."
---

# AAA: Autenticação, Autorização e Auditoria

> **Objetivo:** Diferenciar provar quem você é, o que pode fazer e o que fez.

Autenticação: "quem é você?". Autorização: "o que você pode fazer?". Auditoria (accounting): "o que você fez?". Um erro clássico é confiar só na autenticação: o usuário está logado, mas isso não significa que pode ver os dados de outro usuário (veremos isso como IDOR na trilha de Web). Sem logs de auditoria, não há como investigar um incidente.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **AAA: Autenticação, Autorização e Auditoria**, dentro do módulo **Fundamentos**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **fatores (algo que sabe, tem, é)**
- **autorização (RBAC)**
- **logs de auditoria**
- **contabilização**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **fatores (algo que sabe, tem, é)** com minhas próprias palavras.
- [ ] Consigo explicar **autorização (RBAC)** com minhas próprias palavras.
- [ ] Consigo explicar **logs de auditoria** com minhas próprias palavras.


### Aplique agora

1. Resuma **fatores (algo que sabe, tem, é)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **autorização (RBAC)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **AAA: Autenticação, Autorização e Auditoria**.

## Resumo

Diferenciar provar quem você é, o que pode fazer e o que fez. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
