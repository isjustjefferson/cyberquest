---
slug: "legislacao-brasileira"
title: "Legislação brasileira em segurança"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: ["escopo-autorizacao-e-regras"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Legislação brasileira em segurança”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Conhecer as leis mais relevantes para quem atua com segurança no Brasil."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Conhecer as leis mais relevantes para quem atua com segurança no Brasil. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Divulgação responsável dá ao fornecedor tempo para corrigir antes da publicação."
    answer: true
    explanation: "A divulgação coordenada reduz o risco de exploração enquanto a correção é preparada."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Legislação brasileira em segurança”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021"
      - "Marco Civil da Internet (Lei 12.965/2014)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021, Marco Civil da Internet (Lei 12.965/2014). Os outros itens pertencem a outras lições."
---

# Legislação brasileira em segurança

> **Objetivo:** Conhecer as leis mais relevantes para quem atua com segurança no Brasil.

A chamada "Lei Carolina Dieckmann" tipificou a invasão de dispositivo informático alheio, mediante violação de mecanismo de segurança, com o fim de obter, adulterar ou destruir dados. Mudanças posteriores aumentaram as penas. O Marco Civil estabelece princípios, direitos e deveres no uso da internet, incluindo guarda de registros. A LGPD trata de dados pessoais: um pentest pode expor dados reais, então é preciso acordos de confidencialidade e cuidado no manuseio. Não dá para dar aconselhamento jurídico numa lição; o ponto é saber que **existe base legal**, que o consentimento do titular do sistema é essencial e que, em caso de dúvida, um advogado deve ser consultado. (Revisar a legislação vigente antes de publicar o conteúdo.)

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **Legislação brasileira em segurança**, dentro do módulo **Ética e Lei**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021**
- **Marco Civil da Internet (Lei 12.965/2014)**
- **LGPD (Lei 13.709/2018)**
- **incidentes e comunicação à ANPD**
- **responsabilidade civil e criminal**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021** com minhas próprias palavras.
- [ ] Consigo explicar **Marco Civil da Internet (Lei 12.965/2014)** com minhas próprias palavras.
- [ ] Consigo explicar **LGPD (Lei 13.709/2018)** com minhas próprias palavras.


### Aplique agora

1. Resuma **Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **Marco Civil da Internet (Lei 12.965/2014)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Legislação brasileira em segurança**.

## Resumo

Conhecer as leis mais relevantes para quem atua com segurança no Brasil. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
