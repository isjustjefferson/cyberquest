---
slug: "lab-hashes-e-encoding"
title: "Lab: Hashes, encoding e hashes fracos"
kind: lab
difficulty: 2
est_minutes: 25
xp: 200
status: complete
prerequisites: ["tls-e-pki"]
lab_slug: "hashes-e-encoding"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Hashes, encoding e hashes fracos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Decodificar encodings, calcular hashes e quebrar hashes fracos **fictícios** do ambiente."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Decodificar encodings, calcular hashes e quebrar hashes fracos **fictícios** do ambiente. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "JWT é criptografado por padrão e por isso não deve ser validado no servidor."
    answer: false
    explanation: "JWT normalmente é apenas assinado e codificado, não criptografado. A assinatura deve ser validada no servidor."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Hashes, encoding e hashes fracos”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "handshake TLS (visão geral)"
      - "certificados X.509"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: handshake TLS (visão geral), certificados X.509. Os outros itens pertencem a outras lições."
---

# Lab: Hashes, encoding e hashes fracos

> **Objetivo:** Decodificar encodings, calcular hashes e quebrar hashes fracos **fictícios** do ambiente.

O alvo contém mensagens em Base64/hex, arquivos com hashes e uma lista fictícia de senhas fracas. Você aprende na prática que Base64 não protege e que hashes sem *salt* de senhas comuns caem rápido com uma wordlist. Lição: usar hashes lentos e com salt (argon2/bcrypt).

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Lab: Hashes, encoding e hashes fracos**, dentro do módulo **Criptografia**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **handshake TLS (visão geral)**
- **certificados X.509**
- **cadeia de confiança**
- **CA raiz e intermediária**
- **validade e revogação**
- **erros de certificado**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Hashes, encoding e hashes fracos**.

## Resumo

Decodificar encodings, calcular hashes e quebrar hashes fracos **fictícios** do ambiente. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
