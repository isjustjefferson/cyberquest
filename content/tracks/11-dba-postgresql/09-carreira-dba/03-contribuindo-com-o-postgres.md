---
slug: "contribuindo-com-o-postgres"
title: "Contribuindo com o PostgreSQL"
kind: lesson
difficulty: 2
est_minutes: 8
xp: 40
status: draft
prerequisites: ["certificacoes-e-recursos"]
lab_slug: null
exercises:
  - type: multi_choice
    xp: 12
    question: "Quais são formas de contribuir sem escrever código C?"
    options:
      - "Melhorar a documentação"
      - "Revisar patches"
      - "Responder dúvidas na comunidade"
      - "Apagar issues sem análise"
      - "Traduzir material"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Documentação, revisão, suporte e tradução são contribuições valiosas. Fechar issues sem análise prejudica o projeto."
  - type: single_choice
    xp: 10
    question: "Onde acontecem as discussões de desenvolvimento do projeto?"
    options:
      - "Em listas de e-mail"
      - "Apenas em redes sociais"
      - "Somente em reuniões presenciais"
      - "Em chats privados"
    answerIndex: 0
    explanation: "O desenvolvimento do PostgreSQL acontece em listas como pgsql-hackers, com ciclos de revisão chamados commitfests."
---

# Contribuindo com o PostgreSQL

Contribuir não exige escrever C. Você pode relatar bugs com reprodução clara, melhorar a documentação, revisar patches, testar versões e responder dúvidas. Traduções e organização de eventos também ajudam.

O desenvolvimento acontece em listas de e-mail, especialmente `pgsql-hackers` e `pgsql-general`. Patches passam por *commitfests*, ciclos de revisão. Acompanhar as discussões por algumas semanas ensina como o sistema é construído e como propor mudanças.

Comece pequeno: corrija uma frase da documentação, reproduza um bug, teste um patch. Leia o código de conduta, seja específico e cite versões e passos. A comunidade valoriza clareza e respeito.

Uma boa reprodução de bug inclui a versão do PostgreSQL, sistema operacional, esquema mínimo, comandos executados e resultado observado versus esperado. Remova dados sensíveis e reduza o exemplo até ele ser fácil de executar. Antes de enviar uma proposta, procure discussões existentes e leia as orientações da lista. Se não estiver pronto para escrever código, testar uma alteração em ambiente controlado ou apontar uma ambiguidade na documentação já economiza tempo de quem mantém o projeto.

## Por que isso importa

Contribuir aprofunda o entendimento e conecta você à comunidade que mantém a ferramenta que você opera.

## Conceitos-chave

- **documentação**
- **revisão de patch**
- **pgsql-hackers**
- **commitfest**
- **código de conduta**
- **reprodução de bug**

## Erros comuns

Relatar bug sem passos. Exigir solução. Ignorar o código de conduta. Começar por mudanças grandes.

## Checklist de domínio

- [ ] Sei relatar um bug útil.
- [ ] Sei onde acompanhar discussões.
- [ ] Sei escolher uma primeira contribuição.

## Resumo

Contribuir vai de documentação a código. Listas e commitfests organizam o projeto. Comece pequeno, com clareza e respeito.
