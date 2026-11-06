---
slug: "assinaturas-digitais"
title: "Assinaturas digitais"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["criptografia-assimetrica"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Assinaturas digitais”?"
    options:
      - "Entender como garantir autoria e integridade."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Entender como garantir autoria e integridade. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um hash pode ser revertido com a chave correta, como uma cifra."
    answer: false
    explanation: "Hash é função de mão única. Para senhas, usa-se derivação lenta com salt, não reversão."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Assinaturas digitais”?"
    options:
      - "hash + chave privada"
      - "verificação com chave pública"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: hash + chave privada, verificação com chave pública. Os outros itens pertencem a outras lições."
---

# Assinaturas digitais

> **Objetivo:** Entender como garantir autoria e integridade.

Para assinar, você calcula o hash do documento e o "assina" com sua **chave privada**. Qualquer um verifica com sua **chave pública**: se bater, o documento não foi alterado e foi você quem assinou. É o inverso do fluxo de cifrar. Usado em atualizações de software, certificados e commits assinados.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Assinaturas digitais**, dentro do módulo **Criptografia**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **hash + chave privada**
- **verificação com chave pública**
- **não repúdio**
- **assinatura de código e commits**
- **diferença entre assinar e cifrar**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **hash + chave privada** com minhas próprias palavras.
- [ ] Consigo explicar **verificação com chave pública** com minhas próprias palavras.
- [ ] Consigo explicar **não repúdio** com minhas próprias palavras.


### Aplique agora

1. Resuma **hash + chave privada** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **verificação com chave pública** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Assinaturas digitais**.

## Resumo

Entender como garantir autoria e integridade. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
