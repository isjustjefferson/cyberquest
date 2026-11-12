---
slug: "transacoes-na-pratica"
title: "Transações na prática"
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
    prompt: "Em uma única transação, baixe 5 unidades do estoque do produto id 1 e confirme a alteração com COMMIT."
    starter: "BEGIN;\nUPDATE produtos\nSET \nWHERE id = 1;\nCOMMIT;"
    grade:
      mode: state_check
      expected_sql: |
        BEGIN;
        UPDATE produtos SET estoque = estoque - 5 WHERE id = 1;
        COMMIT;
      check_sql: |
        SELECT id, estoque FROM produtos WHERE id = 1;
    hints:
      - text: "BEGIN inicia, COMMIT confirma."
        cost_bits: 5
      - text: "Atualize estoque = estoque - 5."
        cost_bits: 10
    explanation: "Uma transação agrupa comandos. COMMIT torna as alterações permanentes para outras sessões."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Inicie uma transação, apague todos os itens de pedido e todos os pedidos e, em seguida, desfaça tudo com ROLLBACK. Ao final, os 300 pedidos devem continuar existindo."
    starter: "BEGIN;\nDELETE FROM itens_pedido;\nDELETE FROM pedidos;\n;"
    grade:
      mode: state_check
      expected_sql: |
        BEGIN;
        DELETE FROM itens_pedido;
        DELETE FROM pedidos;
        ROLLBACK;
      check_sql: |
        SELECT count(*)::int AS total FROM pedidos;
    hints:
      - text: "A FK exige apagar os itens antes dos pedidos."
        cost_bits: 5
      - text: "ROLLBACK desfaz as alterações; a contagem precisa voltar a 300."
        cost_bits: 10
    explanation: "ROLLBACK descarta as alterações não confirmadas. Em transações com FKs, a ordem das exclusões também importa."
  - type: sql_query
    xp: 12
    dataset: padaria_byte
    setup: ""
    prompt: "Em uma transação, dobre o preço do produto id 2, crie um savepoint, dobre novamente e então volte ao savepoint antes do COMMIT. Ao final, o preço deve estar dobrado apenas uma vez."
    starter: "BEGIN;\nUPDATE produtos SET preco = preco * 2 WHERE id = 2;\nSAVEPOINT antes_segunda;\nUPDATE produtos SET preco = preco * 2 WHERE id = 2;\n;\nCOMMIT;"
    grade:
      mode: state_check
      expected_sql: |
        BEGIN;
        UPDATE produtos SET preco = preco * 2 WHERE id = 2;
        SAVEPOINT antes_segunda;
        UPDATE produtos SET preco = preco * 2 WHERE id = 2;
        ROLLBACK TO SAVEPOINT antes_segunda;
        COMMIT;
      check_sql: |
        SELECT id, preco::text AS preco FROM produtos WHERE id = 2;
    hints:
      - text: "ROLLBACK TO SAVEPOINT desfaz apenas o que veio depois do savepoint."
        cost_bits: 5
      - text: "O COMMIT mantém o primeiro UPDATE."
        cost_bits: 10
    explanation: "Savepoints permitem desfazer parte de uma transação sem abandonar o todo. Útil em cargas com etapas arriscadas."
  - type: multi_choice
    xp: 8
    question: "Quais afirmações sobre transações estão corretas?"
    options:
      - "COMMIT confirma; ROLLBACK desfaz"
      - "Uma transação pode conter várias instruções"
      - "SAVEPOINT permite desfazer parte da transação"
      - "Toda instrução abre uma transação implícita que nunca é confirmada"
    answerIndexes: [0, 1, 2]
    explanation: "Transações agrupam instruções e terminam com COMMIT ou ROLLBACK. Savepoints criam marcas intermediárias. Autocommit confirma cada instrução isolada."
---

# Transações na prática

Bancos relacionais existem em parte por causa de transações. A Padaria Byte não pode debitar estoque e falhar ao registrar o pedido no meio do caminho. Uma transação agrupa operações para que sejam aplicadas por inteiro ou descartadas por inteiro. Esse é o “A” de ACID: atomicidade.

`BEGIN` inicia uma transação explícita. Os comandos seguintes ficam visíveis apenas na sessão atual até um `COMMIT`. Se algo der errado, `ROLLBACK` descarta tudo. Em caso de erro grave, o PostgreSQL pode abortar a transação automaticamente, e qualquer comando seguinte falha até você emitir `ROLLBACK`. Por isso, em scripts, trate o erro e finalize a transação de forma explícita.

Por padrão, cada instrução isolada roda em autocommit: o banco abre e confirma uma transação implícita. Isso é conveniente para leitura, mas perigoso para sequências que precisam ser atômicas. `SAVEPOINT nome` cria uma marca dentro da transação. `ROLLBACK TO SAVEPOINT nome` desfaz apenas o que veio depois da marca, sem abandonar as operações anteriores.

Concorrência é a outra metade da história. Duas transações podem ler e escrever as mesmas linhas. O PostgreSQL usa isolamento `READ COMMITTED` por padrão; níveis mais altos como `REPEATABLE READ` e `SERIALIZABLE` reduzem anomalias ao custo de mais conflitos. Locks explícitos com `SELECT ... FOR UPDATE` reservam linhas para atualização. Entender o nível de isolamento evita surpresas como leituras não repetíveis e escritas perdidas.

Transações longas seguram recursos e podem bloquear outras operações. Mantenha-as curtas, evite interação humana no meio e não misture chamadas externas demoradas. Se precisar de processamento pesado, faça fora da transação e grave o resultado em um passo curto.

## Por que isso importa

Sem transações, um erro no meio de uma transferência deixa o sistema inconsistente. Com transações longas, o sistema trava. O DBA precisa equilibrar atomicidade e concorrência. Na Padaria Byte, baixar estoque, registrar pedido e itens devem ser uma unidade lógica.

## Conceitos-chave

- **BEGIN / COMMIT / ROLLBACK:** controle da transação.
- **Autocommit:** confirmação por instrução.
- **SAVEPOINT:** marca intermediária.
- **ROLLBACK TO SAVEPOINT:** desfaz parte.
- **Níveis de isolamento:** READ COMMITTED, REPEATABLE READ, SERIALIZABLE.
- **Locks:** SELECT FOR UPDATE e bloqueios implícitos.
- **Transações curtas:** menos contenção e menos risco.

## Erros comuns

Deixar transações abertas por muito tempo é o erro mais custoso. Outro é capturar erro na aplicação e continuar usando a mesma transação abortada. Também é comum confundir savepoint com transação independente. Por fim, assumir que o nível padrão de isolamento elimina todas as anomalias.

## Checklist de domínio

- [ ] Consigo confirmar e desfazer uma transação.
- [ ] Consigo usar savepoint para desfazer parte.
- [ ] Consigo explicar autocommit.
- [ ] Consigo citar riscos de transações longas.

## Resumo

Transações garantem atomicidade. BEGIN, COMMIT e ROLLBACK controlam a unidade; savepoints criam etapas reversíveis. Isolamento e locks tratam concorrência. A Padaria Byte depende de transações curtas e corretas para manter consistência.
