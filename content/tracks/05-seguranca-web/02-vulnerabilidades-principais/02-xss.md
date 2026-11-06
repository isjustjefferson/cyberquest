---
slug: "xss"
title: "Cross-Site Scripting (XSS)"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["sql-injection"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Cross-Site Scripting (XSS)”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender como scripts não confiáveis chegam ao navegador da vítima e como evitar."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender como scripts não confiáveis chegam ao navegador da vítima e como evitar. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Escapar a saída conforme o contexto é uma defesa importante contra XSS."
    answer: true
    explanation: "A codificação adequada impede que dados sejam interpretados como código no navegador."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Cross-Site Scripting (XSS)”?"
    options:
      - "impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "refletido, armazenado, baseado em DOM"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: refletido, armazenado, baseado em DOM, impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário). Os outros itens pertencem a outras lições."
---

# Cross-Site Scripting (XSS)

> **Objetivo:** Entender como scripts não confiáveis chegam ao navegador da vítima e como evitar.

XSS ocorre quando a aplicação devolve dados do usuário no HTML sem escapar, e o navegador interpreta como código. No **refletido**, a entrada volta na mesma resposta; no **armazenado**, fica no banco (um comentário, por exemplo) e atinge todo visitante. A defesa principal é **escapar a saída conforme o contexto** (HTML, atributo, JS, URL). A CSP é uma segunda camada que restringe de onde scripts podem rodar.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Cross-Site Scripting (XSS)**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **refletido, armazenado, baseado em DOM**
- **impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário)**
- **defesas: **codificação de saída por contexto**, CSP, HttpOnly, sanitização de HTML com bibliotecas confiáveis, frameworks que escapam por padrão**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **refletido, armazenado, baseado em DOM** com minhas próprias palavras.
- [ ] Consigo explicar **impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário)** com minhas próprias palavras.
- [ ] Consigo explicar **defesas: **codificação de saída por contexto**, CSP, HttpOnly, sanitização de HTML com bibliotecas confiáveis, frameworks que escapam por padrão** com minhas próprias palavras.


### Aplique agora

1. Resuma **refletido, armazenado, baseado em DOM** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Cross-Site Scripting (XSS)**.

## Resumo

Entender como scripts não confiáveis chegam ao navegador da vítima e como evitar. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
