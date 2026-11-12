---
slug: "modelagem-entidade-relacionamento"
title: "Modelagem entidade-relacionamento"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: match
    xp: 8
    question: "Relacione cada situação à cardinalidade correta."
    pairs:
      - ["Um cliente faz vários pedidos", "1:N"]
      - ["Um pedido tem vários produtos e um produto aparece em vários pedidos", "N:N"]
      - ["Cada cliente tem exatamente um perfil de fidelidade", "1:1"]
    explanation: "Cardinalidade descreve quantas instâncias de cada lado podem se relacionar. N:N exige tabela associativa."
  - type: order
    xp: 8
    question: "Coloque as etapas de modelagem na ordem correta."
    items:
      - "Modelo físico"
      - "Levantamento de requisitos"
      - "Modelo lógico"
      - "Modelo conceitual"
    correctOrder: [1, 3, 2, 0]
    explanation: "Primeiro entende-se o negócio, depois o modelo conceitual, o lógico (tabelas e chaves) e por fim o físico (tipos, índices, detalhes do SGBD)."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Crie a tabela avaliacoes para a relação N:N entre clientes e produtos: cliente_id INTEGER, produto_id INTEGER, nota INTEGER, ambos ids NOT NULL, com PRIMARY KEY composta (cliente_id, produto_id). Adicione as FOREIGN KEYs para clientes(id) e produtos(id)."
    starter: "CREATE TABLE avaliacoes (\n  \n);"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE avaliacoes (
          cliente_id INTEGER NOT NULL REFERENCES clientes(id),
          produto_id INTEGER NOT NULL REFERENCES produtos(id),
          nota INTEGER NOT NULL,
          PRIMARY KEY (cliente_id, produto_id)
        );
      check_sql: |
        SELECT
          (SELECT string_agg(column_name || ':' || data_type, ', ' ORDER BY ordinal_position)
             FROM information_schema.columns WHERE table_name = 'avaliacoes') AS colunas,
          (SELECT pg_get_constraintdef(oid)
             FROM pg_constraint WHERE conrelid = 'avaliacoes'::regclass AND contype = 'p') AS chave_primaria;
    hints:
      - text: "A tabela associativa tem as duas chaves estrangeiras."
        cost_bits: 5
      - text: "A chave primária composta é PRIMARY KEY (cliente_id, produto_id)."
        cost_bits: 10
    explanation: "Relacionamento N:N vira tabela associativa com chave composta. Cada par cliente-produto aparece uma vez."
---

# Modelagem entidade-relacionamento

Antes de criar qualquer tabela, é preciso entender o negócio. Modelar é transformar uma descrição do mundo real em estruturas de dados. Na Padaria Byte, a conversa começa com frases como “um cliente faz vários pedidos” e “um pedido tem vários produtos”. Cada substantivo importante vira candidato a entidade; cada verbo que liga duas entidades vira relacionamento.

Uma **entidade** é algo que você precisa guardar: cliente, produto, pedido. Seus **atributos** são as informações dela, como nome ou preço. Um **relacionamento** conecta entidades. A **cardinalidade** diz quantas instâncias de cada lado participam: 1:1 (um para um), 1:N (um para muitos) e N:N (muitos para muitos). Esses termos determinam como as tabelas ficam.

Relacionamentos 1:N são implementados com uma chave estrangeira no lado “muitos”. Pedidos têm `cliente_id`, por exemplo. Relacionamentos N:N não cabem em uma coluna só: um pedido pode ter vários produtos e um produto pode estar em vários pedidos. A solução é uma **tabela associativa** com chaves estrangeiras para os dois lados. Na Padaria Byte, essa tabela é `itens_pedido`, que também guarda quantidade e preço unitário, dados do relacionamento e não de nenhuma das entidades isoladas.

Relacionamentos 1:1 podem indicar que as duas entidades poderiam ser uma só, ou que uma parte é opcional e merece tabela separada. A escolha depende de quão frequentemente as informações são acessadas juntas e de quais campos são sensíveis. A pergunta útil é: quem consulta isso junto com aquilo?

Por fim, o processo segue etapas: levantamento de requisitos, modelo conceitual (entidades e relações), modelo lógico (tabelas, chaves e colunas) e modelo físico (tipos concretos, índices e detalhes do motor). Diagramas entidade-relacionamento, com a notação de pé de galinha, ajudam a comunicar o modelo com a equipe. Desenhar antes de criar tabelas reduz o número de migrações futuras.

## Por que isso importa

Um modelo errado gera consultas complicadas, duplicação e migrações caras. Um modelo bem feito deixa as perguntas do negócio fáceis de responder. Um DBA participa dessa conversa porque a cardinalidade define integridade, performance e o que pode ser apagado com segurança.

## Conceitos-chave

- **Entidade e atributo:** o que guardamos e suas informações.
- **Relacionamento:** conexão entre entidades.
- **Cardinalidade:** 1:1, 1:N, N:N.
- **Tabela associativa:** implementa N:N e guarda atributos do relacionamento.
- **Modelo conceitual, lógico e físico:** níveis de detalhe.
- **Diagrama ER:** notação de pé de galinha.

## Erros comuns

Colocar uma lista de produtos dentro do pedido como texto é o erro mais comum; quebra consultas e integridade. Outro é tratar N:N com duas colunas de id em uma tabela sem chave composta. Também é frequente modelar 1:1 sem necessidade e criar tabelas demais.

## Checklist de domínio

- [ ] Consigo identificar entidades e relacionamentos em uma descrição.
- [ ] Consigo classificar cardinalidades.
- [ ] Consigo transformar N:N em tabela associativa.
- [ ] Consigo listar as etapas da modelagem.

## Resumo

Modelagem começa pelo negócio: entidades, atributos e cardinalidades. 1:N usa chave estrangeira; N:N usa tabela associativa com chave composta. Modelo claro reduz retrabalho e torna o banco confiável.
