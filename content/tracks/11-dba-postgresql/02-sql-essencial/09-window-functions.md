---
slug: "window-functions"
title: "Window functions"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste categoria, nome, preço e a posição de cada produto por preço dentro da sua categoria (rank, do mais caro para o mais barato). Ordene por categoria e posição."
    starter: "SELECT categoria, nome, preco,\n  rank() OVER (\n  ) AS posicao\nFROM produtos\nORDER BY categoria, posicao;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT categoria, nome, preco,
          rank() OVER (PARTITION BY categoria ORDER BY preco DESC) AS posicao
        FROM produtos
        ORDER BY categoria, posicao;
      ordered: true
      compare_column_names: true
    hints:
      - text: "PARTITION BY define o grupo da janela; ORDER BY define a ordem dentro dele."
        cost_bits: 5
      - text: "rank() deixa empates ocupando a mesma posição."
        cost_bits: 10
    explanation: "Window functions calculam por linha sem reduzir o resultado. PARTITION BY separa categorias."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Mostre o produto mais caro de cada categoria, com categoria, nome e preço, usando row_number em uma subquery. Ordene por categoria."
    starter: "SELECT categoria, nome, preco\nFROM (\n  SELECT categoria, nome, preco,\n    row_number() OVER (\n    ) AS rn\n  FROM produtos\n) t\nWHERE rn = 1\nORDER BY categoria;"
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
      - text: "row_number numera as linhas; use um critério de desempate."
        cost_bits: 5
      - text: "Filtre rn = 1 na consulta externa, pois window não pode ir no WHERE."
        cost_bits: 10
    explanation: "A window é calculada depois do WHERE, por isso o filtro precisa de uma subquery ou CTE."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Mostre, por mês de 2024, a quantidade de pedidos e o total acumulado de pedidos até aquele mês. Ordene por mês."
    starter: "WITH mensal AS (\n  SELECT date_trunc('month', criado_em)::date AS mes, count(*)::int AS pedidos\n  FROM pedidos\n  GROUP BY 1\n)\nSELECT mes, pedidos, \nFROM mensal\nORDER BY mes;"
    grade:
      mode: result_match
      expected_sql: |
        WITH mensal AS (
          SELECT date_trunc('month', criado_em)::date AS mes, count(*)::int AS pedidos
          FROM pedidos
          GROUP BY 1
        )
        SELECT mes, pedidos, sum(pedidos) OVER (ORDER BY mes)::int AS acumulado
        FROM mensal
        ORDER BY mes;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Sem PARTITION BY, a janela cobre o resultado inteiro."
        cost_bits: 5
      - text: "sum(pedidos) OVER (ORDER BY mes) cria o acumulado."
        cost_bits: 10
    explanation: "A janela padrão com ORDER BY acumula o valor desde o início. CTE separa a agregação mensal da janela."
  - type: single_choice
    xp: 8
    question: "Qual é a principal diferença entre GROUP BY e window functions?"
    options:
      - "GROUP BY reduz linhas; window functions mantêm as linhas originais"
      - "Window functions só funcionam com datas"
      - "GROUP BY não permite agregações"
      - "Window functions substituem o WHERE"
    answerIndex: 0
    explanation: "GROUP BY colapsa grupos em uma linha. Window functions calculam por linha mantendo o conjunto original."
---

# Window functions

GROUP BY responde “qual é a média por categoria?” e devolve **uma linha por categoria**. Mas e quando você precisa da média por categoria **ao lado de cada produto**? Uma window function faz isso: calcula um valor sobre um conjunto de linhas relacionadas sem colapsar o resultado. A Padaria Byte pode ranquear produtos por categoria, calcular acumulados mensais e comparar cada linha com o grupo.

A sintaxe é `função() OVER (PARTITION BY ... ORDER BY ...)`. `PARTITION BY` divide o conjunto em grupos lógicos; `ORDER BY` define a ordem dentro da partição; sem partição, a janela cobre o resultado inteiro. Funções comuns incluem `row_number()`, `rank()`, `dense_rank()`, `sum()`, `avg()`, `lag()` e `lead()`.

`row_number()` numera linhas sem repetir posições. `rank()` deixa empates com a mesma posição e pula números seguintes. `dense_rank()` não pula. Para escolher o mais caro de cada categoria, use `row_number()` com `ORDER BY preco DESC, nome ASC` e filtre `rn = 1` em uma subquery. O desempate por nome evita resultados instáveis quando dois produtos têm o mesmo preço.

A cláusula de janela `ROWS BETWEEN ... AND ...` controla quais linhas entram no cálculo. `sum(valor) OVER (ORDER BY data ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` cria um acumulado. `lag` e `lead` acessam a linha anterior e a seguinte, úteis para comparar meses ou detectar variações. Sem `ROWS`, o padrão pode incluir empates no `ORDER BY`.

Um detalhe importante: window functions são calculadas depois do `WHERE`, `GROUP BY` e `HAVING`, e antes do `ORDER BY` final. Por isso você não pode filtrar diretamente `WHERE row_number() = 1`; precisa de subquery ou CTE. Esse é um erro frequente de quem está começando.

## Por que isso importa

Rankings, acumulados e comparações linha a linha são comuns em relatórios. Fazer isso na aplicação geralmente significa trazer muitos dados e ordenar em memória. Window functions deixam o banco fazer o trabalho com uma consulta declarativa. A Padaria Byte usa isso para identificar destaques e acompanhar evolução mensal.

## Conceitos-chave

- **OVER:** define a janela.
- **PARTITION BY:** grupos lógicos.
- **ORDER BY da janela:** ordem dentro do grupo.
- **row_number / rank / dense_rank:** numeração.
- **lag / lead:** linha anterior e seguinte.
- **Acumulado:** soma com janela ordenada.
- **Ordem de avaliação:** window depois do WHERE e antes do ORDER BY final.

## Erros comuns

Filtrar uma window function no WHERE é o erro mais comum; use subquery. Outro é esquecer `PARTITION BY` e ranquear o conjunto inteiro. Também é frequente ignorar empates e obter ordem instável. Por fim, confundir `rank()` com `row_number()` leva a números diferentes do esperado.

## Checklist de domínio

- [ ] Consigo ranquear linhas dentro de grupos.
- [ ] Consigo pegar o top 1 por grupo com row_number.
- [ ] Consigo calcular um acumulado com window.
- [ ] Consigo explicar por que a window não pode ir no WHERE.

## Resumo

Window functions calculam sobre conjuntos relacionados sem reduzir linhas. PARTITION BY agrupa, ORDER BY ordena, e funções como row_number e sum resolvem rankings e acumulados. Elas ampliam o poder do SQL sem perder o grão original.
