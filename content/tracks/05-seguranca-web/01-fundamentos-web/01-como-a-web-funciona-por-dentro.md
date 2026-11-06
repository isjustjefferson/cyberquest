---
slug: "como-a-web-funciona-por-dentro"
title: "Como a web funciona por dentro"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Como a web funciona por dentro”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender o fluxo cliente–servidor para saber onde cada falha nasce."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender o fluxo cliente–servidor para saber onde cada falha nasce. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Escapar a saída conforme o contexto é uma defesa importante contra XSS."
    answer: true
    explanation: "A codificação adequada impede que dados sejam interpretados como código no navegador."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Como a web funciona por dentro”?"
    options:
      - "front-end vs. back-end"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados, front-end vs. back-end. Os outros itens pertencem a outras lições."
---

# Como a web funciona por dentro

> **Objetivo:** Entender o fluxo cliente–servidor para saber onde cada falha nasce.

Quando você abre uma página, o navegador resolve o nome, abre conexão, negocia TLS, envia uma requisição e renderiza a resposta. Tudo que o usuário controla (URL, parâmetros, headers, cookies, corpo) é **entrada não confiável**, e a regra de ouro da segurança web é: *nunca confie no cliente*. Validação só no navegador é cosmética, porque o atacante envia requisições diretamente ao servidor. A **same-origin policy** impede que scripts de um site leiam dados de outro.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Como a web funciona por dentro**, dentro do módulo **Fundamentos web**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados**
- **front-end vs. back-end**
- **entrada do usuário como superfície de ataque**
- **same-origin policy**
- **devtools do navegador**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados** com minhas próprias palavras.
- [ ] Consigo explicar **front-end vs. back-end** com minhas próprias palavras.
- [ ] Consigo explicar **entrada do usuário como superfície de ataque** com minhas próprias palavras.


### Aplique agora

1. Resuma **navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **front-end vs. back-end** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Como a web funciona por dentro**.

## Resumo

Entender o fluxo cliente–servidor para saber onde cada falha nasce. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
