---
slug: "agregacoes-e-group-by"
title: "Agregações e GROUP BY"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Mostre, por categoria, a quantidade de produtos e o preço médio arredondado para duas casas. Ordene por categoria."
    starter: "SELECT categoria, \nFROM produtos\nGROUP BY \nORDER BY categoria;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT categoria, count(*)::int AS produtos, round(avg(preco), 2) AS preco_medio
        FROM produtos
        GROUP BY categoria
        ORDER BY categoria;
      ordered: true
      compare_column_names: true
    hints:
      - text: "count(*) conta linhas; avg(preco) calcula a média."
        cost_bits: 5
      - text: "round(valor, 2) limita a duas casas decimais."
        cost_bits: 10
    explanation: "GROUP BY cria um grupo por categoria. As agregações são calculadas dentro de cada grupo."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste apenas as categorias cujo preço médio é maior que 10, mostrando categoria e preço médio arredondado. Ordene por categoria."
    starter: "SELECT categoria, round(avg(preco), 2) AS preco_medio\nFROM produtos\nGROUP BY categoria\n;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT categoria, round(avg(preco), 2) AS preco_medio
        FROM produtos
        GROUP BY categoria
        HAVING avg(preco) > 10
        ORDER BY categoria;
      ordered: true
      compare_column_names: true
    hints:
      - text: "WHERE filtra linhas antes do grupo; HAVING filtra grupos."
        cost_bits: 5
      - text: "A condição do HAVING pode repetir avg(preco)."
        cost_bits: 10
    explanation: "HAVING é o filtro de grupos. Ele é avaliado depois do GROUP BY e pode usar agregações."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Conte quantos pedidos existem por status, mostrando status e total, em ordem alfabética de status."
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
      - text: "Agrupe por status e conte as linhas."
        cost_bits: 5
    explanation: "Agrupar por uma coluna categórica produz uma linha por valor distinto."
  - type: order
    xp: 8
    question: "Ordene a sequência lógica de avaliação de uma consulta."
    items:
      - "FROM"
      - "WHERE"
      - "GROUP BY"
      - "HAVING"
      - "SELECT"
      - "ORDER BY"
    correctOrder: [0, 1, 2, 3, 4, 5]
    explanation: "A ordem lógica explica por que um alias do SELECT não pode ser usado no WHERE e por que HAVING vem depois de GROUP BY."
---

# Agregações e GROUP BY

Agregar é resumir muitas linhas em poucas. A Padaria Byte não quer ver 300 pedidos um por um para saber quantos existem por status; quer uma linha por status com o total. Funções de agregação fazem esse trabalho: `COUNT`, `SUM`, `AVG`, `MIN` e `MAX`. O `GROUP BY` define os grupos dentro dos quais cada agregação é calculada.

`COUNT(*)` conta linhas, inclusive aquelas com colunas nulas. `COUNT(coluna)` conta apenas valores não nulos naquela coluna. Essa diferença é importante em relatórios de preenchimento: se `telefone` é opcional, `COUNT(*)` e `COUNT(telefone)` podem divergir. `SUM` soma valores, `AVG` calcula a média, `MIN` e `MAX` encontram extremos.

O `WHERE` filtra linhas **antes** de agrupar. O `HAVING` filtra grupos **depois** de agrupar. Se você quer apenas produtos da categoria “Doces” antes de calcular a média, use `WHERE categoria = 'Doces'`. Se quer categorias cuja média é maior que 10, use `HAVING avg(preco) > 10`. Misturar os dois conceitos produz erros e resultados errados.

A ordem lógica de execução ajuda a diagnosticar consultas: `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`. O `SELECT` vem depois do agrupamento, por isso um alias criado nele não existe ainda no `WHERE`. O `ORDER BY` vem por último e pode usar aliases. Entender essa sequência explica boa parte das mensagens de erro de iniciante.

## Por que isso importa

Dashboards e decisões dependem de agregados confiáveis. Uma média calculada sobre o conjunto errado, ou uma contagem que inclui duplicatas de JOIN, engana a gestão. O DBA e o analista precisam saber o que cada função conta e em qual etapa os filtros atuam. Na Padaria Byte, “receita por categoria” e “pedidos por status” são consultas recorrentes.

## Conceitos-chave

- **COUNT(*) / COUNT(coluna):** linhas totais versus valores não nulos.
- **SUM / AVG / MIN / MAX:** agregações numéricas.
- **GROUP BY:** define grupos.
- **WHERE:** filtra linhas antes do grupo.
- **HAVING:** filtra grupos.
- **Ordem lógica:** FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.
- **FILTER:** aplica a agregação a um subconjunto.

## Erros comuns

Usar `WHERE` para filtrar uma agregação é o erro mais comum; o correto é `HAVING`. Outro é projetar uma coluna que não está no `GROUP BY` nem dentro de uma agregação. Também é frequente contar linhas depois de um JOIN um-para-muitos e inflar o total. Por fim, esqueça `ORDER BY` e receba grupos em ordem imprevisível.

## Checklist de domínio

- [ ] Consigo contar linhas e valores não nulos.
- [ ] Consigo agrupar por categoria e calcular média.
- [ ] Consigo diferenciar WHERE de HAVING.
- [ ] Consigo explicar a ordem lógica de execução.

## Resumo

Agregações transformam linhas em indicadores. GROUP BY define os grupos; WHERE filtra antes; HAVING filtra depois. A ordem lógica de execução explica erros e orienta consultas melhores. Relatórios confiáveis começam por entender o que está sendo contado.
