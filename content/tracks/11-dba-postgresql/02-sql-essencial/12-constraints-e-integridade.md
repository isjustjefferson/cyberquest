---
slug: "constraints-e-integridade"
title: "Constraints e integridade"
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
    prompt: "Adicione à tabela produtos uma constraint CHECK que impeça preços negativos (preco >= 0)."
    starter: "ALTER TABLE produtos\n  ADD CONSTRAINT ck_produtos_preco CHECK ();"
    grade:
      mode: state_check
      expected_sql: |
        ALTER TABLE produtos
          ADD CONSTRAINT ck_produtos_preco CHECK (preco >= 0);
      check_sql: |
        SELECT pg_get_constraintdef(oid) AS definicao
        FROM pg_constraint
        WHERE conrelid = 'produtos'::regclass AND contype = 'c'
        ORDER BY 1;
    hints:
      - text: "A sintaxe é ALTER TABLE tabela ADD CONSTRAINT nome CHECK (condição)."
        cost_bits: 5
      - text: "A condição é preco >= 0."
        cost_bits: 10
    explanation: "CHECK impede que o banco aceite valores inválidos, independentemente de quem grava os dados."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: |
      CREATE TABLE avaliacoes (
        id INTEGER PRIMARY KEY,
        produto_id INTEGER NOT NULL,
        nota INTEGER NOT NULL
      );
    prompt: "Na tabela avaliacoes (já criada), adicione uma FOREIGN KEY em produto_id referenciando produtos(id), com ON DELETE CASCADE."
    starter: "ALTER TABLE avaliacoes\n  ADD CONSTRAINT fk_avaliacoes_produto\n  FOREIGN KEY ();"
    grade:
      mode: state_check
      expected_sql: |
        ALTER TABLE avaliacoes
          ADD CONSTRAINT fk_avaliacoes_produto
          FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE;
      check_sql: |
        SELECT pg_get_constraintdef(oid) AS definicao
        FROM pg_constraint
        WHERE conrelid = 'avaliacoes'::regclass AND contype = 'f'
        ORDER BY 1;
    hints:
      - text: "Use FOREIGN KEY (coluna) REFERENCES tabela(coluna)."
        cost_bits: 5
      - text: "ON DELETE CASCADE vem depois do REFERENCES."
        cost_bits: 10
    explanation: "A FOREIGN KEY garante que toda avaliação aponte para um produto existente. Com CASCADE, apagar o produto apaga as avaliações."
  - type: single_choice
    xp: 8
    question: "O que ON DELETE CASCADE faz em uma FOREIGN KEY?"
    options:
      - "Apaga automaticamente as linhas filhas quando a linha pai é apagada"
      - "Impede a exclusão do pai enquanto houver filhos"
      - "Transforma a coluna filha em NULL"
      - "Desativa a constraint temporariamente"
    answerIndex: 0
    explanation: "CASCADE propaga a exclusão. RESTRICT e NO ACTION impedem a exclusão do pai; SET NULL zera a referência."
---

# Constraints e integridade

Validar dados apenas na aplicação é frágil. Um script de importação, uma ferramenta de suporte ou um humano com acesso ao banco podem gravar algo que a regra de negócio proíbe. **Constraints** são regras que o próprio banco impõe em toda gravação. Se a regra está no banco, ela vale sempre, independentemente de quem escreve.

As principais são: `PRIMARY KEY` (identifica a linha de forma única e não nula), `FOREIGN KEY` (exige que a referência exista na tabela pai), `UNIQUE` (impede valores repetidos), `NOT NULL` (exige valor), `CHECK` (valida uma expressão) e `DEFAULT` (valor padrão quando não informado). `EXCLUDE` impede sobreposição de intervalos, como horários de sala; aparece em casos específicos e não precisa ser dominado nesta fase.

A `FOREIGN KEY` tem comportamento configurável quando a linha pai some. `ON DELETE RESTRICT` (ou o padrão `NO ACTION`) impede a exclusão enquanto houver filhos. `ON DELETE CASCADE` apaga os filhos junto. `ON DELETE SET NULL` zera a referência. Escolher essa opção é decisão de negócio: apagar um produto deve apagar suas avaliações? Quase sempre não deveria apagar o histórico de pedidos. O dataset da Padaria Byte já tem `pedidos.cliente_id` referenciando `clientes(id)` sem ação explícita, o que equivale a `NO ACTION`.

Nomear constraints é uma boa prática. Um nome como `ck_produtos_preco` aparece em mensagens de erro e facilita `DROP CONSTRAINT` depois. Para adicionar constraints a tabelas grandes e com dados, use `NOT VALID` para criar a regra só para novas linhas e depois `VALIDATE CONSTRAINT` para verificar as antigas com menos bloqueio. Antes de adicionar uma regra, confira se os dados existentes já a respeitam; senão o comando falha.

Integridade também depende de tipos e de modelagem. Uma constraint `CHECK` não substitui uma coluna com o tipo certo, e uma `UNIQUE` em `email` não substitui uma política de normalização do texto (maiúsculas, espaços). O banco protege o que você declarou; o resto ainda é responsabilidade do design.

## Por que isso importa

Dados inconsistentes custam caro: relatórios errados, cobranças duplicadas, pedidos órfãos. Constraints são a última linha de defesa e a documentação executável do modelo. Um DBA que deixa a integridade só no código da aplicação está aceitando que o próximo bug vire corrupção de dados.

## Conceitos-chave

- **PRIMARY KEY:** identificador único e não nulo.
- **FOREIGN KEY:** referência obrigatória a uma tabela pai.
- **ON DELETE:** RESTRICT, NO ACTION, CASCADE, SET NULL.
- **UNIQUE / NOT NULL / CHECK / DEFAULT:** regras de valor.
- **Nomear constraints:** facilita manutenção e erros claros.
- **NOT VALID + VALIDATE CONSTRAINT:** adição com menos bloqueio.

## Erros comuns

Adicionar uma constraint sem verificar os dados existentes é o erro mais comum. Outro é usar `CASCADE` por reflexo e apagar histórico sem perceber. Também é frequente confiar só na aplicação. Por fim, esquecer que `UNIQUE` aceita múltiplos `NULL` em muitos casos.

## Checklist de domínio

- [ ] Consigo adicionar uma CHECK e uma FOREIGN KEY com nome.
- [ ] Consigo explicar as opções de ON DELETE.
- [ ] Consigo justificar quando a regra deve estar no banco.
- [ ] Consigo citar o caminho seguro para adicionar constraints em tabelas grandes.

## Resumo

Constraints transformam regras de negócio em garantias do banco. CHECK valida valores, FOREIGN KEY protege relações e ON DELETE define o destino dos filhos. A Padaria Byte não aceita preço negativo nem avaliação órfã, mesmo que a aplicação falhe.
