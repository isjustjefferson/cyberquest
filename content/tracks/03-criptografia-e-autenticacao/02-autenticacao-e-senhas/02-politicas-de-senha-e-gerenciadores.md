---
slug: "politicas-de-senha-e-gerenciadores"
title: "Políticas de senha e gerenciadores"
kind: lesson
difficulty: 1
est_minutes: 8
xp: 30
status: complete
prerequisites: ["armazenamento-seguro-de-senhas"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Políticas de senha e gerenciadores”?"
    options:
      - "Boas práticas para usuários e administradores."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Boas práticas para usuários e administradores. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um hash pode ser revertido com a chave correta, como uma cifra."
    answer: false
    explanation: "Hash é função de mão única. Para senhas, usa-se derivação lenta com salt, não reversão."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Políticas de senha e gerenciadores”?"
    options:
      - "comprimento > complexidade"
      - "frases-senha"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: comprimento > complexidade, frases-senha. Os outros itens pertencem a outras lições."
---

# Políticas de senha e gerenciadores

> **Objetivo:** Boas práticas para usuários e administradores.

Uma frase longa e única ("cafe-azul-trem-12-lua") é mais forte e mais fácil de lembrar que `P@ssw0rd!`. O maior risco real é **reutilizar** a mesma senha, e o remédio é um gerenciador de senhas. Diretrizes modernas recomendam checar senhas contra listas de vazamentos e não forçar trocas periódicas sem evidência de comprometimento.

## Por que isso importa

Confidencialidade, integridade e identidade dependem de criptografia e autenticação bem usadas. Erros aqui comprometem senhas, sessões e comunicações inteiras. Nesta lição, o foco é **Políticas de senha e gerenciadores**, dentro do módulo **Autenticação e senhas**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **comprimento > complexidade**
- **frases-senha**
- **senha única por serviço**
- **gerenciador de senhas**
- **verificação de vazamentos**
- **evitar rotação forçada sem motivo**

Diferencie hash, cifra e encoding antes de escolher uma solução. Em laboratório, verifique como salt, custo de derivação e flags de cookie mudam o resultado de um ataque. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir hash com criptografia.
- reutilizar IV ou salt.
- guardar segredos no código.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **comprimento > complexidade** com minhas próprias palavras.
- [ ] Consigo explicar **frases-senha** com minhas próprias palavras.
- [ ] Consigo explicar **senha única por serviço** com minhas próprias palavras.


### Aplique agora

1. Resuma **comprimento > complexidade** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **frases-senha** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Políticas de senha e gerenciadores**.

## Resumo

Boas práticas para usuários e administradores. Nunca invente criptografia: use bibliotecas maduras, parâmetros atuais e armazenamento de senhas com algoritmos próprios para esse fim. Pratique em ambiente controlado e documente o que aprendeu.
