---
slug: "csrf"
title: "CSRF"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: draft
prerequisites: ["xss"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “CSRF”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Entender requisições forjadas e as defesas."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Entender requisições forjadas e as defesas. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Verificar permissões apenas escondendo botões na interface é suficiente."
    answer: false
    explanation: "A autorização deve ser verificada no servidor; o cliente pode ser manipulado."
---

# CSRF

> **Objetivo:** Entender requisições forjadas e as defesas.

Se você está logado num banco e abre uma página maliciosa, seu navegador pode enviar ao banco uma requisição *com seus cookies*, sem você perceber. O servidor precisa de algo que o atacante não consiga adivinhar: um **token anti-CSRF** por sessão/formulário. Cookies com `SameSite=Lax` ou `Strict` já bloqueiam boa parte desses casos.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **CSRF**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **navegador envia cookies automaticamente**
- **ação em nome do usuário logado**
- **tokens anti-CSRF**
- **SameSite**
- **verificação de Origin/Referer**
- **reautenticação em ações sensíveis**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **navegador envia cookies automaticamente** com minhas próprias palavras.
- [ ] Consigo explicar **ação em nome do usuário logado** com minhas próprias palavras.
- [ ] Consigo explicar **tokens anti-CSRF** com minhas próprias palavras.


## Resumo

Entender requisições forjadas e as defesas. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
