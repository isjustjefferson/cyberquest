---
slug: "funcoes-escalares-e-null"
title: "Funções escalares, NULL e CASE"
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
    prompt: "Conte os pedidos por mês em 2024, mostrando o mês truncado e a quantidade."
    starter: "SELECT \nFROM pedidos\nGROUP BY \nORDER BY ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT date_trunc('month', criado_em) AS mes, count(*)::int AS pedidos
        FROM pedidos
        GROUP BY 1
        ORDER BY 1;
      ordered: true
      compare_column_names: true
    hints:
      - text: "date_trunc('month', criado_em) reduz a data ao primeiro dia do mês."
        cost_bits: 5
      - text: "O GROUP BY pode usar a posição 1 da projeção."
        cost_bits: 10
    explanation: "date_trunc é útil para agrupar por mês. count(*)::int converte o bigint para um tipo amigável na saída."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id, nome e uma coluna faixa: 'barato' quando preço < 5, 'médio' quando preço < 15 e 'caro' nos demais casos. Ordene por id."
    starter: "SELECT id, nome,\n  CASE \n  END AS faixa\nFROM produtos\nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, nome,
          CASE
            WHEN preco < 5 THEN 'barato'
            WHEN preco < 15 THEN 'médio'
            ELSE 'caro'
          END AS faixa
        FROM produtos
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "CASE WHEN condição THEN valor ... ELSE valor END."
        cost_bits: 5
      - text: "A ordem dos WHEN importa: o primeiro que casar vence."
        cost_bits: 10
    explanation: "CASE avalia as condições em ordem. O ELSE cobre os casos restantes; sem ELSE, o resultado seria NULL."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Liste id, o nome em maiúsculas e o tamanho do nome para os produtos com id de 1 a 5, em ordem de id."
    starter: "SELECT id, \nFROM produtos\nWHERE id <= 5\nORDER BY id;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT id, upper(nome) AS nome_maiusculo, length(nome) AS tamanho
        FROM produtos
        WHERE id <= 5
        ORDER BY id;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Use upper() e length()."
        cost_bits: 5
      - text: "Dê aliases com AS para os nomes das colunas."
        cost_bits: 10
    explanation: "Funções escalares transformam cada linha individualmente. Aliases deixam o resultado legível e estável."
  - type: single_choice
    xp: 8
    question: "O que WHERE telefone = NULL retorna?"
    options:
      - "Nenhuma linha, porque a comparação com NULL é desconhecida"
      - "Todas as linhas com telefone vazio"
      - "Todas as linhas da tabela"
      - "Um erro de sintaxe"
    answerIndex: 0
    explanation: "NULL representa desconhecido. Use IS NULL ou IS NOT NULL; a igualdade comum não retorna verdadeiro."
---

# Funções escalares, NULL e CASE

SQL não serve apenas para selecionar colunas: ele transforma valores. Funções de texto, data e conversão permitem formatar resultados, agrupar períodos e tratar ausências. A Padaria Byte precisa responder perguntas como “quantos pedidos por mês?”, “quais produtos são baratos?” e “qual o tamanho do nome?”. Funções escalares resolvem isso sem alterar os dados armazenados.

`NULL` é o conceito que mais confunde. Ele não é zero, não é string vazia e não é falso: significa **desconhecido**. Por isso `NULL = NULL` não é verdadeiro; o resultado é desconhecido. Para testar ausência, use `IS NULL` e `IS NOT NULL`. A lógica de três valores afeta `WHERE`, `CASE` e expressões: uma condição desconhecida não entra no resultado.

`COALESCE(valor, padrão)` devolve o primeiro argumento não nulo. É útil para exibir um texto padrão quando o telefone não existe ou para combinar colunas. `NULLIF(a, b)` devolve `NULL` quando os valores são iguais; serve para evitar divisão por zero ou normalizar um valor sentinela. Essas funções são declarativas e legíveis.

Funções de texto incluem `upper`, `lower`, `length`, `substring`, `concat` e o operador `||`. Datas usam `now()`, `date_trunc`, `extract` e intervalos. `date_trunc('month', criado_em)` transforma qualquer data no primeiro dia do mês, permitindo agrupar. `extract(year FROM criado_em)` devolve o componente desejado.

`CASE WHEN ... THEN ... ELSE ... END` é o “se/senão” do SQL. Ele avalia condições em ordem e retorna o primeiro resultado correspondente. Pode ser usado na projeção, em `ORDER BY` e até em agregações. Para faixas de preço, a ordem dos `WHEN` define o comportamento; o `ELSE` cobre o restante.

## Por que isso importa

Relatórios dependem de funções. Sem `date_trunc`, agrupar por mês vira uma sequência de condições. Sem `COALESCE`, valores nulos aparecem como vazios na interface. Sem entender `NULL`, filtros retornam conjuntos inesperados. A Padaria Byte usa esses recursos para transformar dados brutos em informação útil.

## Conceitos-chave

- **NULL:** valor desconhecido, testado com IS NULL.
- **COALESCE:** primeiro valor não nulo.
- **NULLIF:** transforma igualdade em NULL.
- **Funções de texto:** upper, lower, length, substring, concat.
- **date_trunc / extract:** agrupamento e extração de datas.
- **CASE:** lógica condicional por linha.
- **Cast `::`:** conversão explícita de tipo.

## Erros comuns

Usar `= NULL` é o erro clássico. Outro é esquecer o `ELSE` e receber NULL inesperado. Também é comum agrupar por uma expressão diferente da projetada e obter erro. Por fim, converter texto para número sem validar pode gerar erro em produção.

## Checklist de domínio

- [ ] Consigo testar NULL corretamente.
- [ ] Consigo usar COALESCE em um relatório.
- [ ] Consigo agrupar datas por mês.
- [ ] Consigo escrever um CASE com faixas.

## Resumo

Funções escalares transformam valores linha a linha; CASE aplica lógica condicional; NULL exige tratamento explícito. Datas truncadas e textos normalizados tornam relatórios possíveis. Entender esses recursos evita resultados sutis e errados.
