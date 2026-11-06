---
slug: "desenvolvimento-seguro"
title: "Desenvolvimento seguro: corrigindo as falhas"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["ssrf-e-configuracoes-inseguras"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Desenvolvimento seguro: corrigindo as falhas”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Transformar o que você aprendeu em hábitos de código."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Transformar o que você aprendeu em hábitos de código. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Verificar permissões apenas escondendo botões na interface é suficiente."
    answer: false
    explanation: "A autorização deve ser verificada no servidor; o cliente pode ser manipulado."
---

# Desenvolvimento seguro: corrigindo as falhas

> **Objetivo:** Transformar o que você aprendeu em hábitos de código.

Segurança não é uma etapa final: é parte do ciclo (*shift left*). Revise código procurando entradas, saídas e autorização; mantenha dependências atualizadas; nunca coloque segredos no repositório; automatize análises no pipeline. Para cada falha vista nesta trilha, você deve saber *como o atacante pensa* e *como o desenvolvedor corrige*.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Desenvolvimento seguro: corrigindo as falhas**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **validação e codificação**
- **consultas parametrizadas**
- **gestão de segredos**
- **dependências e atualização (SCA)**
- **revisão de código**
- **SAST/DAST (conceito)**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **validação e codificação** com minhas próprias palavras.
- [ ] Consigo explicar **consultas parametrizadas** com minhas próprias palavras.
- [ ] Consigo explicar **gestão de segredos** com minhas próprias palavras.


## Resumo

Transformar o que você aprendeu em hábitos de código. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
