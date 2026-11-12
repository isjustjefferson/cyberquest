---
slug: "chaves-surrogate-vs-natural-e-tipos-de-id"
title: "Chaves: surrogate vs. natural, IDENTITY e UUID"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Crie a tabela fornecedores com id bigint GENERATED ALWAYS AS IDENTITY como chave primária e nome text NOT NULL."
    starter: "CREATE TABLE fornecedores (\n  \n);"
    grade:
      mode: state_check
      expected_sql: |
        CREATE TABLE fornecedores (
          id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          nome text NOT NULL
        );
      check_sql: |
        SELECT column_name, data_type, is_identity
        FROM information_schema.columns
        WHERE table_name = 'fornecedores'
        ORDER BY ordinal_position;
    hints:
      - text: "A sintaxe é coluna bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY."
        cost_bits: 5
      - text: "A coluna nome é text e não pode ser nula."
        cost_bits: 10
    explanation: "IDENTITY é o padrão SQL moderno para chaves geradas pelo banco, no lugar do antigo serial."
  - type: true_false
    xp: 8
    statement: "O CPF é uma boa chave primária porque é único."
    answer: false
    explanation: "CPF é uma chave natural: pode ser digitado errado, muda em casos raros e é dado pessoal sensível. Uma chave substituta sem significado de negócio é mais segura."
---

# Chaves: surrogate vs. natural, IDENTITY e UUID

Toda tabela precisa de uma forma de identificar cada linha. A **chave natural** usa um dado que já existe no negócio, como CPF, e-mail ou código de barras. A **chave substituta** (surrogate) é um identificador gerado pelo banco, sem significado de negócio, como um número sequencial. Escolher entre elas parece um detalhe, mas afeta integridade, privacidade e desempenho.

Chaves naturais parecem convenientes, mas têm problemas. Podem mudar: um cliente troca de e-mail, e a chave que o identificava precisa ser atualizada em todas as tabelas filhas. Podem ser digitadas errado, o que gera duplicidade falsa ou erro de validação. E muitas são dados pessoais, o que espalha informação sensível por todas as tabelas que a referenciam. Na LGPD, isso aumenta a superfície de exposição. Por isso o padrão mais comum é uma chave substituta, com a chave natural guardada como coluna `UNIQUE`.

Para gerar a chave substituta, o PostgreSQL oferece `GENERATED ALWAYS AS IDENTITY` (ou `BY DEFAULT`). É a forma padrão SQL e substitui o antigo `serial`. `ALWAYS` impede inserir o valor manualmente, a menos que se use `OVERRIDING SYSTEM VALUE`. O tipo `bigint` cobre a grande maioria dos casos sem risco de estouro.

`uuid` é outra opção, útil quando o identificador é gerado fora do banco, em sistemas distribuídos ou quando o id não deve revelar volume de registros. O problema é que UUID v4 é aleatório: inserções espalham-se pelo índice e geram fragmentação, o que piora o desempenho em tabelas grandes. Versões ordenáveis por tempo (como UUIDv7, quando disponível) reduzem esse efeito. Escolha `bigint` identity como padrão e `uuid` quando houver uma razão concreta.

Chaves compostas, como `(pedido_id, produto_id)` em tabelas associativas, são corretas quando a identidade da linha é o próprio par. Não as use apenas para evitar criar um id, porque complicam chaves estrangeiras e consultas.

## Por que isso importa

A chave primária é usada em todas as junções, índices e referências. Trocá-la depois é uma migração cara e arriscada. Uma boa escolha protege a privacidade, evita reescritas em cascata e mantém o desempenho previsível. O DBA é quem alerta quando uma chave natural está prestes a virar um problema.

## Conceitos-chave

- **Chave natural:** dado do negócio (CPF, e-mail).
- **Chave substituta (surrogate):** identificador sem significado de negócio.
- **GENERATED ... AS IDENTITY:** geração padrão de sequência.
- **bigint:** tipo recomendado para ids sequenciais.
- **uuid:** identificador global, com custo de índice se aleatório.
- **Chave composta:** identidade formada por mais de uma coluna.

## Erros comuns

Usar CPF como chave primária é o erro clássico. Outro é usar `serial` em código novo sem necessidade. Também é comum escolher UUID v4 em tabelas grandes sem medir o impacto. Por fim, criar chave composta onde um id simples bastaria.

## Checklist de domínio

- [ ] Consigo criar uma coluna IDENTITY.
- [ ] Consigo explicar por que CPF não deve ser chave primária.
- [ ] Consigo comparar bigint identity e uuid.
- [ ] Consigo decidir quando usar chave composta.

## Resumo

Chaves naturais mudam e expõem dados pessoais; chaves substitutas são estáveis e neutras. IDENTITY é o padrão moderno para ids sequenciais, e UUID serve quando há motivo concreto. A escolha afeta toda a modelagem.
