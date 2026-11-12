---
slug: "tipos-de-dados-e-create-table"
title: "Tipos de dados e CREATE TABLE"
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
    prompt: "Crie a tabela fornecedores com id inteiro como chave primária, nome text obrigatório e ativo boolean obrigatório com valor padrão true."
    starter: "CREATE TABLE fornecedores (\n  \n);"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE fornecedores (
          id integer PRIMARY KEY,
          nome text NOT NULL,
          ativo boolean NOT NULL DEFAULT true
        );
      check_sql: |
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'fornecedores'
        ORDER BY ordinal_position;
    hints:
      - text: "A declaração começa com CREATE TABLE fornecedores ( ... );"
        cost_bits: 5
      - text: "Use integer, text e boolean; DEFAULT true define o padrão."
        cost_bits: 10
    explanation: "O tipo vem antes das restrições. text não precisa de tamanho; boolean aceita true/false; DEFAULT preenche quando a coluna é omitida."
  - type: single_choice
    xp: 8
    question: "Qual tipo é mais adequado para valores monetários?"
    options:
      - "numeric(10,2)"
      - "float"
      - "real"
      - "text livre"
    answerIndex: 0
    explanation: "numeric armazena valores decimais exatos. float e real usam representação binária aproximada e não são indicados para dinheiro."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Adicione à tabela clientes uma coluna telefone do tipo text, opcional."
    starter: "ALTER TABLE clientes\n  ;"
    grade:
      mode: state_check
      expected_sql: |
        ALTER TABLE clientes ADD COLUMN telefone text;
      check_sql: |
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'clientes'
        ORDER BY ordinal_position;
    hints:
      - text: "ALTER TABLE clientes ADD COLUMN ..."
        cost_bits: 5
    explanation: "Sem NOT NULL, a coluna aceita NULL. Em uma tabela existente, a nova coluna aparece no final da ordem."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Crie a tabela cupons com codigo text como chave primária e desconto_pct integer obrigatório com padrão 0."
    starter: "CREATE TABLE cupons (\n  \n);"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE cupons (
          codigo text PRIMARY KEY,
          desconto_pct integer NOT NULL DEFAULT 0
        );
      check_sql: |
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'cupons'
        ORDER BY ordinal_position;
    hints:
      - text: "text também pode ser chave primária."
        cost_bits: 5
      - text: "A ordem é nome da coluna, tipo, restrições."
        cost_bits: 10
    explanation: "Chaves naturais em text são válidas quando o código é único por regra de negócio. O DEFAULT evita nulos acidentais."
---

# Tipos de dados e CREATE TABLE

Escolher o tipo é a primeira decisão de design de uma tabela. O tipo define o que pode ser armazenado, quanto espaço o valor ocupa, quais operadores funcionam e quais erros o banco consegue impedir. Na Padaria Byte, `preco` não pode ser um texto livre: se alguém gravar “quatro e cinquenta”, relatórios e somas quebram. Um tipo numérico correto transforma essa regra em estrutura.

Os tipos mais usados no dia a dia são `integer` para contadores pequenos, `bigint` para volumes que podem crescer muito, `numeric(p,s)` para valores exatos como dinheiro, `text` para strings sem limite rígido, `boolean` para verdadeiro/falso, `date` para datas sem hora e `timestamp`/`timestamptz` para data e hora. No PostgreSQL, `text` e `varchar(n)` têm desempenho equivalente; use limite de tamanho apenas quando for uma regra de negócio real.

Para dinheiro, use `numeric`, nunca `float` ou `real`. Tipos de ponto flutuante representam muitos decimais de forma aproximada, e somas acumuladas podem exibir diferenças. `numeric(10,2)` significa até dez dígitos no total, dois deles depois da vírgula. Para datas com hora, prefira `timestamptz`: ele guarda o instante e converte para o fuso da sessão, evitando ambiguidade entre servidores e usuários em fusos diferentes.

O comando `CREATE TABLE` declara colunas, tipos e restrições. `PRIMARY KEY` identifica a linha; `NOT NULL` proíbe ausência; `DEFAULT` fornece um valor quando a coluna é omitida; `CHECK` valida uma condição; `REFERENCES` cria chave estrangeira. As restrições são documentação executável: valem para a API, para scripts e para qualquer cliente que tente gravar.

Tabelas evoluem. `ALTER TABLE ... ADD COLUMN` adiciona uma coluna; em tabelas grandes, isso pode exigir cuidado com locks e tempo. `DROP COLUMN` remove; `DROP TABLE` apaga a estrutura e os dados. DDL também pode ser transacional no PostgreSQL, o que permite desfazer uma migração que falhou no meio. Ainda assim, operações pesadas merecem teste e janela adequada.

## Por que isso importa

Um tipo errado cobra juros. `preco` em texto impede `SUM`; data em texto impede comparações corretas; inteiro pequeno pode estourar; `float` cria diferenças de centavos. Restrições ausentes deixam a aplicação assumir responsabilidades que o banco poderia garantir. O DBA não escolhe tipos apenas por preferência: ele traduz regras de negócio em estrutura.

## Conceitos-chave

- **`integer` / `bigint`:** inteiros de tamanhos diferentes.
- **`numeric(p,s)`:** decimal exato, adequado a dinheiro.
- **`text` / `varchar`:** strings; mesmo desempenho no PostgreSQL.
- **`timestamptz`:** instante com fuso.
- **`DEFAULT`:** valor quando a coluna é omitida.
- **`ALTER TABLE`:** evolução controlada do esquema.
- **`CHECK`:** validação declarativa.

## Erros comuns

Usar `float` para preço é o erro mais comum. Outro é colocar limite em `varchar` sem regra de negócio, gerando falhas em nomes ou descrições. Também é frequente esquecer `NOT NULL` em campos obrigatórios e descobrir o problema meses depois. Por fim, rode DDL destrutivo sem conferir o banco e sem backup.

## Checklist de domínio

- [ ] Consigo escolher tipos para dinheiro, data, texto e boolean.
- [ ] Consigo criar uma tabela com chave primária e defaults.
- [ ] Consigo adicionar uma coluna opcional a uma tabela existente.
- [ ] Consigo explicar por que `float` não serve para dinheiro.

## Resumo

Tipos são contratos. `numeric` protege dinheiro, `timestamptz` protege instantes, `text` cobre strings e restrições declaram regras. `CREATE TABLE` e `ALTER TABLE` traduzem o modelo para o banco. Escolher bem agora evita migrações dolorosas depois.
