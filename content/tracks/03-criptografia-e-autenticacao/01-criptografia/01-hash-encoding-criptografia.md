---
slug: "hash-encoding-criptografia"
title: "Hash, criptografia e encoding: não confunda"
kind: lesson
difficulty: 1
est_minutes: 12
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Hash, criptografia e encoding: não confunda”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Diferenciar três conceitos que iniciantes misturam."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Diferenciar três conceitos que iniciantes misturam. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Salt único por usuário dificulta ataques de tabelas pré-computadas."
    answer: true
    explanation: "O salt garante que senhas iguais gerem hashes diferentes e inviabiliza rainbow tables."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Hash, criptografia e encoding: não confunda”?"
    options:
      - "hash é via de mão única"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "encoding (Base64, URL, hex) não é segurança"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: encoding (Base64, URL, hex) não é segurança, hash é via de mão única. Os outros itens pertencem a outras lições."
---

# Hash, criptografia e encoding: não confunda

> **Objetivo:** Diferenciar três conceitos que iniciantes misturam.

**Encoding** só muda a representação (Base64 de "oi" é `b2k=`), qualquer um reverte, então **não protege nada**. **Hash** transforma um dado em uma "impressão digital" de tamanho fixo e não tem volta: serve para verificar integridade e guardar senhas (com cuidados). **Criptografia** embaralha dados de forma reversível para quem tem a chave. Se alguém "protege" uma senha com Base64, não protegeu: só disfarçou.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Hash, criptografia e encoding: não confunda**, dentro do módulo **Criptografia**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **encoding (Base64, URL, hex) não é segurança**
- **hash é via de mão única**
- **criptografia é reversível com chave**
- **exemplos (SHA-256, AES)**
- **colisões**
- **uso de cada um**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **encoding (Base64, URL, hex) não é segurança** com minhas próprias palavras.
- [ ] Consigo explicar **hash é via de mão única** com minhas próprias palavras.
- [ ] Consigo explicar **criptografia é reversível com chave** com minhas próprias palavras.


### Aplique agora

1. Resuma **encoding (Base64, URL, hex) não é segurança** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **hash é via de mão única** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Hash, criptografia e encoding: não confunda**.

## Resumo

Diferenciar três conceitos que iniciantes misturam. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
