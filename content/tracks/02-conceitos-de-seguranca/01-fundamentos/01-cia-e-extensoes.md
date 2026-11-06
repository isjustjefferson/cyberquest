---
slug: "cia-e-extensoes"
title: "Tríade CIA e extensões"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Tríade CIA e extensões”?"
    options:
      - "Dominar Confidencialidade, Integridade e Disponibilidade e usá-las para classificar incidentes."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Dominar Confidencialidade, Integridade e Disponibilidade e usá-las para classificar incidentes. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Confidencialidade, integridade e disponibilidade formam a tríade CIA."
    answer: true
    explanation: "São os três objetivos clássicos da segurança da informação."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Tríade CIA e extensões”?"
    options:
      - "CIA"
      - "autenticidade e não repúdio"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: CIA, autenticidade e não repúdio. Os outros itens pertencem a outras lições."
---

# Tríade CIA e extensões

> **Objetivo:** Dominar Confidencialidade, Integridade e Disponibilidade e usá-las para classificar incidentes.

**Confidencialidade**: só quem deve vê, vê (vazamento de dados a quebra). **Integridade**: os dados não são alterados indevidamente (um atacante muda o valor de uma transferência). **Disponibilidade**: o sistema está acessível quando preciso (um ataque de negação de serviço a quebra). Quase toda decisão de segurança equilibra os três: criptografar tudo protege a confidencialidade, mas pode dificultar a recuperação (disponibilidade). Acrescente **autenticidade** (quem é quem) e **não repúdio** (o autor não pode negar a ação).

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Tríade CIA e extensões**, dentro do módulo **Fundamentos**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **CIA**
- **autenticidade e não repúdio**
- **exemplos de violação de cada pilar**
- **trade-offs**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **CIA** com minhas próprias palavras.
- [ ] Consigo explicar **autenticidade e não repúdio** com minhas próprias palavras.
- [ ] Consigo explicar **exemplos de violação de cada pilar** com minhas próprias palavras.


### Aplique agora

1. Resuma **CIA** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **autenticidade e não repúdio** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Tríade CIA e extensões**.

## Resumo

Dominar Confidencialidade, Integridade e Disponibilidade e usá-las para classificar incidentes. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
