---
slug: "plpgsql-funcoes-e-procedures"
title: "PL/pgSQL: funções e procedures"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["row-level-security-e-seguranca-avancada"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual volatilidade permite usar a função em índice por expressão?"
    options:
      - "IMMUTABLE"
      - "STABLE"
      - "VOLATILE"
      - "SECURITY DEFINER"
    answerIndex: 0
    explanation: "IMMUTABLE promete o mesmo resultado para os mesmos argumentos, sem depender do estado do banco. Só essa promessa permite índice por expressão."
  - type: single_choice
    xp: 10
    question: "Qual é o risco de uma função SECURITY DEFINER sem search_path fixo?"
    options:
      - "Um objeto homônimo malicioso pode ser executado com privilégios do dono"
      - "A função deixa de aceitar parâmetros"
      - "O banco perde a capacidade de fazer backup"
      - "O WAL para de ser gerado"
    answerIndex: 0
    explanation: "SECURITY DEFINER roda como o dono. Se o search_path incluir um schema controlado por outro usuário, um objeto homônimo pode sequestrar a execução."
  - type: match
    xp: 12
    question: "Relacione o comando ao uso."
    pairs:
      - ["CREATE FUNCTION", "Cria rotina com retorno"]
      - ["CREATE PROCEDURE", "Cria rotina chamada com CALL"]
      - ["RETURN QUERY", "Devolve linhas de uma consulta"]
      - ["RAISE", "Emite mensagem ou erro"]
      - ["EXCEPTION", "Trata erro dentro do bloco"]
    explanation: "Funções retornam valor e podem ser usadas em consultas; procedures controlam transações e são chamadas com CALL."
  - type: true_false
    xp: 8
    statement: "Colocar toda regra de negócio no banco é sempre a melhor escolha."
    answer: false
    explanation: "Lógica no banco reduz idas e voltas e vale para todos os clientes, mas pode dificultar versionamento, testes e depuração. Use com critério."
  - type: fill_command
    xp: 10
    question: "Complete a chamada de uma procedure."
    template: "___ reajustar_precos('paes', 5);"
    blanks: ["CALL"]
    accepted: [["CALL"], ["call"]]
    explanation: "Procedures são chamadas com CALL. Funções aparecem em SELECT ou expressões."
---

# PL/pgSQL: funções e procedures

PL/pgSQL permite escrever lógica dentro do PostgreSQL. Uma função pode retornar um escalar, um conjunto (`SETOF`) ou uma tabela (`RETURNS TABLE`). Ela recebe parâmetros, declara variáveis, usa `IF`, `LOOP`, `FOR`, `RETURN QUERY` e pode tratar erros com `EXCEPTION` e `RAISE`. Procedures (`CREATE PROCEDURE`/`CALL`) são semelhantes, mas podem controlar transações com `COMMIT` e `ROLLBACK`.

A marca de volatilidade é um contrato. `IMMUTABLE` promete o mesmo resultado para os mesmos argumentos, independentemente do estado do banco; permite índice por expressão e cache. `STABLE` pode consultar o banco, mas não altera dados e vê um snapshot fixo na consulta. `VOLATILE` pode mudar a cada chamada. Mentir sobre volatilidade produz planos e resultados errados.

`SECURITY DEFINER` faz a função rodar com privilégios do dono. Isso é útil para conceder uma operação específica sem dar acesso amplo, mas exige cuidado: fixe o `search_path` (`SET search_path = pg_catalog, public`) para evitar que objetos homônimos de outro schema sejam executados com privilégios elevados. Prefira `SECURITY INVOKER` quando não houver motivo forte.

Nem toda regra de negócio pertence ao banco. Funções são ótimas para invariantes que precisam valer para qualquer cliente, cálculos próximos dos dados e operações atômicas. Lógica complexa de aplicação costuma ser mais fácil de versionar, testar e depurar fora do banco. A decisão é de arquitetura, não de gosto.

## Por que isso importa

PL/pgSQL permite encapsular operações e reduzir tráfego, mas também cria lógica escondida. Um DBA precisa reconhecer quando a função ajuda e quando vira um problema de manutenção.

## Conceitos-chave

- **Função:** retorna valor, usada em consultas.
- **Procedure:** chamada com CALL, controla transação.
- **RETURN QUERY:** devolve conjunto.
- **EXCEPTION/RAISE:** tratamento e emissão de erros.
- **Volatilidade:** IMMUTABLE, STABLE, VOLATILE.
- **SECURITY DEFINER:** privilégios do dono.

## Erros comuns

Marcar função como IMMUTABLE sem ser. Deixar search_path aberto em SECURITY DEFINER. Usar trigger para tudo. Esconder regra crítica sem documentação.

## Checklist de domínio

- [ ] Sei criar função escalar e com RETURNS TABLE.
- [ ] Sei diferenciar função e procedure.
- [ ] Sei escolher a volatilidade correta.
- [ ] Sei proteger uma função SECURITY DEFINER.

## Resumo

PL/pgSQL coloca lógica perto dos dados. Volatilidade é contrato, SECURITY DEFINER é poder com risco e procedures controlam transações. Use quando a invariante pertence ao banco.
