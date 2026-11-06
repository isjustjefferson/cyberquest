---
slug: "tls-e-pki"
title: "TLS, HTTPS e PKI"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["assinaturas-digitais"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “TLS, HTTPS e PKI”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender o que acontece ao abrir um site HTTPS e o papel das autoridades certificadoras."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender o que acontece ao abrir um site HTTPS e o papel das autoridades certificadoras. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Salt único por usuário dificulta ataques de tabelas pré-computadas."
    answer: true
    explanation: "O salt garante que senhas iguais gerem hashes diferentes e inviabiliza rainbow tables."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “TLS, HTTPS e PKI”?"
    options:
      - "certificados X.509"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "handshake TLS (visão geral)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: handshake TLS (visão geral), certificados X.509. Os outros itens pertencem a outras lições."
---

# TLS, HTTPS e PKI

> **Objetivo:** Entender o que acontece ao abrir um site HTTPS e o papel das autoridades certificadoras.

No handshake, o servidor mostra seu **certificado**, assinado por uma Autoridade Certificadora em que seu navegador confia. O cliente verifica a cadeia, o domínio e a validade; depois negociam uma chave de sessão. Ignorar avisos de certificado é abrir a porta ao MITM. O **HSTS** instrui o navegador a só usar HTTPS naquele site.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **TLS, HTTPS e PKI**, dentro do módulo **Criptografia**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **handshake TLS (visão geral)**
- **certificados X.509**
- **cadeia de confiança**
- **CA raiz e intermediária**
- **validade e revogação**
- **erros de certificado**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **handshake TLS (visão geral)** com minhas próprias palavras.
- [ ] Consigo explicar **certificados X.509** com minhas próprias palavras.
- [ ] Consigo explicar **cadeia de confiança** com minhas próprias palavras.


### Aplique agora

1. Resuma **handshake TLS (visão geral)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **certificados X.509** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **TLS, HTTPS e PKI**.

## Resumo

Entender o que acontece ao abrir um site HTTPS e o papel das autoridades certificadoras. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
