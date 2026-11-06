---
slug: "criptografia-assimetrica"
title: "Criptografia assimétrica"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["criptografia-simetrica"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Criptografia assimétrica”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender par de chaves pública/privada e troca de chaves."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender par de chaves pública/privada e troca de chaves. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Marcar cookies com HttpOnly, Secure e SameSite reduz riscos de roubo e CSRF."
    answer: true
    explanation: "As flags restringem acesso por JavaScript, exigem HTTPS e limitam envio entre sites."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Criptografia assimétrica”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "RSA, ECC"
      - "chave pública cifra, privada decifra"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: RSA, ECC, chave pública cifra, privada decifra. Os outros itens pertencem a outras lições."
---

# Criptografia assimétrica

> **Objetivo:** Entender par de chaves pública/privada e troca de chaves.

Aqui cada pessoa tem duas chaves: a **pública** (pode divulgar) e a **privada** (guarda a sete chaves). Quem quer enviar algo secreto cifra com a pública do destinatário; só a privada abre. É mais lenta, então na prática se usa **criptografia híbrida**: a assimétrica troca uma chave simétrica de sessão, e a simétrica protege o resto da conversa (é assim que o TLS funciona).

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Criptografia assimétrica**, dentro do módulo **Criptografia**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **RSA, ECC**
- **chave pública cifra, privada decifra**
- **Diffie-Hellman**
- **criptografia híbrida**
- **tamanhos de chave**
- **computação quântica (visão geral)**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **RSA, ECC** com minhas próprias palavras.
- [ ] Consigo explicar **chave pública cifra, privada decifra** com minhas próprias palavras.
- [ ] Consigo explicar **Diffie-Hellman** com minhas próprias palavras.


### Aplique agora

1. Resuma **RSA, ECC** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **chave pública cifra, privada decifra** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Criptografia assimétrica**.

## Resumo

Entender par de chaves pública/privada e troca de chaves. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
