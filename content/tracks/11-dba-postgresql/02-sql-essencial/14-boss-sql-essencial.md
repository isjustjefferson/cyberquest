---
slug: "boss-sql-essencial"
title: "Boss: SQL essencial"
kind: boss
difficulty: 3
est_minutes: 15
xp: 100
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id e nome dos produtos da categoria 'Doces' com preço maior que 5, em ordem de id."
    starter: "SELECT id, nome\nFROM produtos\nWHERE \nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, nome
        FROM produtos
        WHERE categoria = 'Doces' AND preco > 5
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Combine as duas condições com AND."
        cost_bits: 5
    explanation: "Filtro simples com dupla condição, ordenado por chave."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Conte os pedidos por status, mostrando status e total, em ordem de status."
    starter: "SELECT status, \nFROM pedidos\nGROUP BY status\nORDER BY status;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT status, count(*)::int AS total
        FROM pedidos
        GROUP BY status
        ORDER BY status;
      ordered: true
      compare_column_names: true
    hints:
      - text: "count(*) dentro de um GROUP BY por status."
        cost_bits: 5
    explanation: "Agregação básica com agrupamento."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Mostre a receita total por categoria (soma de quantidade vezes preco_unit), arredondada em duas casas, em ordem de categoria."
    starter: "SELECT p.categoria, \nFROM itens_pedido i\nJOIN produtos p ON \nGROUP BY p.categoria\nORDER BY p.categoria;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT p.categoria, round(sum(i.quantidade * i.preco_unit), 2) AS receita
        FROM itens_pedido i
        JOIN produtos p ON p.id = i.produto_id
        GROUP BY p.categoria
        ORDER BY p.categoria;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Junte itens_pedido com produtos pelo produto_id."
        cost_bits: 5
    explanation: "JOIN seguido de agregação por grupo."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Quantos clientes não têm nenhum pedido com status 'entregue'? Retorne uma única coluna total."
    starter: "SELECT count(*)::int AS total\nFROM clientes c\nWHERE "
    grade:
      mode: result_match
      expected_sql: |
        SELECT count(*)::int AS total
        FROM clientes c
        WHERE NOT EXISTS (
          SELECT 1 FROM pedidos p
          WHERE p.cliente_id = c.id AND p.status = 'entregue'
        );
      ordered: true
      compare_column_names: true
    hints:
      - text: "NOT EXISTS com correlação por cliente_id."
        cost_bits: 5
    explanation: "Padrão de ausência com subquery correlacionada."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id e nome dos produtos cujo preço é maior que a média de preço da própria categoria, em ordem de id."
    starter: "SELECT p.id, p.nome\nFROM produtos p\nWHERE p.preco > (\n)\nORDER BY p.id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT p.id, p.nome
        FROM produtos p
        WHERE p.preco > (
          SELECT avg(p2.preco) FROM produtos p2 WHERE p2.categoria = p.categoria
        )
        ORDER BY p.id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A subquery precisa referenciar a categoria da linha externa."
        cost_bits: 5
    explanation: "Subquery correlacionada calculando média por grupo."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Para cada categoria, mostre o produto mais caro (categoria, nome, preço), usando row_number. Em empate de preço, use nome em ordem alfabética. Ordene por categoria."
    starter: "SELECT categoria, nome, preco\nFROM (\n  SELECT categoria, nome, preco,\n    row_number() OVER ()\n    AS rn\n  FROM produtos\n) t\nWHERE rn = 1\nORDER BY categoria;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT categoria, nome, preco
        FROM (
          SELECT categoria, nome, preco,
            row_number() OVER (PARTITION BY categoria ORDER BY preco DESC, nome ASC) AS rn
          FROM produtos
        ) t
        WHERE rn = 1
        ORDER BY categoria;
      ordered: true
      compare_column_names: true
    hints:
      - text: "PARTITION BY categoria e ORDER BY preco DESC, nome ASC."
        cost_bits: 5
    explanation: "Window function com desempate explícito."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Relatório final: liste os 3 clientes com maior receita total (soma de quantidade vezes preco_unit), com nome e receita arredondada em duas casas. Ordene por receita decrescente e, em empate, por id crescente."
    starter: "WITH receita AS (\n  SELECT c.id, c.nome, sum(i.quantidade * i.preco_unit) AS total\n  FROM clientes c\n  JOIN pedidos p ON p.cliente_id = c.id\n  JOIN itens_pedido i ON i.pedido_id = p.id\n  GROUP BY c.id, c.nome\n)\nSELECT nome, round(total, 2) AS receita\nFROM receita\nORDER BY \nLIMIT 3;"
    grade:
      mode: result_match
      expected_sql: |
        WITH receita AS (
          SELECT c.id, c.nome, sum(i.quantidade * i.preco_unit) AS total
          FROM clientes c
          JOIN pedidos p ON p.cliente_id = c.id
          JOIN itens_pedido i ON i.pedido_id = p.id
          GROUP BY c.id, c.nome
        )
        SELECT nome, round(total, 2) AS receita
        FROM receita
        ORDER BY total DESC, id ASC
        LIMIT 3;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Ordene pela soma e use id como desempate antes do LIMIT."
        cost_bits: 5
    explanation: "Relatório final combinando CTE, JOIN, agregação e ordenação com desempate."
---

# Boss: SQL essencial

Este é o desafio final do módulo. São 7 consultas sobre a base da Padaria Byte, cobrindo filtros, agregações, JOIN, subquery correlacionada, window function e um relatório com CTE. Cada resposta é corrigida pelo motor SQL contra o gabarito, com comparação de resultado e de nomes de coluna.

Antes de começar, releia os pontos que costumam derrubar alunos. `WHERE` filtra linhas antes da agregação; `HAVING` filtra grupos depois. Um JOIN com a tabela de itens multiplica linhas de pedidos, então some dentro do grupo certo. Uma window function não pode ir diretamente no `WHERE`. Sem `ORDER BY`, a ordem não é garantida, por isso os resultados são comparados com ordenação explícita.

No relatório final, a combinação de desempate importa: ordenar só pela receita pode trocar a posição de clientes empatados. Sempre que o enunciado pedir desempate, ele faz parte da resposta.

Se travar, use as dicas. Elas são gratuitas nesta versão, mas o objetivo é conseguir ler o enunciado, escolher as tabelas e montar a consulta sem depender delas.

## Checklist de domínio

- [ ] Consigo filtrar, agregar e juntar sem consultar o gabarito.
- [ ] Consigo montar uma subquery correlacionada.
- [ ] Consigo usar row_number com desempate.
- [ ] Consigo combinar CTE, JOIN, agregação e LIMIT em um relatório.

## Resumo

O boss junta os fundamentos de SQL em consultas que a Padaria Byte realmente precisaria: catálogo, status de pedidos, receita e clientes. Se você passou por ele, está pronto para modelar dados, que é o próximo módulo.
