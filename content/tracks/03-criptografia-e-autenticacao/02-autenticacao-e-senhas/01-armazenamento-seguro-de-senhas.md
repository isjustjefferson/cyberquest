---
slug: "armazenamento-seguro-de-senhas"
title: "Armazenamento seguro de senhas"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Armazenamento seguro de senhas”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Saber como um sistema deve guardar senhas."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Saber como um sistema deve guardar senhas. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Marcar cookies com HttpOnly, Secure e SameSite reduz riscos de roubo e CSRF."
    answer: true
    explanation: "As flags restringem acesso por JavaScript, exigem HTTPS e limitam envio entre sites."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Armazenamento seguro de senhas”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "nunca texto puro"
      - "hashes rápidos (MD5/SHA-1) são inadequados"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: nunca texto puro, hashes rápidos (MD5/SHA-1) são inadequados. Os outros itens pertencem a outras lições."
---

# Armazenamento seguro de senhas

> **Objetivo:** Saber como um sistema deve guardar senhas.

Se o banco vaza, as senhas não devem vazar junto. Hash simples e rápido (MD5, SHA-256 direto) é fácil de atacar com milhões de tentativas por segundo. Use algoritmos **lentos de propósito** (argon2id, bcrypt) com **salt** único por usuário, que torna tabelas pré-calculadas inúteis e impede identificar senhas iguais.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Armazenamento seguro de senhas**, dentro do módulo **Autenticação e senhas**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **nunca texto puro**
- **hashes rápidos (MD5/SHA-1) são inadequados**
- **salt**
- **pepper**
- **argon2id, bcrypt, scrypt**
- **custo ajustável**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **nunca texto puro** com minhas próprias palavras.
- [ ] Consigo explicar **hashes rápidos (MD5/SHA-1) são inadequados** com minhas próprias palavras.
- [ ] Consigo explicar **salt** com minhas próprias palavras.


### Aplique agora

1. Resuma **nunca texto puro** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **hashes rápidos (MD5/SHA-1) são inadequados** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Armazenamento seguro de senhas**.

## Resumo

Saber como um sistema deve guardar senhas. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
