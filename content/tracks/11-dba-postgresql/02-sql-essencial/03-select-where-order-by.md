---
slug: "select-where-order-by"
title: "SELECT, WHERE e ORDER BY"
kind: lesson
difficulty: 1
est_minutes: 15
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste o nome e o preço dos produtos da categoria 'Pães', do mais caro ao mais barato."
    starter: "SELECT \nFROM produtos\nWHERE \nORDER BY ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT nome, preco
        FROM produtos
        WHERE categoria = 'Pães'
        ORDER BY preco DESC;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A categoria é uma coluna de produtos e o valor é 'Pães'."
        cost_bits: 5
      - text: "ORDER BY preco DESC inverte a ordem."
        cost_bits: 10
    explanation: "SELECT escolhe colunas, WHERE filtra linhas e ORDER BY define a ordem. A ordem decrescente usa DESC."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id, nome e cidade dos clientes de Recife ou Salvador cujo nome contenha o caractere '1', em ordem de id."
    starter: "SELECT id, nome, cidade\nFROM clientes\nWHERE \nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, nome, cidade
        FROM clientes
        WHERE cidade IN ('Recife', 'Salvador') AND nome ILIKE '%1%'
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "IN permite comparar com uma lista de valores."
        cost_bits: 5
      - text: "ILIKE faz comparação de texto sem diferenciar maiúsculas."
        cost_bits: 10
    explanation: "IN reduz a repetição de OR. ILIKE é a versão case-insensitive de LIKE no PostgreSQL."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste os 5 produtos mais baratos que têm estoque maior que zero, incluindo nome e preço."
    starter: "SELECT nome, preco\nFROM produtos\nWHERE \nORDER BY \nLIMIT ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT nome, preco
        FROM produtos
        WHERE estoque > 0
        ORDER BY preco ASC, nome ASC
        LIMIT 5;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Comece filtrando estoque > 0."
        cost_bits: 5
      - text: "Use ASC e um segundo critério para desempatar."
        cost_bits: 10
    explanation: "LIMIT corta o resultado depois da ordenação. Um critério de desempate torna a saída determinística."
  - type: multi_choice
    xp: 8
    question: "Quais práticas são recomendadas ao escrever SELECTs?"
    options:
      - "Evitar SELECT * em código de produção"
      - "Usar ORDER BY quando a ordem importa"
      - "Confiar na ordem natural da tabela"
      - "Usar parênteses quando misturar AND e OR"
    answerIndexes: [0, 1, 3]
    explanation: "SELECT * dificulta evolução e desperdiça rede; sem ORDER BY a ordem não é garantida; parênteses evitam surpresas de precedência."
---

# SELECT, WHERE e ORDER BY

O `SELECT` é a ferramenta mais usada do SQL. Ele responde perguntas: quais colunas, de qual tabela, com qual condição e em qual ordem. A estrutura básica é `SELECT colunas FROM tabela WHERE condição ORDER BY critério LIMIT quantidade`. A ordem de escrita não é a ordem de execução lógica, mas para consultas simples essa distinção ainda não atrapalha.

Escolher colunas em vez de `*` é uma prática importante. `SELECT *` parece conveniente, mas acopla o código à ordem e ao conjunto atual de colunas. Se alguém adicionar uma coluna grande, a consulta passa a trafegar mais dados sem necessidade. Em investigação e consultas ad hoc, `*` é aceitável; em código de produção, prefira a lista explícita.

O `WHERE` filtra linhas antes de qualquer ordenação. Operadores comuns incluem `=`, `<>`, `<`, `>`, `BETWEEN`, `IN`, `LIKE` e `ILIKE`. `LIKE` diferencia maiúsculas; `ILIKE` não. `%` representa qualquer sequência e `_` um caractere. Condições podem ser combinadas com `AND`, `OR` e `NOT`. Atenção à precedência: `AND` é avaliado antes de `OR`, então use parênteses quando a intenção for outra.

`ORDER BY` define a ordem de apresentação. `ASC` é o padrão; `DESC` inverte. Sem `ORDER BY`, o banco não promete ordem alguma, mesmo que o resultado pareça estável em testes. Para resultados determinísticos, adicione um critério de desempate, como `id` ou `nome`. `LIMIT` e `OFFSET` paginam, mas `OFFSET` grande pode ficar caro; paginação por chave costuma escalar melhor.

`DISTINCT` remove duplicatas do conjunto de colunas selecionadas. Ele não é a mesma coisa que `GROUP BY`: `DISTINCT` apenas deduplica a projeção; `GROUP BY` permite agregar. Aliases com `AS` tornam a saída legível e são obrigatórios quando o cliente espera um nome específico.

## Por que isso importa

Consultas são a interface entre os dados e as decisões. Um `SELECT` mal filtrado pode varrer milhões de linhas; um `WHERE` com precedência errada pode retornar o conjunto errado; um `ORDER BY` ausente pode fazer a interface exibir uma ordem diferente a cada execução. Para a Padaria Byte, listar os produtos mais baratos ou os pedidos de um cliente precisa ser previsível.

## Conceitos-chave

- **`SELECT`:** escolhe a projeção de colunas.
- **`WHERE`:** filtra linhas.
- **`IN` / `BETWEEN` / `LIKE` / `ILIKE`:** formas de comparação.
- **`AND` / `OR` / `NOT`:** combinação lógica.
- **`ORDER BY`:** define ordem, com `ASC` ou `DESC`.
- **`LIMIT` / `OFFSET`:** recorte e paginação.
- **`DISTINCT`:** remove duplicatas da projeção.
- **Alias `AS`:** nomeia a coluna no resultado.

## Erros comuns

Confiar na ordem natural da tabela é o erro mais comum. Outro é usar `LIKE` esperando ignorar maiúsculas. Também é frequente esquecer parênteses em `A OR B AND C`. Por fim, `SELECT *` em uma view ou API pode quebrar quando o esquema muda.

## Checklist de domínio

- [ ] Consigo montar um SELECT com filtro e ordenação.
- [ ] Consigo explicar a diferença entre LIKE e ILIKE.
- [ ] Consigo usar parênteses para controlar AND/OR.
- [ ] Consigo justificar por que ORDER BY é necessário para ordem.

## Resumo

SELECT escolhe, WHERE filtra e ORDER BY organiza. A clareza vem de listar colunas, usar parênteses e definir critérios determinísticos. Consultas previsíveis são a base de relatórios, APIs e diagnósticos.
