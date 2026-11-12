---
slug: "joins"
title: "JOINs"
kind: lesson
difficulty: 2
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
    prompt: "Liste os 20 primeiros pedidos com id do pedido, nome do cliente e status, em ordem de id do pedido."
    starter: "SELECT p.id AS pedido_id, \nFROM pedidos p\nJOIN clientes c ON \nORDER BY p.id\nLIMIT 20;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT p.id AS pedido_id, c.nome AS cliente, p.status
        FROM pedidos p
        JOIN clientes c ON c.id = p.cliente_id
        ORDER BY p.id
        LIMIT 20;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A condição de junção é c.id = p.cliente_id."
        cost_bits: 5
      - text: "Use aliases p e c para encurtar os nomes."
        cost_bits: 10
    explanation: "INNER JOIN mantém apenas pares que satisfazem a condição ON."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id e nome dos clientes que não têm nenhum pedido com status 'entregue', em ordem de id."
    starter: "SELECT c.id, c.nome\nFROM clientes c\nLEFT JOIN pedidos p ON \nWHERE \nORDER BY c.id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT c.id, c.nome
        FROM clientes c
        LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.status = 'entregue'
        WHERE p.id IS NULL
        ORDER BY c.id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Coloque a condição de status no ON para não transformar o LEFT em INNER."
        cost_bits: 5
      - text: "Depois do LEFT JOIN, filtre p.id IS NULL para achar ausência."
        cost_bits: 10
    explanation: "LEFT JOIN mantém todos os clientes. A condição no ON limita as correspondências; o IS NULL revela quem não teve correspondência."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Calcule a receita total por cliente (soma de quantidade vezes preco_unit), mostrando nome e receita arredondada para duas casas. Ordene da maior receita para a menor e, em empate, por id do cliente."
    starter: "SELECT c.nome, \nFROM clientes c\nJOIN pedidos p ON \nJOIN itens_pedido i ON \nGROUP BY \nORDER BY ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT c.id, c.nome, round(sum(i.quantidade * i.preco_unit), 2) AS receita
        FROM clientes c
        JOIN pedidos p ON p.cliente_id = c.id
        JOIN itens_pedido i ON i.pedido_id = p.id
        GROUP BY c.id, c.nome
        ORDER BY receita DESC, c.id ASC;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Junte clientes, pedidos e itens pelas chaves estrangeiras."
        cost_bits: 5
      - text: "Agrupe por id e nome; ordene pela expressão agregada."
        cost_bits: 10
    explanation: "O JOIN um-para-muitos multiplica linhas; a agregação reduz por cliente. Inclua a chave no GROUP BY para evitar nomes duplicados."
  - type: match
    xp: 8
    question: "Relacione o tipo de JOIN ao comportamento."
    pairs:
      - ["INNER JOIN", "Somente pares com correspondência"]
      - ["LEFT JOIN", "Todos da esquerda, com NULL quando não há correspondência"]
      - ["FULL JOIN", "Todos dos dois lados, com NULL onde faltar"]
      - ["CROSS JOIN", "Produto cartesiano entre as tabelas"]
    explanation: "Cada tipo controla quais linhas sobrevivem quando não há correspondência."
---

# JOINs

Os dados da Padaria Byte estão separados em tabelas por bom motivo: evitar repetição e manter integridade. O pedido guarda `cliente_id`, não o nome e o endereço do cliente. Para responder “qual o nome do cliente deste pedido?”, é preciso combinar as tabelas. `JOIN` faz essa combinação usando uma condição, normalmente a igualdade entre chave estrangeira e chave primária.

`INNER JOIN` mantém apenas as linhas que têm correspondência dos dois lados. Se um cliente não tem pedido, ele não aparece; se um pedido aponta para um cliente inexistente, a integridade referencial deveria ter impedido. `LEFT JOIN` mantém todos os registros da tabela à esquerda, mesmo sem correspondência, preenchendo o lado direito com `NULL`. `RIGHT JOIN` faz o inverso. `FULL JOIN` mantém os dois lados. `CROSS JOIN` produz todas as combinações, raramente desejado sem filtro.

A condição `ON` é onde a junção acontece. É diferente colocar `p.status = 'entregue'` no `ON` ou no `WHERE` de um `LEFT JOIN`. No `ON`, a condição limita quais pedidos podem corresponder, mas mantém todos os clientes. No `WHERE`, você descarta clientes sem correspondência depois da junção, transformando o efeito em um `INNER JOIN`. Entender essa diferença resolve muitos relatórios de “clientes sem X”.

Para achar clientes sem pedido, use `LEFT JOIN` e filtre `p.id IS NULL`. O mesmo padrão encontra produtos sem venda, pedidos sem item e outros “buracos” de relacionamento. `JOIN` de várias tabelas segue a mesma lógica: encadeie condições e verifique a cardinalidade. Um pedido pode ter vários itens; ao juntar e somar, cada item aparece uma vez por pedido, então cuidado com agregações infladas por duplicatas.

## Por que isso importa

Relatórios quase sempre cruzam entidades. Receita por cliente exige clientes, pedidos e itens. Clientes inativos exigem clientes e pedidos. Um JOIN errado pode multiplicar linhas e inflar somas, levando a decisões financeiras incorretas. O DBA precisa saber não só a sintaxe, mas a cardinalidade de cada relação.

## Conceitos-chave

- **INNER JOIN:** somente correspondências.
- **LEFT / RIGHT / FULL JOIN:** preservam um ou ambos os lados.
- **CROSS JOIN:** produto cartesiano.
- **ON:** condição de junção.
- **USING:** atalho quando a coluna tem o mesmo nome.
- **Self join:** junção da tabela com ela mesma.
- **Cardinalidade:** quantas linhas cada lado pode produzir.

## Erros comuns

Colocar filtros do lado direito no WHERE de um LEFT JOIN é o erro mais comum. Outro é esquecer a condição de junção e gerar produto cartesiano. Também é frequente somar valores depois de um JOIN um-para-muitos sem considerar a repetição. Por fim, use aliases e qualifique colunas para evitar ambiguidade.

## Checklist de domínio

- [ ] Consigo escrever INNER e LEFT JOIN.
- [ ] Consigo achar registros sem correspondência.
- [ ] Consigo explicar a diferença entre filtro no ON e no WHERE.
- [ ] Consigo perceber quando um JOIN infla uma soma.

## Resumo

JOIN combina tabelas por uma condição. O tipo de JOIN define quais linhas sobrevivem; a posição do filtro muda o resultado. Cardinalidade é a chave para não inflar relatórios. A Padaria Byte depende de JOINs corretos para enxergar clientes, pedidos e receita.
