---
slug: "autovacuum-e-bloat"
title: "Autovacuum e bloat"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["mvcc-e-vacuum"]
lab_slug: "vacuum-e-bloat"
exercises:
  - type: single_choice
    xp: 10
    question: "Por que uma transação aberta por horas é problemática para o VACUUM?"
    options:
      - "Porque impede o VACUUM de limpar versões posteriores ao seu snapshot"
      - "Porque bloqueia todos os INSERTs do banco"
      - "Porque desliga o autovacuum automaticamente"
      - "Porque força um checkpoint a cada segundo"
    answerIndex: 0
    explanation: "O VACUUM não pode remover versões que ainda poderiam ser vistas por aquela transação. Uma sessão longa retém lixo em todo o banco."
  - type: single_choice
    xp: 10
    question: "Numa tabela gigante, por que o scale_factor padrão do autovacuum pode ser inadequado?"
    options:
      - "Porque 20% de uma tabela enorme ainda representa milhões de linhas mortas"
      - "Porque o padrão só funciona em tabelas pequenas com índice"
      - "Porque o autovacuum ignora tabelas com mais de 1 GB"
      - "Porque o scale_factor só vale para ANALYZE"
    answerIndex: 0
    explanation: "O gatilho é proporcional ao tamanho. Em tabelas grandes, ajuste por tabela para agir com uma fração menor ou um número absoluto menor."
  - type: sql_query
    xp: 14
    dataset: padaria_byte
    setup: ""
    prompt: "Liste as tabelas do schema public com o número de tuplas mortas, da maior para a menor, mostrando nome e n_dead_tup."
    starter: "SELECT relname AS tabela, n_dead_tup\nFROM pg_stat_user_tables\nORDER BY ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT relname AS tabela, n_dead_tup
        FROM pg_stat_user_tables
        ORDER BY n_dead_tup DESC, relname;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A visão pg_stat_user_tables traz n_dead_tup por tabela."
        cost_bits: 5
      - text: "Desempate pelo nome para a ordem ficar estável."
        cost_bits: 8
    explanation: "n_dead_tup é um dos sinais de bloat. Combine com tamanho da tabela e frequência de vacuum para decidir ajustes."
---

# Autovacuum e bloat

O autovacuum é um conjunto de processos que limpa tuplas mortas e atualiza estatísticas automaticamente. Ele dispara quando o número de tuplas mortas passa de um limiar calculado por `autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * n_live_tup`. O padrão de 20% funciona bem em tabelas pequenas, mas numa tabela de 500 milhões de linhas significa esperar 100 milhões de versões mortas antes de agir.

Ajuste por tabela quando o padrão não serve. `ALTER TABLE pedidos SET (autovacuum_vacuum_scale_factor = 0.02, autovacuum_vacuum_threshold = 10000);` faz o worker agir muito antes. Você também pode aumentar o número de workers, ajustar `autovacuum_naptime` e dar mais memória com `autovacuum_work_mem` ou `maintenance_work_mem`. Mudanças globais afetam todo o cluster; prefira o ajuste local para tabelas críticas.

Transações longas são o inimigo silencioso. Uma sessão `idle in transaction` mantém um snapshot antigo e impede a limpeza de qualquer versão posterior a ele, em todo o banco. O resultado é bloat crescendo mesmo com autovacuum ativo. Monitore `pg_stat_activity`, defina `idle_in_transaction_session_timeout` e encerre sessões esquecidas.

Para bloat já instalado, `VACUUM (ANALYZE)` pode bastar. Se a tabela continuar inchada, `REINDEX CONCURRENTLY` reconstrói índices sem bloquear escritas; `pg_repack` faz uma reorganização online. `VACUUM FULL` é a última opção e exige janela. Meça antes e depois com tamanho da relação e tuplas mortas.

## Por que isso importa

Bloat aumenta I/O, desperdiça disco e degrada planos. Um autovacuum bem ajustado evita que a manutenção vire emergência.

## Conceitos-chave

- **autovacuum:** limpeza e análise automáticas.
- **threshold + scale_factor:** gatilho de disparo.
- **Ajuste por tabela:** configuração local.
- **idle in transaction:** sessão que retém snapshot.
- **REINDEX CONCURRENTLY:** reconstrução online.

## Erros comuns

Só aumentar o global. Ignorar sessões ociosas em transação. Rodar VACUUM FULL como rotina. Não medir o efeito das mudanças.

## Checklist de domínio

- [ ] Sei explicar o gatilho do autovacuum.
- [ ] Sei ajustar uma tabela específica.
- [ ] Sei encontrar sessões que impedem a limpeza.
- [ ] Sei escolher entre VACUUM, REINDEX e FULL.

## Resumo

Autovacuum é proporcional ao tamanho e precisa de ajuste em tabelas grandes. Transações longas seguram o lixo. Meça bloat e escolha a ferramenta menos invasiva.
