---
slug: "divulgacao-responsavel-e-bug-bounty"
title: "Divulgação responsável e bug bounty"
kind: lesson
difficulty: 1
est_minutes: 8
xp: 30
status: complete
prerequisites: ["legislacao-brasileira"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Divulgação responsável e bug bounty”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Saber o que fazer ao encontrar uma vulnerabilidade e como programas de recompensa funcionam."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Saber o que fazer ao encontrar uma vulnerabilidade e como programas de recompensa funcionam. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O escopo de um pentest deve listar sistemas, janelas de teste e regras de engajamento."
    answer: true
    explanation: "Escopo e ROE definem o que pode ser feito, quando e como, protegendo cliente e profissional."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Divulgação responsável e bug bounty”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "divulgação coordenada"
      - "VDP (Vulnerability Disclosure Policy)"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: divulgação coordenada, VDP (Vulnerability Disclosure Policy). Os outros itens pertencem a outras lições."
---

# Divulgação responsável e bug bounty

> **Objetivo:** Saber o que fazer ao encontrar uma vulnerabilidade e como programas de recompensa funcionam.

Se você encontra uma falha em um sistema que não é seu, o caminho seguro é procurar a **política de divulgação** da organização (muitas publicam em `/.well-known/security.txt`). Programas de bug bounty definem escopo, regras e recompensas, e muitos oferecem "safe harbor", que é a promessa de não processar quem seguir as regras. Reporte só o necessário para provar o problema, sem acessar dados de terceiros nem causar indisponibilidade. A divulgação coordenada dá tempo para a correção antes de qualquer publicação, por isso é comum combinar prazos.

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **Divulgação responsável e bug bounty**, dentro do módulo **Ética e Lei**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **divulgação coordenada**
- **VDP (Vulnerability Disclosure Policy)**
- **bug bounty**
- **"safe harbor"**
- **prazos comuns**
- **não explorar além do necessário**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **divulgação coordenada** com minhas próprias palavras.
- [ ] Consigo explicar **VDP (Vulnerability Disclosure Policy)** com minhas próprias palavras.
- [ ] Consigo explicar **bug bounty** com minhas próprias palavras.


### Aplique agora

1. Resuma **divulgação coordenada** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **VDP (Vulnerability Disclosure Policy)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Divulgação responsável e bug bounty**.

## Resumo

Saber o que fazer ao encontrar uma vulnerabilidade e como programas de recompensa funcionam. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
