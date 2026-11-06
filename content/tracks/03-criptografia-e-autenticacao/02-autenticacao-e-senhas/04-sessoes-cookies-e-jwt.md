---
slug: "sessoes-cookies-e-jwt"
title: "Sessões, cookies e JWT"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["mfa-e-totp"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Sessões, cookies e JWT”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Entender como aplicações mantêm o usuário logado e os erros comuns."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Entender como aplicações mantêm o usuário logado e os erros comuns. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "JWT é criptografado por padrão e por isso não deve ser validado no servidor."
    answer: false
    explanation: "JWT normalmente é apenas assinado e codificado, não criptografado. A assinatura deve ser validada no servidor."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Sessões, cookies e JWT”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "sessão no servidor vs. token"
      - "cookies seguros"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: sessão no servidor vs. token, cookies seguros. Os outros itens pertencem a outras lições."
---

# Sessões, cookies e JWT

> **Objetivo:** Entender como aplicações mantêm o usuário logado e os erros comuns.

HTTP não tem memória; a sessão resolve isso. Cookie de sessão com `HttpOnly`, `Secure` e `SameSite` é uma boa base. Um **JWT** carrega dados assinados; **não é criptografado** (o payload é só Base64), então não coloque segredos nele. Erros clássicos: segredo de assinatura fraco, aceitar algoritmo `none`, tokens que nunca expiram e guardá-los em locais acessíveis a scripts.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Sessões, cookies e JWT**, dentro do módulo **Autenticação e senhas**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **sessão no servidor vs. token**
- **cookies seguros**
- **JWT (header.payload.assinatura)**
- **alg=none e segredos fracos (conceito)**
- **expiração e revogação**
- **onde guardar tokens**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **sessão no servidor vs. token** com minhas próprias palavras.
- [ ] Consigo explicar **cookies seguros** com minhas próprias palavras.
- [ ] Consigo explicar **JWT (header.payload.assinatura)** com minhas próprias palavras.


### Aplique agora

1. Resuma **sessão no servidor vs. token** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **cookies seguros** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Sessões, cookies e JWT**.

## Resumo

Entender como aplicações mantêm o usuário logado e os erros comuns. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
