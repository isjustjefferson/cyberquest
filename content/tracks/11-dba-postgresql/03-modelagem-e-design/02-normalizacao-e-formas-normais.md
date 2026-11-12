---
slug: "normalizacao-e-formas-normais"
title: "Normalização e formas normais"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 8
    question: "Qual forma normal exige que cada coluna contenha valores atômicos?"
    options:
      - "1FN"
      - "2FN"
      - "3FN"
      - "BCNF"
    answerIndex: 0
    explanation: "A primeira forma normal proíbe listas e grupos repetidos dentro de uma coluna."
  - type: code_review
    xp: 8
    question: "Na tabela abaixo, qual linha representa uma dependência transitiva (cidade depende do cliente, não do pedido)?"
    code: |
      CREATE TABLE pedidos_planos (
        pedido_id INTEGER PRIMARY KEY,
        cliente_id INTEGER NOT NULL,
        cliente_cidade TEXT NOT NULL,
        total NUMERIC(10, 2) NOT NULL
      );
    vulnerableLines: [4]
    explanation: "cliente_cidade depende de cliente_id, que não é a chave. Para a 3FN, a cidade deve ficar na tabela de clientes."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: |
      CREATE TABLE vendas_planas (
        venda_id INTEGER PRIMARY KEY,
        cliente_nome TEXT NOT NULL,
        cliente_cidade TEXT NOT NULL,
        produto_nome TEXT NOT NULL,
        quantidade INTEGER NOT NULL
      );
      INSERT INTO vendas_planas VALUES
        (1, 'Ana', 'Recife', 'Pão Francês', 3),
        (2, 'Ana', 'Recife', 'Brigadeiro', 2),
        (3, 'Bruno', 'Salvador', 'Pão Francês', 1);
    prompt: "A tabela vendas_planas repete cliente e produto em cada linha. Crie norm_clientes(id, nome, cidade), norm_produtos(id, nome) e norm_vendas(venda_id, cliente_id, produto_id, quantidade) com chaves e FKs, e popule-as a partir de vendas_planas. Mantenha os venda_id originais."
    starter: "CREATE TABLE norm_clientes (...);\nCREATE TABLE norm_produtos (...);\nCREATE TABLE norm_vendas (...);\n-- popular a partir de vendas_planas"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE norm_clientes (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cidade TEXT NOT NULL);
        CREATE TABLE norm_produtos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
        CREATE TABLE norm_vendas (
          venda_id INTEGER PRIMARY KEY,
          cliente_id INTEGER NOT NULL REFERENCES norm_clientes(id),
          produto_id INTEGER NOT NULL REFERENCES norm_produtos(id),
          quantidade INTEGER NOT NULL
        );
        INSERT INTO norm_clientes VALUES (1, 'Ana', 'Recife'), (2, 'Bruno', 'Salvador');
        INSERT INTO norm_produtos VALUES (1, 'Pão Francês'), (2, 'Brigadeiro');
        INSERT INTO norm_vendas VALUES (1, 1, 1, 3), (2, 1, 2, 2), (3, 2, 1, 1);
      check_sql: |
        SELECT v.venda_id, c.nome AS cliente, c.cidade, p.nome AS produto, v.quantidade
        FROM norm_vendas v
        JOIN norm_clientes c ON c.id = v.cliente_id
        JOIN norm_produtos p ON p.id = v.produto_id
        ORDER BY v.venda_id;
    hints:
      - text: "Cada entidade vira uma tabela com sua própria chave primária."
        cost_bits: 5
      - text: "A tabela de vendas guarda apenas as chaves estrangeiras e a quantidade."
        cost_bits: 10
    explanation: "Separar fatos em tabelas próprias elimina repetição e evita que o mesmo cliente tenha duas cidades diferentes."
---

# Normalização e formas normais

Uma tabela que mistura informações de entidades diferentes causa problemas previsíveis. Imagine uma planilha de vendas com `cliente_nome` e `cliente_cidade` repetidos em toda linha. Se o cliente Ana muda de cidade, é preciso atualizar várias linhas; se esquecer uma, o banco passa a ter duas cidades para a mesma pessoa. Esses problemas são chamados de **anomalias**: de inserção (não consigo cadastrar um cliente sem pedido), de atualização (o dado fica inconsistente) e de exclusão (apagar o último pedido de um cliente apaga o cliente).

A normalização organiza os dados para que cada fato viva em um único lugar. A **1FN** exige valores atômicos: nada de listas separadas por vírgula dentro de uma coluna, nem grupos repetidos. A **2FN** exige que, em chaves compostas, cada atributo dependa da chave inteira. A **3FN** exige que atributos não-chave não dependam de outros atributos não-chave, eliminando dependências transitivas. A **BCNF** é uma versão mais rigorosa da 3FN, e vale conhecê-la de forma geral.

No exemplo da Padaria Byte, `cliente_cidade` depende de `cliente_id`, não do `pedido_id`. Isso é uma dependência transitiva: o pedido depende do cliente, e o cliente tem a cidade. A correção é mover a cidade para a tabela de clientes e manter no pedido apenas a referência.

Normalizar não é um fim em si. Consultas que juntam muitas tabelas podem ficar mais lentas, e relatórios analíticos às vezes se beneficiam de **desnormalização consciente**: copiar dados de propósito, com a regra de manter a cópia sincronizada. Essa decisão precisa de medição e de documentação. Desnormalizar por preguiça de modelar cria exatamente as anomalias que a normalização evita.

## Por que isso importa

Dados duplicados são a origem de relatórios que não batem entre si. Quando o mesmo fato existe em dois lugares, cedo ou tarde eles divergem. Normalizar protege a consistência; desnormalizar, quando justificado, protege o desempenho. O DBA precisa saber fazer as duas coisas e, principalmente, explicar a escolha.

## Conceitos-chave

- **Anomalias:** inserção, atualização e exclusão.
- **1FN:** valores atômicos.
- **2FN:** dependência total da chave.
- **3FN:** sem dependência transitiva.
- **BCNF:** versão mais rigorosa da 3FN.
- **Desnormalização consciente:** cópia deliberada, medida e documentada.

## Erros comuns

Guardar listas em texto dentro de uma coluna é o erro mais comum. Outro é deixar atributos de outra entidade na tabela de fatos. Também é frequente desnormalizar sem plano de sincronização. Por fim, normalizar demais e criar dezenas de tabelas triviais sem ganho real.

## Checklist de domínio

- [ ] Consigo identificar uma anomalia em uma tabela.
- [ ] Consigo explicar 1FN, 2FN e 3FN com exemplo.
- [ ] Consigo separar fatos em tabelas normalizadas.
- [ ] Consigo justificar uma desnormalização.

## Resumo

Normalização elimina repetição e anomalias ao colocar cada fato em um único lugar. 1FN trata valores atômicos, 2FN a chave completa e 3FN as dependências transitivas. Desnormalizar é válido quando medido e controlado.
