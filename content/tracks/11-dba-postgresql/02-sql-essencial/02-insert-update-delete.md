---
slug: "insert-update-delete"
title: "INSERT, UPDATE e DELETE"
kind: lesson
difficulty: 1
est_minutes: 12
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Insira na tabela produtos o produto id 26, nome 'Pão de Queijo', categoria 'Salgados', preço 4.50 e estoque 30."
    starter: "INSERT INTO produtos (id, nome, categoria, preco, estoque)\nVALUES ();"
    grade:
      mode: state_check
      expected_sql: |
        INSERT INTO produtos (id, nome, categoria, preco, estoque)
        VALUES (26, 'Pão de Queijo', 'Salgados', 4.50, 30);
      check_sql: |
        SELECT id, nome, categoria, preco::text AS preco, estoque
        FROM produtos
        WHERE id = 26;
    hints:
      - text: "A ordem dos valores precisa seguir a ordem das colunas declaradas."
        cost_bits: 5
      - text: "Use aspas simples para textos e não esqueça o ponto decimal."
        cost_bits: 10
    explanation: "INSERT ... VALUES grava uma ou mais linhas. Textos usam aspas simples; valores numéricos não."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Aumente em 10% o preço de todos os produtos da categoria 'Doces'."
    starter: "UPDATE produtos\nSET \nWHERE ;"
    grade:
      mode: state_check
      expected_sql: |
        UPDATE produtos
        SET preco = preco * 1.10
        WHERE categoria = 'Doces';
      check_sql: |
        SELECT id, preco::text AS preco
        FROM produtos
        WHERE categoria = 'Doces'
        ORDER BY id;
    hints:
      - text: "Multiplicar por 1.10 aplica um aumento de 10%."
        cost_bits: 5
      - text: "O WHERE é obrigatório para limitar a alteração."
        cost_bits: 10
    explanation: "UPDATE altera linhas existentes. Sem WHERE, a alteração atinge a tabela inteira."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Remova todos os pedidos com status 'cancelado'. Como itens_pedido referencia pedidos, apague primeiro os itens desses pedidos e depois os pedidos."
    starter: "-- apague os itens dos pedidos cancelados\n\n-- apague os pedidos cancelados\n"
    grade:
      mode: state_check
      expected_sql: |
        DELETE FROM itens_pedido
        WHERE pedido_id IN (SELECT id FROM pedidos WHERE status = 'cancelado');
        DELETE FROM pedidos WHERE status = 'cancelado';
      check_sql: |
        SELECT
          (SELECT count(*)::int FROM pedidos WHERE status = 'cancelado') AS pedidos_cancelados,
          (SELECT count(*)::int FROM pedidos) AS pedidos,
          (SELECT count(*)::int FROM itens_pedido) AS itens;
    hints:
      - text: "A FK de itens_pedido impede apagar um pedido que ainda tem itens."
        cost_bits: 5
      - text: "Use uma subquery com IN para apagar os itens dos pedidos cancelados."
        cost_bits: 10
    explanation: "A ordem importa quando há FK: primeiro os filhos (itens), depois o pai (pedido). Rodar o SELECT equivalente antes é prática de segurança."
  - type: true_false
    xp: 8
    statement: "DELETE FROM clientes; apaga apenas o primeiro registro."
    answer: false
    explanation: "Sem WHERE, DELETE atinge todas as linhas da tabela. O comando não tem a noção de 'primeiro registro'."
---

# INSERT, UPDATE e DELETE

Depois de criar a estrutura, a Padaria Byte precisa colocar dados dentro dela e mantê-los atualizados. `INSERT` adiciona linhas, `UPDATE` altera linhas existentes e `DELETE` remove linhas. Esses três comandos parecem simples, mas concentram alguns dos acidentes mais caros da profissão. O DBA aprende a usá-los com a mesma disciplina de quem manipula energia elétrica: verificar antes, agir com escopo e confirmar depois.

`INSERT INTO produtos (colunas) VALUES (valores)` grava uma linha. É possível inserir várias linhas de uma vez, separando os grupos por vírgula. Também existe `INSERT ... SELECT`, que insere o resultado de uma consulta; útil para copiar dados entre tabelas ou popular uma tabela a partir de outra. `RETURNING` devolve os valores inseridos, o que ajuda a confirmar o resultado sem uma segunda consulta.

`UPDATE produtos SET preco = preco * 1.10 WHERE categoria = 'Doces'` altera apenas as linhas que satisfazem o `WHERE`. A expressão pode usar o valor atual da coluna, como nesse aumento percentual. O perigo está na ausência do `WHERE`: sem ele, **todas** as linhas são alteradas. A regra de ouro é rodar antes um `SELECT` com a mesma condição e conferir a quantidade de linhas.

`DELETE FROM pedidos WHERE status = 'cancelado'` remove as linhas que casam com a condição. Quando há chave estrangeira apontando para a tabela, é preciso apagar antes as linhas filhas (por exemplo, os itens do pedido) ou usar uma regra `ON DELETE CASCADE`. Sem `WHERE`, a tabela fica vazia. `TRUNCATE` é uma alternativa mais rápida para esvaziar uma tabela inteira, mas tem comportamento diferente em relação a locks, identidade e chaves estrangeiras. `RETURNING` também funciona em `UPDATE` e `DELETE`, permitindo ver o que mudou.

## Por que isso importa

Em produção, um `UPDATE` sem `WHERE` pode alterar preços de todos os produtos ou status de todos os pedidos. Um `DELETE` sem condição pode apagar o histórico. Mesmo com backup, a recuperação custa tempo e pode perder transações posteriores. Por isso, o fluxo profissional é: inspecionar com `SELECT`, executar dentro de uma transação, verificar o número de linhas afetadas e só então confirmar.

`ON CONFLICT` permite lidar com conflitos de unicidade. O padrão `DO NOTHING` ignora a inserção duplicada; `DO UPDATE` faz um upsert, atualizando a linha existente. Use com critério: upsert não é desculpa para ignorar a modelagem. Ele é útil em importações idempotentes e sincronizações.

## Conceitos-chave

- **INSERT:** adiciona linhas.
- **INSERT ... SELECT:** insere o resultado de uma consulta.
- **UPDATE:** altera linhas filtradas por WHERE.
- **DELETE:** remove linhas filtradas por WHERE.
- **RETURNING:** devolve as linhas afetadas.
- **TRUNCATE:** esvazia a tabela inteira.
- **ON CONFLICT:** trata colisões de unicidade.

## Erros comuns

O erro mais grave é `UPDATE` ou `DELETE` sem `WHERE`. Outro é confiar em `ROLLBACK` sem saber se a transação está realmente aberta. Também é comum usar `TRUNCATE` em tabela referenciada sem entender as dependências. Por fim, não presuma a ordem das linhas afetadas: SQL não garante ordem sem `ORDER BY`.

## Checklist de domínio

- [ ] Consigo inserir uma linha e conferir com RETURNING.
- [ ] Consigo atualizar apenas um subconjunto com WHERE.
- [ ] Consigo remover linhas sem apagar a tabela inteira.
- [ ] Consigo explicar o fluxo SELECT → transação → verificação → COMMIT.

## Resumo

INSERT, UPDATE e DELETE alteram dados. O escopo vem do WHERE, a confirmação vem da transação e a segurança vem da verificação. A Padaria Byte não pode perder pedidos por um comando sem condição; disciplina de DML é parte central do trabalho de DBA.
