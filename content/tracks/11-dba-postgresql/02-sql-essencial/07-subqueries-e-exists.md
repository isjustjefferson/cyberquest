---
slug: "subqueries-e-exists"
title: "Subqueries e EXISTS"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id, nome e preço dos produtos com preço acima da média geral, em ordem de id."
    starter: "SELECT id, nome, preco\nFROM produtos\nWHERE preco > \nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, nome, preco
        FROM produtos
        WHERE preco > (SELECT avg(preco) FROM produtos)
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Uma subquery escalar retorna um único valor."
        cost_bits: 5
      - text: "A média pode ser calculada em (SELECT avg(preco) FROM produtos)."
        cost_bits: 10
    explanation: "Subqueries escalares podem ser usadas em comparações. A média é calculada uma vez e comparada com cada linha."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id e nome dos clientes que têm pelo menos um pedido com status 'entregue', em ordem de id, usando EXISTS."
    starter: "SELECT c.id, c.nome\nFROM clientes c\nWHERE \nORDER BY c.id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT c.id, c.nome
        FROM clientes c
        WHERE EXISTS (
          SELECT 1
          FROM pedidos p
          WHERE p.cliente_id = c.id AND p.status = 'entregue'
        )
        ORDER BY c.id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "EXISTS recebe uma subquery correlacionada."
        cost_bits: 5
      - text: "Dentro do EXISTS, selecione 1 e relacione p.cliente_id = c.id."
        cost_bits: 10
    explanation: "EXISTS para na primeira correspondência. Ele é claro para perguntas de existência."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id e nome dos clientes que não têm nenhum pedido 'cancelado', em ordem de id, usando NOT EXISTS."
    starter: "SELECT c.id, c.nome\nFROM clientes c\nWHERE \nORDER BY c.id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT c.id, c.nome
        FROM clientes c
        WHERE NOT EXISTS (
          SELECT 1
          FROM pedidos p
          WHERE p.cliente_id = c.id AND p.status = 'cancelado'
        )
        ORDER BY c.id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Troque EXISTS por NOT EXISTS e mantenha a correlação."
        cost_bits: 5
    explanation: "NOT EXISTS é seguro com NULL e expressa ausência sem depender de listas."
  - type: single_choice
    xp: 8
    question: "Por que preferir NOT EXISTS a NOT IN em muitos casos?"
    options:
      - "NOT IN pode retornar zero linhas quando a subquery contém NULL"
      - "NOT EXISTS sempre usa menos memória"
      - "NOT IN não aceita números"
      - "EXISTS só funciona com índices"
    answerIndex: 0
    explanation: "A semântica de NULL em NOT IN pode surpreender. NOT EXISTS evita essa armadilha e costuma ser mais claro."
---

# Subqueries e EXISTS

Nem toda resposta cabe em uma única consulta plana. Às vezes a pergunta depende de outra pergunta: “quais produtos custam mais que a média?” A média é uma subconsulta; o filtro externo compara cada produto com esse valor. Subqueries permitem compor consultas e expressar regras em etapas, mantendo o SQL declarativo.

Uma **subquery escalar** retorna uma única linha e coluna. Ela pode aparecer em comparações, no `SELECT` ou em `WHERE`. Se retornar mais de uma linha, o banco gera erro. Uma **subquery de lista** retorna uma coluna com várias linhas e é usada com `IN`, `ANY` ou `ALL`. Uma **subquery correlacionada** referencia colunas da consulta externa, sendo avaliada em contexto.

`EXISTS (subquery)` responde “existe pelo menos uma linha?”. Ele costuma parar na primeira correspondência e é natural para perguntas de existência. `NOT EXISTS` responde “não existe nenhuma linha?”. A versão correlacionada é um padrão comum: para cada cliente, verifique se existe um pedido com determinada condição. O banco pode otimizar isso sem materializar toda a subquery.

`NOT IN` tem uma armadilha clássica. Se a lista contiver `NULL`, a comparação se torna desconhecida e o resultado pode ser vazio, mesmo que existam linhas que deveriam aparecer. `NOT EXISTS` não sofre desse problema porque trabalha com a existência de linhas, não com igualdade de valores. Em código de produção, prefira `NOT EXISTS` quando houver possibilidade de nulos.

Subqueries também podem aparecer no `FROM`, formando uma tabela derivada. Nesse caso, o resultado da subquery é tratado como uma tabela temporária da consulta. `LATERAL` permite que uma subquery no `FROM` referencie colunas das tabelas anteriores, útil para “top N por grupo” e cálculos dependentes.

## Por que isso importa

Perguntas de negócio raramente são planas. “Clientes que nunca compraram”, “produtos acima da média”, “pedidos sem item” exigem composição. Subqueries e EXISTS tornam essas perguntas expressáveis sem trazer todos os dados para a aplicação. Também ajudam a evitar JOINs que multiplicam linhas quando o objetivo é apenas verificar existência.

## Conceitos-chave

- **Subquery escalar:** um valor.
- **Subquery de lista:** usada com IN/ANY/ALL.
- **Subquery correlacionada:** referencia a consulta externa.
- **EXISTS / NOT EXISTS:** teste de existência.
- **Tabela derivada:** subquery no FROM.
- **LATERAL:** subquery que enxerga colunas anteriores.
- **Armadilha do NULL em NOT IN:** resultado inesperado.

## Erros comuns

Usar `NOT IN` com uma subquery que pode produzir NULL é o erro mais perigoso. Outro é escrever uma subquery escalar que retorna várias linhas. Também é comum correlacionar sem necessidade e transformar uma consulta rápida em uma varredura repetida. Por fim, não presuma que JOIN e EXISTS são sempre equivalentes: a cardinalidade muda o resultado.

## Checklist de domínio

- [ ] Consigo usar uma subquery escalar em uma comparação.
- [ ] Consigo escrever EXISTS e NOT EXISTS correlacionados.
- [ ] Consigo explicar a armadilha de NOT IN com NULL.
- [ ] Consigo reconhecer quando uma tabela derivada ajuda.

## Resumo

Subqueries compõem perguntas; EXISTS testa existência; NOT EXISTS evita armadilhas de NULL. Elas permitem expressar regras complexas sem inflar linhas. A Padaria Byte usa esses padrões para encontrar lacunas e exceções nos relacionamentos.
