---
slug: "ctes-e-recursividade"
title: "CTEs e consultas recursivas"
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
    prompt: "Usando uma CTE de vendas por categoria, mostre categoria e receita total arredondada para duas casas, em ordem de categoria."
    starter: "WITH vendas AS (\n  SELECT \n)\nSELECT categoria, round(receita, 2) AS receita\nFROM vendas\nORDER BY categoria;"
    grade:
      mode: result_match
      expected_sql: |
        WITH vendas AS (
          SELECT p.categoria, sum(i.quantidade * i.preco_unit) AS receita
          FROM itens_pedido i
          JOIN produtos p ON p.id = i.produto_id
          GROUP BY p.categoria
        )
        SELECT categoria, round(receita, 2) AS receita
        FROM vendas
        ORDER BY categoria;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A CTE pode conter um JOIN e uma agregação."
        cost_bits: 5
      - text: "Depois da CTE, trate vendas como uma tabela."
        cost_bits: 10
    explanation: "CTEs nomeiam um resultado intermediário. Elas deixam consultas longas mais legíveis e podem ser reutilizadas."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Gere uma sequência de 1 a 10 usando uma CTE recursiva e mostre a coluna n em ordem."
    starter: "WITH RECURSIVE numeros(n) AS (\n  \n)\nSELECT n FROM numeros ORDER BY n;"
    grade:
      mode: result_match
      expected_sql: |
        WITH RECURSIVE numeros(n) AS (
          SELECT 1
          UNION ALL
          SELECT n + 1 FROM numeros WHERE n < 10
        )
        SELECT n FROM numeros ORDER BY n;
      ordered: true
      compare_column_names: true
    hints:
      - text: "O caso base é SELECT 1."
        cost_bits: 5
      - text: "Use UNION ALL e pare quando n < 10 deixar de ser verdade."
        cost_bits: 10
    explanation: "Uma CTE recursiva tem caso base e passo recursivo. Sempre inclua uma condição de parada."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Usando uma CTE, liste os 10 clientes com maior receita total (soma de quantidade vezes preco_unit), com nome e receita arredondada. Ordene por receita decrescente e id crescente."
    starter: "WITH receita_cliente AS (\n  SELECT \n)\nSELECT nome, round(receita, 2) AS receita\nFROM receita_cliente\nORDER BY \nLIMIT 10;"
    grade:
      mode: result_match
      expected_sql: |
        WITH receita_cliente AS (
          SELECT c.id, c.nome, sum(i.quantidade * i.preco_unit) AS receita
          FROM clientes c
          JOIN pedidos p ON p.cliente_id = c.id
          JOIN itens_pedido i ON i.pedido_id = p.id
          GROUP BY c.id, c.nome
        )
        SELECT nome, round(receita, 2) AS receita
        FROM receita_cliente
        ORDER BY receita DESC, id ASC
        LIMIT 10;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Inclua id e nome no GROUP BY."
        cost_bits: 5
      - text: "Ordene pela receita e use id como desempate."
        cost_bits: 10
    explanation: "CTEs separam o cálculo da apresentação. A ordenação final usa a coluna calculada e a chave para estabilidade."
  - type: true_false
    xp: 8
    statement: "Uma CTE recursiva sempre precisa de uma condição de parada para não gerar linhas indefinidamente."
    answer: true
    explanation: "Sem condição de parada, o passo recursivo continua até estourar recursos ou ser interrompido. Sempre defina o critério de término."
---

# CTEs e consultas recursivas

Consultas grandes ficam difíceis de ler quando tudo está aninhado. A **CTE** (Common Table Expression), declarada com `WITH`, dá nome a um resultado intermediário e permite usá-lo como uma tabela temporária dentro da consulta. A Padaria Byte pode calcular receita por cliente em uma CTE e depois ordenar, filtrar ou juntar esse resultado com outras informações.

A estrutura básica é `WITH nome AS (SELECT ...) SELECT ... FROM nome`. Uma consulta pode ter várias CTEs, separadas por vírgula. Elas ajudam a documentar etapas e a evitar repetir a mesma subquery. Em versões modernas do PostgreSQL, o planejador pode embutir ou materializar a CTE conforme a estimativa; não assuma que ela sempre será executada uma única vez.

Uma CTE também pode ser **recursiva**, usando `WITH RECURSIVE`. Ela precisa de um caso base e de um passo que referencie a própria CTE. Um exemplo clássico é gerar números: o caso base é `SELECT 1`; o passo soma 1 enquanto `n < 10`. Sem a condição de parada, a consulta continua indefinidamente até ser interrompida. O banco não adivinha quando você quer parar.

CTEs recursivas aparecem em hierarquias: organogramas, categorias com subcategorias, árvores de comentários. O padrão é uma tabela com `id` e `parent_id`. O caso base seleciona a raiz; o passo junta a tabela com o resultado anterior pelo `parent_id`. Também é possível acumular profundidade e caminho para detectar ciclos.

## Por que isso importa

Relatórios complexos podem ser decompostos em etapas nomeadas. Isso reduz duplicação e facilita revisão. Em hierarquias, uma CTE recursiva evita N consultas na aplicação para percorrer níveis. Em cargas analíticas, CTEs podem expressar pipelines de transformação dentro de uma única consulta. O DBA precisa reconhecer quando a legibilidade compensa o custo.

## Conceitos-chave

- **WITH:** declara uma CTE.
- **CTE não recursiva:** resultado intermediário nomeado.
- **WITH RECURSIVE:** permite autorreferência.
- **Caso base:** primeira parte da recursão.
- **Passo recursivo:** referência à própria CTE.
- **Condição de parada:** evita loop infinito.
- **Materialização:** forma como o planejador executa a CTE.

## Erros comuns

Esquecer a condição de parada em uma CTE recursiva é o erro mais perigoso. Outro é esperar que a CTE seja sempre materializada ou sempre embutida; o planejador decide. Também é comum repetir a mesma CTE em consultas diferentes quando uma view ou tabela auxiliar seria melhor. Por fim, não use CTE para esconder uma consulta cara sem medir.

## Checklist de domínio

- [ ] Consigo escrever uma CTE simples.
- [ ] Consigo usar o resultado de uma CTE em uma ordenação.
- [ ] Consigo escrever uma CTE recursiva com caso base e parada.
- [ ] Consigo explicar um caso de hierarquia em que recursão ajuda.

## Resumo

CTEs nomeiam etapas e tornam consultas complexas legíveis. CTEs recursivas percorrem hierarquias com caso base e passo controlado. A Padaria Byte usa essas ferramentas para separar cálculo de apresentação e resolver relações profundas sem código imperativo.
