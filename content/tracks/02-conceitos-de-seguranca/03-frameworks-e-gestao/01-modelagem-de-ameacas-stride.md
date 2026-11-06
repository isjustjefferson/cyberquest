---
slug: "modelagem-de-ameacas-stride"
title: "Modelagem de ameaças (STRIDE)"
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
    question: "Qual alternativa descreve o foco principal da lição “Modelagem de ameaças (STRIDE)”?"
    options:
      - "Aplicar STRIDE a um diagrama simples."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Aplicar STRIDE a um diagrama simples. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Confidencialidade, integridade e disponibilidade formam a tríade CIA."
    answer: true
    explanation: "São os três objetivos clássicos da segurança da informação."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Modelagem de ameaças (STRIDE)”?"
    options:
      - "DFD (processos, depósitos, fluxos, fronteiras de confiança)"
      - "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: DFD (processos, depósitos, fluxos, fronteiras de confiança), Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Os outros itens pertencem a outras lições."
---

# Modelagem de ameaças (STRIDE)

> **Objetivo:** Aplicar STRIDE a um diagrama simples.

Modelar ameaças é pensar como atacante **antes** de construir. Desenhe o sistema, marque as fronteiras de confiança e, para cada elemento, pergunte o que pode dar errado usando STRIDE. Ex.: num login, *Spoofing* (alguém finge ser outro), *Tampering* (alterar a requisição), *Information disclosure* (mensagens de erro vazam dados).

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Modelagem de ameaças (STRIDE)**, dentro do módulo **Frameworks e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **DFD (processos, depósitos, fluxos, fronteiras de confiança)**
- **Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **DFD (processos, depósitos, fluxos, fronteiras de confiança)** com minhas próprias palavras.
- [ ] Consigo explicar **Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege** com minhas próprias palavras.


### Aplique agora

1. Resuma **DFD (processos, depósitos, fluxos, fronteiras de confiança)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Modelagem de ameaças (STRIDE)**.

## Resumo

Aplicar STRIDE a um diagrama simples. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
