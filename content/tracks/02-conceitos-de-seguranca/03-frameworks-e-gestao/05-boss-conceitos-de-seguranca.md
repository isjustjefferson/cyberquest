---
slug: "boss-conceitos-de-seguranca"
title: "Boss: Conceitos de Segurança"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: complete
prerequisites: ["gestao-de-riscos-cvss-cve"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Conceitos de Segurança”?"
    options:
      - "Revisar e aplicar os principais conceitos do módulo Frameworks e gestão em um desafio integrado."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Revisar e aplicar os principais conceitos do módulo Frameworks e gestão em um desafio integrado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Confidencialidade, integridade e disponibilidade formam a tríade CIA."
    answer: true
    explanation: "São os três objetivos clássicos da segurança da informação."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Boss: Conceitos de Segurança”?"
    options:
      - "CVE"
      - "CVSS (gravidade 0–10, vetores)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: CVE, CVSS (gravidade 0–10, vetores). Os outros itens pertencem a outras lições."
---

# Boss: Conceitos de Segurança

> **Objetivo:** Revisar e aplicar os principais conceitos do módulo Frameworks e gestão em um desafio integrado.

8 exercícios cronometrados: classificar incidentes em CIA, aplicar STRIDE a um mini-diagrama, ordenar a Kill Chain, interpretar CVSS e reconhecer phishing.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Boss: Conceitos de Segurança**, dentro do módulo **Frameworks e gestão**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **CVE**
- **CVSS (gravidade 0–10, vetores)**
- **exploração conhecida (listas de vulnerabilidades exploradas ativamente)**
- **priorização por contexto**
- **tratar, mitigar, aceitar ou transferir risco**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Conceitos de Segurança**.

## Resumo

Revisar e aplicar os principais conceitos do módulo Frameworks e gestão em um desafio integrado. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
