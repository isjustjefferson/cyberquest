---
slug: "boss-modelagem"
title: "Boss: Modelagem"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: match
    xp: 12
    question: "Na Biblioteca Byte, relacione a informação ao papel no modelo."
    pairs:
      - ["Livro", "Entidade"]
      - ["Título do livro", "Atributo"]
      - ["Empréstimo de um livro a um leitor", "Relacionamento"]
    explanation: "Entidades são coisas que guardamos, atributos são suas informações e relacionamentos ligam entidades."
  - type: single_choice
    xp: 12
    question: "Um livro pode ter vários autores e um autor pode ter vários livros. Qual cardinalidade e estrutura representam isso?"
    options:
      - "N:N com tabela associativa"
      - "1:N com coluna autor_id em livros"
      - "1:1 com chave composta"
      - "N:N com coluna de lista em livros"
    answerIndex: 0
    explanation: "Relacionamento muitos para muitos exige tabela associativa com as chaves dos dois lados."
  - type: code_review
    xp: 12
    question: "Qual linha viola a 3FN ao guardar o nome da editora junto de cada livro?"
    code: |
      CREATE TABLE livros (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        editora_id INTEGER NOT NULL,
        editora_nome TEXT NOT NULL
      );
    vulnerableLines: [5]
    explanation: "editora_nome depende de editora_id, não da chave do livro. O nome deveria ficar na tabela de editoras."
  - type: order
    xp: 12
    question: "Coloque as etapas de modelagem na ordem correta."
    items:
      - "Escrever o DDL com PKs, FKs e constraints"
      - "Identificar entidades e atributos"
      - "Definir cardinalidades"
      - "Verificar violações de normalização"
    correctOrder: [1, 2, 3, 0]
    explanation: "Entidades vêm primeiro, depois cardinalidades, normalização e só então o DDL com as regras do banco."
  - type: sql_query
    xp: 40
    dataset: padaria_byte
    setup: ""
    prompt: "Crie as tabelas autores (id INTEGER PRIMARY KEY, nome TEXT NOT NULL), livros (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, ano INTEGER NOT NULL CHECK (ano > 0)) e livro_autor (livro_id e autor_id INTEGER NOT NULL, com FKs para livros e autores e PRIMARY KEY composta)."
    starter: "CREATE TABLE autores (...);\nCREATE TABLE livros (...);\nCREATE TABLE livro_autor (...);"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE autores (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
        CREATE TABLE livros (
          id INTEGER PRIMARY KEY,
          titulo TEXT NOT NULL,
          ano INTEGER NOT NULL CHECK (ano > 0)
        );
        CREATE TABLE livro_autor (
          livro_id INTEGER NOT NULL REFERENCES livros(id),
          autor_id INTEGER NOT NULL REFERENCES autores(id),
          PRIMARY KEY (livro_id, autor_id)
        );
      check_sql: |
        SELECT
          (SELECT count(*) FROM information_schema.tables
             WHERE table_name IN ('autores', 'livros', 'livro_autor'))::int AS tabelas,
          (SELECT count(*) FROM pg_constraint
             WHERE contype IN ('p', 'f')
               AND conrelid IN (SELECT oid FROM pg_class
                                WHERE relname IN ('autores', 'livros', 'livro_autor')))::int AS chaves;
    hints:
      - text: "A tabela associativa precisa de duas FKs e uma PRIMARY KEY composta."
        cost_bits: 5
      - text: "O CHECK fica na coluna ano."
        cost_bits: 10
    explanation: "Entrega final: N:N com tabela associativa, chaves e constraints declaradas no banco."
---

# Boss: Modelagem

Este desafio fecha o módulo de modelagem. Você recebe uma descrição da **Biblioteca Byte**: livros, autores e empréstimos. A tarefa é a mesma de uma modelagem real: identificar entidades, classificar relacionamentos, encontrar problemas de normalização e, por fim, escrever o DDL com chaves e constraints.

Comece sempre pelo negócio. Um livro tem título e ano; um autor tem nome; um livro pode ter vários autores, e um autor pode ter vários livros. Isso é N:N e pede tabela associativa. Só depois de fechar o modelo conceitual vale olhar para as tabelas, as chaves e as regras.

Ao revisar a normalização, procure dependências que não pertencem à tabela. Nome de editora repetido em cada livro é um exemplo clássico de dependência transitiva. Quando a entrega envolve DDL, lembre que o banco deve impor as regras: chave primária, chave estrangeira e checagem de valores.

Os exercícios são avaliados por modo: a parte de SQL compara o estado final das tabelas e das constraints com o gabarito, então nomes de colunas e tipos precisam estar corretos.

## Checklist de domínio

- [ ] Consigo separar entidades, atributos e relacionamentos.
- [ ] Consigo modelar N:N com tabela associativa.
- [ ] Consigo apontar violações de normalização.
- [ ] Consigo escrever DDL com PKs, FKs e constraints.

## Resumo

Modelar é ouvir o negócio, classificar relações, eliminar redundância e deixar o banco proteger as regras. Esse processo sustenta todo o trabalho de um DBA, da criação do esquema às migrações futuras.
