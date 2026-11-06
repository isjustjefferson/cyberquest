---
slug: "expressoes-regulares"
title: "Expressões regulares"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["python-para-seguranca"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Expressões regulares”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O pipe | envia a saída de um comando como entrada de outro."
    answer: true
    explanation: "O pipe permite combinar comandos pequenos para filtrar e transformar dados."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Expressões regulares”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "classes \\d, \\w"
      - "quantificadores + * ?"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: classes \\d, \\w, quantificadores + * ?. Os outros itens pertencem a outras lições."
---

# Expressões regulares

> **Objetivo:** Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs.

Regex descreve padrões de texto. `\b\d{1,3}(\.\d{1,3}){3}\b` encontra IPs simples. É muito usada em análise de logs, regras de detecção e na procura de segredos expostos em código. Cuidado com regex complexas: podem ser lentas e imprecisas.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Expressões regulares**, dentro do módulo **Scripting**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **classes \d, \w**
- **quantificadores + * ?**
- **âncoras**
- **grupos**
- **grep -E**
- **testar no Python**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **classes \d, \w** com minhas próprias palavras.
- [ ] Consigo explicar **quantificadores + * ?** com minhas próprias palavras.
- [ ] Consigo explicar **âncoras** com minhas próprias palavras.


### Aplique agora

1. Resuma **classes \d, \w** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **quantificadores + * ?** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Expressões regulares**.

## Resumo

Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
