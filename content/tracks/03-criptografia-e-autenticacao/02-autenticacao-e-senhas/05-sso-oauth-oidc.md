---
slug: "sso-oauth-oidc"
title: "SSO, OAuth2 e OIDC"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["sessoes-cookies-e-jwt"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “SSO, OAuth2 e OIDC”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Visão geral de login federado."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Visão geral de login federado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Marcar cookies com HttpOnly, Secure e SameSite reduz riscos de roubo e CSRF."
    answer: true
    explanation: "As flags restringem acesso por JavaScript, exigem HTTPS e limitam envio entre sites."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “SSO, OAuth2 e OIDC”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "SSO"
      - "OAuth2 (autorização delegada) vs. OIDC (identidade)"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: SSO, OAuth2 (autorização delegada) vs. OIDC (identidade). Os outros itens pertencem a outras lições."
---

# SSO, OAuth2 e OIDC

> **Objetivo:** Visão geral de login federado.

Quando você usa "Entrar com Google", o site não vê sua senha: o provedor autentica e entrega ao site um token. **OAuth2** trata de *autorização* (o que o app pode acessar); **OIDC** adiciona *identidade* (quem você é). Erros típicos: validar mal o `redirect_uri`, não usar `state` e escopos excessivos.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **SSO, OAuth2 e OIDC**, dentro do módulo **Autenticação e senhas**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **SSO**
- **OAuth2 (autorização delegada) vs. OIDC (identidade)**
- **papéis (usuário, cliente, servidor de autorização)**
- **escopos**
- **fluxo authorization code (visão geral)**
- **SAML (menção)**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **SSO** com minhas próprias palavras.
- [ ] Consigo explicar **OAuth2 (autorização delegada) vs. OIDC (identidade)** com minhas próprias palavras.
- [ ] Consigo explicar **papéis (usuário, cliente, servidor de autorização)** com minhas próprias palavras.


### Aplique agora

1. Resuma **SSO** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **OAuth2 (autorização delegada) vs. OIDC (identidade)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **SSO, OAuth2 e OIDC**.

## Resumo

Visão geral de login federado. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
