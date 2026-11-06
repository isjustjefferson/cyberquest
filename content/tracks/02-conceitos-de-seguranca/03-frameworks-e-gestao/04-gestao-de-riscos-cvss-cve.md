---
slug: "gestao-de-riscos-cvss-cve"
title: "Gestão de risco, CVE e CVSS"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["frameworks-nist-iso-cis"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Gestão de risco, CVE e CVSS”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Interpretar identificadores e notas de vulnerabilidades."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Interpretar identificadores e notas de vulnerabilidades. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O princípio do menor privilégio reduz o impacto de uma conta comprometida."
    answer: true
    explanation: "Cada identidade deve ter apenas as permissões necessárias para sua função."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Gestão de risco, CVE e CVSS”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "CVE"
      - "CVSS (gravidade 0–10, vetores)"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: CVE, CVSS (gravidade 0–10, vetores). Os outros itens pertencem a outras lições."
---

# Gestão de risco, CVE e CVSS

> **Objetivo:** Interpretar identificadores e notas de vulnerabilidades.

Um **CVE** identifica uma vulnerabilidade pública (ex.: `CVE-AAAA-NNNN`). O **CVSS** dá uma nota de gravidade técnica, mas não conta tudo: uma falha 9.8 num sistema isolado pode importar menos do que uma 7.5 num servidor exposto e já explorada. O risco se trata: **mitigar**, **aceitar**, **transferir** (seguro) ou **evitar**.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Gestão de risco, CVE e CVSS**, dentro do módulo **Frameworks e gestão**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **CVE**
- **CVSS (gravidade 0–10, vetores)**
- **exploração conhecida (listas de vulnerabilidades exploradas ativamente)**
- **priorização por contexto**
- **tratar, mitigar, aceitar ou transferir risco**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **CVE** com minhas próprias palavras.
- [ ] Consigo explicar **CVSS (gravidade 0–10, vetores)** com minhas próprias palavras.
- [ ] Consigo explicar **exploração conhecida (listas de vulnerabilidades exploradas ativamente)** com minhas próprias palavras.


### Aplique agora

1. Resuma **CVE** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **CVSS (gravidade 0–10, vetores)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Gestão de risco, CVE e CVSS**.

## Resumo

Interpretar identificadores e notas de vulnerabilidades. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
