---
slug: "json-jsonb-e-arrays"
title: "JSONB e arrays"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: |
      ALTER TABLE produtos ADD COLUMN atributos jsonb;
      UPDATE produtos SET atributos = CASE
        WHEN categoria = 'Pães' THEN '{"vegano": true, "alergenos": ["gluten"]}'::jsonb
        ELSE '{"vegano": false, "alergenos": ["leite"]}'::jsonb
      END;
    prompt: "A coluna atributos (jsonb) já existe em produtos. Mostre id e o campo alergenos, como texto, dos produtos com id de 1 a 3, em ordem de id."
    starter: "SELECT id, atributos->>'alergenos' AS alergenos\nFROM produtos\nWHERE id <= 3\nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, atributos->>'alergenos' AS alergenos
        FROM produtos
        WHERE id <= 3
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Use ->> para obter o valor como texto e -> para obter JSON."
        cost_bits: 5
      - text: "A chave é 'alergenos', sem acento."
        cost_bits: 10
    explanation: "O operador ->> extrai o campo como texto. Para manter o JSON, use -> e o resultado continua sendo jsonb."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: |
      ALTER TABLE produtos ADD COLUMN atributos jsonb;
      UPDATE produtos SET atributos = CASE
        WHEN categoria = 'Pães' THEN '{"vegano": true, "alergenos": ["gluten"]}'::jsonb
        ELSE '{"vegano": false, "alergenos": ["leite"]}'::jsonb
      END;
    prompt: "Liste id e nome dos produtos cujo atributos contém {\"vegano\": true}, em ordem de id. Use o operador de contenção @>."
    starter: "SELECT id, nome\nFROM produtos\nWHERE atributos @> \nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, nome
        FROM produtos
        WHERE atributos @> '{"vegano": true}'
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "O lado direito do @> também é um jsonb entre aspas simples."
        cost_bits: 5
      - text: "Contenção verifica se o documento inclui a estrutura informada."
        cost_bits: 10
    explanation: "@> testa contenção. Por ser jsonb, pode usar índice GIN quando a tabela crescer."
  - type: single_choice
    xp: 8
    question: "Por que preferir jsonb a json na maioria dos casos?"
    options:
      - "jsonb é armazenado em formato binário, indexável e mais rápido para consultas"
      - "json não aceita objetos aninhados"
      - "jsonb permite armazenar datas sem tipo"
      - "json é sempre mais rápido porque preserva espaços"
    answerIndex: 0
    explanation: "json guarda o texto original; jsonb o converte para binário, o que permite índices GIN e consultas mais eficientes."
---

# JSONB e arrays

Nem todo dado cabe em colunas fixas. Os atributos de um produto variam: um pão pode ter lista de alergênicos, outro pode ter informação nutricional, outro nenhuma. Criar uma coluna para cada atributo possível gera tabelas cheias de `NULL`. O PostgreSQL oferece `json` e `jsonb` para dados semiestruturados e arrays para listas simples dentro de uma coluna.

A diferença entre `json` e `jsonb` é importante. `json` guarda o texto como foi digitado, preservando espaços e a ordem das chaves, mas precisa ser interpretado a cada consulta. `jsonb` converte o conteúdo para um formato binário: não preserva espaços, não mantém chaves duplicadas (a última vence) e é mais rápido para consultar. Na maioria dos casos, prefira `jsonb`. Ele também suporta índices GIN, que aceleram operadores como `@>` e `?`.

Os operadores principais são: `->` (retorna JSON), `->>` (retorna texto), `@>` (contenção: o documento inclui a estrutura informada) e `?` (existência de chave). `jsonb_array_elements` transforma um array JSON em linhas, útil para analisar listas. Com `->>` você obtém texto, que pode ser comparado ou convertido com `::`.

Arrays nativos, como `text[]`, guardam listas do mesmo tipo. Operadores como `ANY` verificam se um valor está no array, e `unnest` transforma um array em linhas. Arrays são úteis para listas pequenas e simples, como tags. Quando a lista tem atributos próprios, ou precisa de integridade referencial, ela merece uma tabela associada.

Esse é o ponto de decisão: se você filtra, junta ou agrega sempre por um campo, ele provavelmente deve ser uma coluna de verdade, com tipo e constraint. JSONB é ótimo para dados opcionais, configurações e atributos heterogêneos. Usá-lo para esconder o modelo relacional é uma dívida que aparece em consultas lentas e dados inconsistentes.

## Por que isso importa

Catálogos de produtos, preferências de clientes e eventos de integração costumam ter formato variável. Um DBA que sabe quando usar JSONB evita tanto a explosão de colunas quanto a perda de controle sobre os dados. Saber indexar e consultar JSONB determina se a consulta responde em milissegundos ou em minutos.

## Conceitos-chave

- **json vs. jsonb:** texto preservado versus binário indexável.
- **-> / ->>:** JSON versus texto.
- **@>:** contenção de documentos.
- **?:** existência de chave.
- **jsonb_array_elements:** array JSON em linhas.
- **Arrays (`text[]`):** listas simples do mesmo tipo.
- **unnest / ANY:** operações sobre arrays.
- **Índice GIN:** acelera operadores de jsonb.

## Erros comuns

Comparar `->` com texto sem converter é um erro frequente; use `->>`. Outro é usar `json` quando a consulta exige índice. Também é comum guardar em JSONB um campo que é filtrado em toda consulta, o que deveria ser coluna. Por fim, esquecer aspas simples ao escrever literais JSON.

## Checklist de domínio

- [ ] Consigo extrair um campo de jsonb como texto.
- [ ] Consigo filtrar por contenção com @>.
- [ ] Consigo explicar json versus jsonb.
- [ ] Consigo decidir quando um atributo deve virar coluna.

## Resumo

JSONB modela atributos variáveis com consultas eficientes e índices. ->> extrai texto, @> filtra por contenção e arrays guardam listas simples. A regra prática é usar coluna para o que você consulta sempre e JSONB para o que varia.
