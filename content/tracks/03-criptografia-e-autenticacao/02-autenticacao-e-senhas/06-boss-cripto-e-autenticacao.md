---
slug: "boss-cripto-e-autenticacao"
title: "Boss: Criptografia e Autenticação"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: complete
prerequisites: ["sso-oauth-oidc"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Criptografia e Autenticação”?"
    options:
      - "Revisar e aplicar os principais conceitos do módulo Autenticação e senhas em um desafio integrado."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Revisar e aplicar os principais conceitos do módulo Autenticação e senhas em um desafio integrado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um hash pode ser revertido com a chave correta, como uma cifra."
    answer: false
    explanation: "Hash é função de mão única. Para senhas, usa-se derivação lenta com salt, não reversão."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Boss: Criptografia e Autenticação”?"
    options:
      - "SSO"
      - "OAuth2 (autorização delegada) vs. OIDC (identidade)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: SSO, OAuth2 (autorização delegada) vs. OIDC (identidade). Os outros itens pertencem a outras lições."
---

# Boss: Criptografia e Autenticação

> **Objetivo:** Revisar e aplicar os principais conceitos do módulo Autenticação e senhas em um desafio integrado.

8 exercícios cronometrados: identificar hash/encoding/cripto, escolher algoritmo para senhas, ordenar handshake TLS, avaliar uma política de senhas e achar falhas em uso de JWT.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Boss: Criptografia e Autenticação**, dentro do módulo **Autenticação e senhas**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **SSO**
- **OAuth2 (autorização delegada) vs. OIDC (identidade)**
- **papéis (usuário, cliente, servidor de autorização)**
- **escopos**
- **fluxo authorization code (visão geral)**
- **SAML (menção)**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Criptografia e Autenticação**.

## Resumo

Revisar e aplicar os principais conceitos do módulo Autenticação e senhas em um desafio integrado. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
