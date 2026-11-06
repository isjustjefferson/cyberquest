---
slug: "engenharia-social-e-phishing"
title: "Engenharia social e phishing"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["malware-conceitos"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Engenharia social e phishing”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Reconhecer golpes que exploram pessoas e saber como mitigar."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Reconhecer golpes que exploram pessoas e saber como mitigar. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um risco existe mesmo sem uma vulnerabilidade explorável ou uma ameaça concreta."
    answer: false
    explanation: "Risco combina ativo, ameaça e vulnerabilidade. Sem caminho plausível de exploração, o risco muda de natureza."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Engenharia social e phishing”?"
    options:
      - "gatilhos (urgência, autoridade, medo)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "phishing, spear phishing, vishing, smishing, pretexting, BEC"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: phishing, spear phishing, vishing, smishing, pretexting, BEC, gatilhos (urgência, autoridade, medo). Os outros itens pertencem a outras lições."
---

# Engenharia social e phishing

> **Objetivo:** Reconhecer golpes que exploram pessoas e saber como mitigar.

A parte mais fraca costuma ser a humana. O atacante cria **urgência** ("sua conta será bloqueada em 1 hora") ou finge **autoridade** (o "diretor") para que você aja sem pensar. Sinais: domínio parecido com o real, links que levam a outro endereço, anexos inesperados, pedidos de pagamento ou senha. Defesa: parar, verificar por outro canal, usar MFA e reportar. Em empresas, simulações de phishing **autorizadas** servem para treinar.

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Engenharia social e phishing**, dentro do módulo **Ameaças**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **phishing, spear phishing, vishing, smishing, pretexting, BEC**
- **gatilhos (urgência, autoridade, medo)**
- **sinais de alerta**
- **verificação por canal alternativo**
- **simulações autorizadas**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **phishing, spear phishing, vishing, smishing, pretexting, BEC** com minhas próprias palavras.
- [ ] Consigo explicar **gatilhos (urgência, autoridade, medo)** com minhas próprias palavras.
- [ ] Consigo explicar **sinais de alerta** com minhas próprias palavras.


### Aplique agora

1. Resuma **phishing, spear phishing, vishing, smishing, pretexting, BEC** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **gatilhos (urgência, autoridade, medo)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Engenharia social e phishing**.

## Resumo

Reconhecer golpes que exploram pessoas e saber como mitigar. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
