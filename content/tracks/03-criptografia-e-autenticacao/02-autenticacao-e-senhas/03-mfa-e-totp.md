---
slug: "mfa-e-totp"
title: "MFA e TOTP"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["politicas-de-senha-e-gerenciadores"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “MFA e TOTP”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender segundo fator, TOTP e chaves de segurança."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender segundo fator, TOTP e chaves de segurança. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Salt único por usuário dificulta ataques de tabelas pré-computadas."
    answer: true
    explanation: "O salt garante que senhas iguais gerem hashes diferentes e inviabiliza rainbow tables."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “MFA e TOTP”?"
    options:
      - "TOTP (segredo compartilhado + tempo)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "SMS vs. app autenticador vs. chave física (FIDO2/passkeys)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: SMS vs. app autenticador vs. chave física (FIDO2/passkeys), TOTP (segredo compartilhado + tempo). Os outros itens pertencem a outras lições."
---

# MFA e TOTP

> **Objetivo:** Entender segundo fator, TOTP e chaves de segurança.

O MFA exige mais de um tipo de prova. O **TOTP** gera um código de 6 dígitos a partir de um segredo e do horário, válido por ~30 s. **Passkeys/FIDO2** resistem a phishing porque a credencial é vinculada ao domínio real. SMS é melhor que nada, mas é o mais fraco (troca de chip, interceptação).

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **MFA e TOTP**, dentro do módulo **Autenticação e senhas**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **SMS vs. app autenticador vs. chave física (FIDO2/passkeys)**
- **TOTP (segredo compartilhado + tempo)**
- **fadiga de MFA**
- **códigos de recuperação**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **SMS vs. app autenticador vs. chave física (FIDO2/passkeys)** com minhas próprias palavras.
- [ ] Consigo explicar **TOTP (segredo compartilhado + tempo)** com minhas próprias palavras.
- [ ] Consigo explicar **fadiga de MFA** com minhas próprias palavras.


### Aplique agora

1. Resuma **SMS vs. app autenticador vs. chave física (FIDO2/passkeys)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **TOTP (segredo compartilhado + tempo)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **MFA e TOTP**.

## Resumo

Entender segundo fator, TOTP e chaves de segurança. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
