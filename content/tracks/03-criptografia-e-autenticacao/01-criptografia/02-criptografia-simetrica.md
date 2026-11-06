---
slug: "criptografia-simetrica"
title: "Criptografia simétrica"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["hash-encoding-criptografia"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Criptografia simétrica”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Entender cifras com a mesma chave para cifrar e decifrar."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Entender cifras com a mesma chave para cifrar e decifrar. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "JWT é criptografado por padrão e por isso não deve ser validado no servidor."
    answer: false
    explanation: "JWT normalmente é apenas assinado e codificado, não criptografado. A assinatura deve ser validada no servidor."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Criptografia simétrica”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "AES (128/256)"
      - "modos (ECB inseguro, CBC, GCM)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: AES (128/256), modos (ECB inseguro, CBC, GCM). Os outros itens pertencem a outras lições."
---

# Criptografia simétrica

> **Objetivo:** Entender cifras com a mesma chave para cifrar e decifrar.

Na criptografia simétrica, a mesma chave tranca e destranca, como uma chave de casa. É rápida e ideal para volumes grandes de dados. O difícil é combinar a chave com o outro lado sem que alguém a intercepte. O **modo** importa: o ECB repete padrões (a famosa imagem do pinguim ainda visível após "cifrar"), enquanto modos como GCM também garantem integridade. Nunca reutilize o nonce com a mesma chave.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Criptografia simétrica**, dentro do módulo **Criptografia**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **AES (128/256)**
- **modos (ECB inseguro, CBC, GCM)**
- **IV/nonce**
- **desafio da distribuição de chaves**
- **cifras de fluxo (ChaCha20)**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **AES (128/256)** com minhas próprias palavras.
- [ ] Consigo explicar **modos (ECB inseguro, CBC, GCM)** com minhas próprias palavras.
- [ ] Consigo explicar **IV/nonce** com minhas próprias palavras.


### Aplique agora

1. Resuma **AES (128/256)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **modos (ECB inseguro, CBC, GCM)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Criptografia simétrica**.

## Resumo

Entender cifras com a mesma chave para cifrar e decifrar. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
