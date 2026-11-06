---
slug: "autenticacao-e-sessao-quebradas"
title: "Autenticação e sessão quebradas"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["controle-de-acesso-quebrado-e-idor"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Autenticação e sessão quebradas”?"
    options:
      - "Identificar falhas em login, recuperação de senha e gestão de sessão."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Identificar falhas em login, recuperação de senha e gestão de sessão. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Consultas parametrizadas previnem SQL Injection porque separam código de dados."
    answer: true
    explanation: "Parâmetros não são interpretados como SQL, evitando a injeção."
---

# Autenticação e sessão quebradas

> **Objetivo:** Identificar falhas em login, recuperação de senha e gestão de sessão.

Muitas invasões acontecem pela porta da frente. Um login sem rate limit permite força bruta; mensagens como "usuário não existe" ajudam a enumerar contas; tokens de recuperação previsíveis permitem tomar contas. Corrija com limites, mensagens genéricas, tokens aleatórios e de uso único, expiração e MFA.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Autenticação e sessão quebradas**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **senhas fracas permitidas**
- **ausência de limite de tentativas**
- **mensagens que revelam se o usuário existe**
- **fixação de sessão**
- **sessão que não expira**
- **recuperação de senha insegura**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **senhas fracas permitidas** com minhas próprias palavras.
- [ ] Consigo explicar **ausência de limite de tentativas** com minhas próprias palavras.
- [ ] Consigo explicar **mensagens que revelam se o usuário existe** com minhas próprias palavras.


## Resumo

Identificar falhas em login, recuperação de senha e gestão de sessão. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
