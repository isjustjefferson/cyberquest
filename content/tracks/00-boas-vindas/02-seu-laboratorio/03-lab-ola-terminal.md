---
slug: "lab-ola-terminal"
title: "Lab: Olá, terminal"
kind: lab
difficulty: 1
est_minutes: 15
xp: 150
status: complete
prerequisites: ["preparando-o-docker"]
lab_slug: "ola-terminal"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Olá, terminal”?"
    options:
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Divulgação responsável dá ao fornecedor tempo para corrigir antes da publicação."
    answer: true
    explanation: "A divulgação coordenada reduz o risco de exploração enquanto a correção é preparada."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Olá, terminal”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "abrir sessão de lab"
      - "terminal web"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: abrir sessão de lab, terminal web. Os outros itens pertencem a outras lições."
---

# Lab: Olá, terminal

> **Objetivo:** Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples.

Este lab guiado apresenta o ambiente: um container "attacker" com seu terminal e um alvo com um arquivo escondido. Você usa comandos básicos para explorar o diretório, ler o arquivo e achar a flag. O foco é o fluxo da plataforma: iniciar, usar, validar e encerrar.

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **Lab: Olá, terminal**, dentro do módulo **Seu laboratório**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **abrir sessão de lab**
- **terminal web**
- **ls, cat, whoami**
- **submeter flag**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **abrir sessão de lab** com minhas próprias palavras.
- [ ] Consigo explicar **terminal web** com minhas próprias palavras.
- [ ] Consigo explicar **ls, cat, whoami** com minhas próprias palavras.


### Aplique agora

1. Resuma **abrir sessão de lab** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **terminal web** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Olá, terminal**.

## Resumo

Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
