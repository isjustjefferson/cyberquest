---
slug: "armazenamento-e-segredos"
title: "Armazenamento e segredos"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["iam-e-menor-privilegio"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Armazenamento e segredos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Evitar vazamentos por buckets e segredos expostos."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Evitar vazamentos por buckets e segredos expostos. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "No modelo de responsabilidade compartilhada, o provedor cuida de toda a configuração do cliente."
    answer: false
    explanation: "O provedor protege a infraestrutura; o cliente ainda responde por identidade, dados e configuração."
---

# Armazenamento e segredos

> **Objetivo:** Evitar vazamentos por buckets e segredos expostos.

Muitos vazamentos famosos vieram de buckets públicos e de chaves comitadas no Git. Defina acesso privado por padrão, cifre dados e use um cofre de segredos com rotação. Se um segredo vazar, **revogue e troque**: apagar o commit não basta, pois ele permanece no histórico.

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **Armazenamento e segredos**, dentro do módulo **Nuvem**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **buckets privados por padrão**
- **criptografia em repouso e em trânsito**
- **gerenciadores de segredos**
- **variáveis de ambiente vs. cofres**
- **varredura de segredos em repositórios**
- **rotação**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- usar credenciais de longa duração.
- rodar containers como root.
- guardar segredos na imagem.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **buckets privados por padrão** com minhas próprias palavras.
- [ ] Consigo explicar **criptografia em repouso e em trânsito** com minhas próprias palavras.
- [ ] Consigo explicar **gerenciadores de segredos** com minhas próprias palavras.


## Resumo

Evitar vazamentos por buckets e segredos expostos. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
