---
slug: "indices-introducao"
title: "Índices: introdução"
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
    prompt: "Crie um índice B-tree chamado idx_pedidos_cliente sobre a coluna cliente_id da tabela pedidos."
    starter: "CREATE INDEX idx_pedidos_cliente\n  ON pedidos ();"
    grade:
      mode: state_check
      expected_sql: |
        CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);
      check_sql: |
        SELECT count(*)::int AS indices_em_cliente
        FROM pg_indexes
        WHERE tablename = 'pedidos' AND indexdef LIKE '%(cliente_id)%';
    hints:
      - text: "A sintaxe é CREATE INDEX nome ON tabela (coluna)."
        cost_bits: 5
      - text: "O índice padrão é B-tree, então não precisa especificar o método."
        cost_bits: 10
    explanation: "Um índice em cliente_id acelera filtros e junções por cliente, ao custo de espaço e de manutenção nas escritas."
  - type: single_choice
    xp: 8
    question: "Qual é o principal custo de um índice?"
    options:
      - "Mais trabalho nas escritas e mais espaço em disco"
      - "Impede o uso de chaves primárias"
      - "Torna SELECT * obrigatório"
      - "Remove a necessidade de ANALYZE"
    answerIndex: 0
    explanation: "Cada INSERT, UPDATE e DELETE também atualiza os índices, e eles ocupam armazenamento."
  - type: true_false
    xp: 8
    statement: "Quanto mais índices uma tabela tiver, melhor será o desempenho geral."
    answer: false
    explanation: "Índices aceleram leituras específicas, mas aumentam o custo de escrita e de espaço. Crie os que as consultas reais usam e meça o efeito."
---

# Índices: introdução

Sem índice, para achar os pedidos de um cliente o banco precisa ler a tabela inteira, linha por linha. Isso se chama **Seq Scan** (varredura sequencial). Um índice é uma estrutura auxiliar que organiza valores de uma coluna para localizar linhas rapidamente, como o índice remissivo no fim de um livro: em vez de folhear tudo, você vai direto à página.

O tipo padrão no PostgreSQL é a **B-tree**, uma árvore balanceada que suporta igualdade, faixas e ordenação. `CREATE INDEX nome ON tabela (coluna)` cria um índice. Índices também podem ser únicos (`CREATE UNIQUE INDEX`) para garantir que valores não se repitam. Chaves primárias e constraints `UNIQUE` já criam índices automaticamente, então não há razão para duplicá-los.

Quando o planejador decide usar o índice, aparece um **Index Scan** ou **Bitmap Index Scan** no plano de execução. Se a consulta devolve uma grande parte da tabela, uma varredura sequencial pode ser mais barata que o índice, e o planejador a escolhe. Isso é normal. Em tabelas pequenas, como as da Padaria Byte, o plano quase sempre é sequencial, mesmo com índice. O índice mostra seu valor em tabelas grandes e em consultas seletivas.

Índices têm custo. Cada `INSERT`, `UPDATE` e `DELETE` precisa atualizar todos os índices da tabela. Eles ocupam espaço e precisam de manutenção. Um índice que ninguém usa é só custo. Indexe colunas que aparecem em filtros, junções e ordenações frequentes, e confira com `EXPLAIN` se o índice realmente é usado. O aprofundamento em tipos de índice, planos e manutenção fica para o módulo de desempenho.

Por fim, índices não corrigem consultas mal escritas. Uma função aplicada na coluna, como `lower(email)`, impede o uso de um índice simples sobre `email`; nesses casos é preciso um índice de expressão. Entender isso evita a sensação de que “o índice não funciona”.

## Por que isso importa

Consultas lentas são uma das causas mais comuns de reclamação de usuário. Um índice certo resolve em segundos o que levava minutos. Um índice errado desacelera toda a escrita. O DBA precisa decidir com base em consultas reais, não em intuição, e isso começa entendendo o custo de cada índice.

## Conceitos-chave

- **Seq Scan:** leitura sequencial da tabela inteira.
- **Index Scan / Bitmap Index Scan:** acesso via índice.
- **B-tree:** estrutura padrão, boa para igualdade e faixas.
- **Índice único:** garante unicidade.
- **Custo de escrita e espaço:** o preço de cada índice.
- **Índice de expressão:** indexa o resultado de uma função.

## Erros comuns

Criar índice em todas as colunas por precaução é o erro mais comum. Outro é esperar que o planejador use o índice em tabela pequena. Também é frequente aplicar função na coluna filtrada e perder o índice. Por fim, duplicar um índice que a chave primária já cria.

## Checklist de domínio

- [ ] Consigo criar um índice B-tree.
- [ ] Consigo explicar Seq Scan versus Index Scan.
- [ ] Consigo citar o custo de um índice.
- [ ] Consigo justificar quando não indexar.

## Resumo

Índices aceleram a localização de linhas com custo em escrita e espaço. Crie os que as consultas reais usam, confirme no plano de execução e evite duplicá-los. Em tabelas pequenas, a varredura sequencial pode ser a melhor escolha.
