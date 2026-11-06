---
slug: "controle-de-acesso-quebrado-e-idor"
title: "Controle de acesso quebrado e IDOR"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: draft
prerequisites: ["csrf"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Controle de acesso quebrado e IDOR”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Reconhecer quando \"estar logado\" não basta."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Reconhecer quando \"estar logado\" não basta. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "HTTPS garante que a aplicação não tem falhas de lógica ou autorização."
    answer: false
    explanation: "HTTPS protege o canal, não a lógica da aplicação."
---

# Controle de acesso quebrado e IDOR

> **Objetivo:** Reconhecer quando "estar logado" não basta.

Se `/pedido/1042` mostra o *seu* pedido e `/pedido/1043` mostra o de outra pessoa, há IDOR: o servidor confiou no número vindo do cliente. A correção: para cada requisição, verificar se **o usuário autenticado tem direito àquele recurso** (por exemplo, `WHERE id = ? AND user_id = ?`). UUIDs dificultam adivinhar, mas não substituem a checagem.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Controle de acesso quebrado e IDOR**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **IDOR (referência insegura a objeto)**
- **escalação horizontal e vertical**
- **rotas administrativas expostas**
- **verificação de autorização **no servidor** por requisição**
- **identificadores imprevisíveis como camada extra (não substituem autorização)**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **IDOR (referência insegura a objeto)** com minhas próprias palavras.
- [ ] Consigo explicar **escalação horizontal e vertical** com minhas próprias palavras.
- [ ] Consigo explicar **rotas administrativas expostas** com minhas próprias palavras.


## Resumo

Reconhecer quando "estar logado" não basta. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
