---
slug: "views-e-materialized-views"
title: "Views e Materialized Views"
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
    prompt: "Crie a view vw_receita_categoria com as colunas categoria e receita (soma de quantidade vezes preco_unit por categoria)."
    starter: "CREATE VIEW vw_receita_categoria AS\nSELECT \nFROM itens_pedido i\nJOIN produtos p ON \nGROUP BY p.categoria;"
    grade:
      mode: state_check
      expected_sql: |
        CREATE VIEW vw_receita_categoria AS
        SELECT p.categoria, sum(i.quantidade * i.preco_unit) AS receita
        FROM itens_pedido i
        JOIN produtos p ON p.id = i.produto_id
        GROUP BY p.categoria;
      check_sql: |
        SELECT categoria, round(receita, 2) AS receita
        FROM vw_receita_categoria
        ORDER BY categoria;
    hints:
      - text: "CREATE VIEW nome AS SELECT ... define a view."
        cost_bits: 5
      - text: "A view guarda a consulta, não o resultado."
        cost_bits: 10
    explanation: "Uma view é uma consulta nomeada. Ela é avaliada quando usada e reflete os dados atuais."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Crie a materialized view mv_top_produtos com nome e total vendido (soma de quantidade) dos 10 produtos mais vendidos. Ordene a definição por total decrescente."
    starter: "CREATE MATERIALIZED VIEW mv_top_produtos AS\nSELECT p.nome, \nFROM itens_pedido i\nJOIN produtos p ON p.id = i.produto_id\nGROUP BY p.id, p.nome\nORDER BY total DESC\nLIMIT 10;"
    grade:
      mode: state_check
      expected_sql: |
        CREATE MATERIALIZED VIEW mv_top_produtos AS
        SELECT p.nome, sum(i.quantidade)::int AS total
        FROM itens_pedido i
        JOIN produtos p ON p.id = i.produto_id
        GROUP BY p.id, p.nome
        ORDER BY total DESC
        LIMIT 10;
      check_sql: |
        SELECT nome, total
        FROM mv_top_produtos
        ORDER BY total DESC, nome ASC;
    hints:
      - text: "CREATE MATERIALIZED VIEW armazena o resultado no momento da criação."
        cost_bits: 5
      - text: "Sem REFRESH, a materialized view fica desatualizada quando os dados mudam."
        cost_bits: 10
    explanation: "Materialized views guardam o resultado. São rápidas para leitura, mas precisam de REFRESH para refletir mudanças."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Crie a view vw_resumo_pedidos com status, a quantidade de pedidos e a receita total de itens por status. Ordene a definição por status."
    starter: "CREATE VIEW vw_resumo_pedidos AS\nSELECT p.status, count(DISTINCT p.id)::int AS pedidos, \nFROM pedidos p\nLEFT JOIN itens_pedido i ON \nGROUP BY p.status\nORDER BY p.status;"
    grade:
      mode: state_check
      expected_sql: |
        CREATE VIEW vw_resumo_pedidos AS
        SELECT p.status, count(DISTINCT p.id)::int AS pedidos,
          round(sum(i.quantidade * i.preco_unit), 2) AS receita
        FROM pedidos p
        LEFT JOIN itens_pedido i ON i.pedido_id = p.id
        GROUP BY p.status
        ORDER BY p.status;
      check_sql: |
        SELECT status, pedidos, receita
        FROM vw_resumo_pedidos
        ORDER BY status;
    hints:
      - text: "Use count(DISTINCT p.id) para não contar o pedido uma vez por item."
        cost_bits: 5
      - text: "LEFT JOIN preserva status sem itens; COALESCE ou sum ignora NULL."
        cost_bits: 10
    explanation: "Views também podem encapsular joins e agregações. Cuidado com a cardinalidade ao juntar pedidos e itens."
  - type: true_false
    xp: 8
    statement: "Uma view comum armazena uma cópia física dos dados no momento da criação."
    answer: false
    explanation: "A view comum armazena a consulta. Quem armazena o resultado é a materialized view, que precisa de REFRESH."
---

# Views e Materialized Views

Relatórios são repetidos. Se toda consulta de receita por categoria precisa juntar itens, produtos e agrupar, faz sentido dar um nome a esse resultado. Uma **view** é uma consulta salva no catálogo do banco. Ela se comporta como uma tabela para quem consulta, mas não guarda dados próprios: ao ler a view, o PostgreSQL executa a consulta subjacente.

`CREATE VIEW vw_receita_categoria AS SELECT ...` registra a definição. Depois, `SELECT * FROM vw_receita_categoria` funciona como qualquer tabela. Views simplificam o acesso, padronizam regras e escondem complexidade. Podem também servir de camada de compatibilidade: se o esquema muda, a view mantém a interface antiga para os consumidores.

Uma **materialized view** é diferente. `CREATE MATERIALIZED VIEW ... AS SELECT ...` executa a consulta e **armazena o resultado**. Consultas ficam rápidas porque leem dados já calculados, mas o conteúdo envelhece. Para atualizar, é preciso `REFRESH MATERIALIZED VIEW`, que pode ser blocking. `REFRESH ... CONCURRENTLY` exige um índice único e permite leitura durante a atualização, com mais complexidade.

A escolha depende do caso. Views comuns são ideais para padronização e segurança lógica, com custo de execução em cada leitura. Materialized views brilham em relatórios pesados e pouco voláteis, como dashboards diários, desde que a defasagem seja aceitável. Para dados que mudam a cada segundo, o refresh pode custar mais do que economiza.

Views podem ser atualizáveis em casos simples, mas agregações e joins geralmente não permitem `INSERT`, `UPDATE` ou `DELETE` diretos. Quando a atualização é necessária, use `INSTEAD OF` triggers ou funções. Não trate view como sinônimo de tabela: os limites aparecem quando você tenta escrever.

## Por que isso importa

Views reduzem duplicação e dão uma camada de contrato entre dados e aplicação. Materialized views resolvem desempenho de relatórios, mas introduzem o problema de consistência temporal. O DBA precisa saber o que está armazenado, o que é calculado e qual o custo de cada leitura. Na Padaria Byte, receita por categoria e resumo por status são candidatos naturais.

## Conceitos-chave

- **View:** consulta nomeada, sem armazenamento próprio.
- **Materialized view:** resultado armazenado fisicamente.
- **REFRESH:** atualização da materialized view.
- **REFRESH CONCURRENTLY:** atualização sem bloquear leituras, exige índice único.
- **View atualizável:** casos simples permitem DML.
- **Camada de compatibilidade:** view preserva interface.

## Erros comuns

Tratar view como tabela e esperar dados materializados é o erro mais comum. Outro é esquecer o refresh de uma materialized view e exibir números velhos. Também é frequente criar views sobre views sem medir o custo. Por fim, tentar atualizar uma view com agregação e receber erro.

## Checklist de domínio

- [ ] Consigo criar e consultar uma view.
- [ ] Consigo explicar quando usar materialized view.
- [ ] Consigo atualizar uma materialized view.
- [ ] Consigo reconhecer os limites de DML em views.

## Resumo

Views nomeiam consultas; materialized views armazenam resultados. A primeira prioriza atualidade e simplicidade; a segunda, desempenho com defasagem controlada. Escolher entre elas é uma decisão de consistência e custo.
