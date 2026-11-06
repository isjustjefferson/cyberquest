---
slug: "o-que-e-hacker-etico"
title: "O que é um hacker ético"
kind: lesson
difficulty: 1
est_minutes: 8
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “O que é um hacker ético”?"
    options:
      - "Entender o que faz um profissional de segurança ofensiva e o que o diferencia de um invasor."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Entender o que faz um profissional de segurança ofensiva e o que o diferencia de um invasor. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Aceitar um teste sem contrato ou autorização por escrito é aceitável quando a intenção é ajudar."
    answer: false
    explanation: "Autorização deve ser explícita e documentada. Boa intenção não cria permissão legal."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “O que é um hacker ético”?"
    options:
      - "hacker vs. cracker"
      - "chapéu branco, cinza e preto"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: hacker vs. cracker, chapéu branco, cinza e preto. Os outros itens pertencem a outras lições."
---

# O que é um hacker ético

> **Objetivo:** Entender o que faz um profissional de segurança ofensiva e o que o diferencia de um invasor.

"Hacker" originalmente é quem gosta de entender como as coisas funcionam e levá-las além do uso previsto. O que muda tudo é a **permissão**. O hacker ético (chapéu branco) é contratado ou autorizado para encontrar falhas antes que alguém mal-intencionado as explore, e entrega um relatório para que a empresa corrija. O chapéu preto age sem autorização, em geral por lucro ou dano. O chapéu cinza fica no meio: pode não ter má intenção, mas age sem autorização, e **isso continua sendo ilegal**. Pense num chaveiro: o mesmo conhecimento abre a porta de um cliente que perdeu a chave ou a de um estranho. A ética está em quem pediu, o que foi combinado e o que se faz com o que foi descoberto. Boas intenções não substituem autorização por escrito.

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **O que é um hacker ético**, dentro do módulo **Ética e Lei**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **hacker vs. cracker**
- **chapéu branco, cinza e preto**
- **segurança ofensiva como serviço**
- **pentest, red team e bug bounty**
- **o papel da autorização**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **hacker vs. cracker** com minhas próprias palavras.
- [ ] Consigo explicar **chapéu branco, cinza e preto** com minhas próprias palavras.
- [ ] Consigo explicar **segurança ofensiva como serviço** com minhas próprias palavras.


### Aplique agora

1. Resuma **hacker vs. cracker** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **chapéu branco, cinza e preto** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **O que é um hacker ético**.

## Resumo

Entender o que faz um profissional de segurança ofensiva e o que o diferencia de um invasor. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
