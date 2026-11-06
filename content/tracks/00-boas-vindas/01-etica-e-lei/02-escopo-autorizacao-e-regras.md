---
slug: "escopo-autorizacao-e-regras"
title: "Escopo, autorização e regras de engajamento"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: ["o-que-e-hacker-etico"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Escopo, autorização e regras de engajamento”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Saber o que precisa estar combinado antes de qualquer teste."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Saber o que precisa estar combinado antes de qualquer teste. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Encontrar uma falha fora do escopo autoriza você a continuar testando para confirmar o problema."
    answer: false
    explanation: "Ao encontrar algo fora do escopo, pare e comunique o contratante. Continuar pode caracterizar acesso não autorizado."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Escopo, autorização e regras de engajamento”?"
    options:
      - "escopo (o que pode e o que não pode)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "contrato e carta de autorização"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: contrato e carta de autorização, escopo (o que pode e o que não pode). Os outros itens pertencem a outras lições."
---

# Escopo, autorização e regras de engajamento

> **Objetivo:** Saber o que precisa estar combinado antes de qualquer teste.

Todo teste profissional começa no papel. O **escopo** lista exatamente quais sistemas, IPs, aplicações e períodos podem ser testados. As **regras de engajamento** dizem como: se pode haver negação de serviço, se engenharia social é permitida, em que horários, quem avisar se algo quebrar. Acesse algo fora do escopo (um servidor vizinho, por exemplo) e você deixa de ser pentester e vira invasor, mesmo que tenha chegado lá "sem querer". Se encontrar algo grave fora do escopo, pare e comunique. Documentar tudo também protege você: logs e relatórios provam o que foi feito e quando.

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **Escopo, autorização e regras de engajamento**, dentro do módulo **Ética e Lei**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **contrato e carta de autorização**
- **escopo (o que pode e o que não pode)**
- **janela de testes**
- **regras de engajamento (ROE)**
- **contatos de emergência**
- **dados sensíveis**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **contrato e carta de autorização** com minhas próprias palavras.
- [ ] Consigo explicar **escopo (o que pode e o que não pode)** com minhas próprias palavras.
- [ ] Consigo explicar **janela de testes** com minhas próprias palavras.


### Aplique agora

1. Resuma **contrato e carta de autorização** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **escopo (o que pode e o que não pode)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Escopo, autorização e regras de engajamento**.

## Resumo

Saber o que precisa estar combinado antes de qualquer teste. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
