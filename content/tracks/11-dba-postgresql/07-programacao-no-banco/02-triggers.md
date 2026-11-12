---
slug: "triggers"
title: "Triggers"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["plpgsql-funcoes-e-procedures"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual variável contém a linha depois da alteração em um trigger?"
    options:
      - "NEW"
      - "OLD"
      - "TG_OP"
      - "FOUND"
    answerIndex: 0
    explanation: "NEW representa a linha nova em INSERT/UPDATE; OLD representa a anterior em UPDATE/DELETE."
  - type: true_false
    xp: 10
    statement: "Lógica escondida em triggers pode dificultar a depuração e pesar em cargas em massa."
    answer: true
    explanation: "Triggers executam de forma implícita. Documente e avalie o custo, especialmente em operações por linha."
---

# Triggers

Um trigger dispara uma função quando ocorre `INSERT`, `UPDATE`, `DELETE` ou `TRUNCATE`. Pode ser `BEFORE`, `AFTER` ou `INSTEAD OF`, por linha ou por comando. As variáveis `NEW` e `OLD` dão acesso à linha, e `TG_OP` informa a operação.

Casos clássicos incluem carimbar `atualizado_em`, registrar mudanças de preço em uma tabela de histórico e bloquear alterações proibidas. Triggers garantem que a regra valha para qualquer cliente do banco, inclusive scripts manuais.

O custo é a transparência. Lógica implícita é mais difícil de depurar, pode entrar em recursão e afetar cargas em massa. Use com moderação, documente e prefira funções explícitas quando a intenção precisa ser visível na aplicação.

Um trigger `BEFORE UPDATE` pode modificar `NEW` e devolver a linha, por exemplo para normalizar um campo. Um trigger `AFTER` é adequado para auditoria porque registra o estado final. Triggers por comando executam uma vez mesmo quando milhares de linhas mudam; os por linha executam para cada registro e podem multiplicar custo. Para entender uma cadeia, consulte `pg_trigger` e `pg_proc`, e mantenha os nomes e efeitos descritos na documentação do esquema.

## Por que isso importa

Triggers são poderosos para auditoria e invariantes, mas podem se tornar armadilhas invisíveis de desempenho.

## Conceitos-chave

- **BEFORE/AFTER/INSTEAD OF**
- **NEW/OLD**
- **por linha vs. por comando**
- **função de trigger**
- **auditoria**
- **recursão**

## Erros comuns

Não documentar. Ignorar impacto em lote. Criar cascatas inesperadas. Esquecer permissões.

## Checklist de domínio

- [ ] Sei quando usar trigger.
- [ ] Sei a diferença entre NEW e OLD.
- [ ] Sei avaliar o custo.

## Resumo

Triggers reagem automaticamente a mudanças. Use para auditoria e invariantes, com documentação e cuidado com volume.
