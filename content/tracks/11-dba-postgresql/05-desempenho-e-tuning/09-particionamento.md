---
slug: "particionamento"
title: "Particionamento"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["indices-em-profundidade"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual é a principal vantagem operacional do particionamento por tempo?"
    options:
      - "Remover dados antigos descartando partições inteiras"
      - "Eliminar a necessidade de índices"
      - "Garantir que toda consulta fique mais rápida"
      - "Permitir mais de uma chave primária por tabela"
    answerIndex: 0
    explanation: "Descartar uma partição é muito mais barato que um DELETE gigante, que gera bloat e precisa de vacuum."
  - type: single_choice
    xp: 10
    question: "O que é partition pruning?"
    options:
      - "O planejador ignorar partições que não podem conter as linhas do filtro"
      - "A remoção automática de partições antigas"
      - "A cópia de uma partição para outra tabela"
      - "A compressão de índices por partição"
    answerIndex: 0
    explanation: "Quando a consulta filtra pela chave de partição, o planejador descarta partições irrelevantes e lê menos dados."
  - type: true_false
    xp: 10
    statement: "Particionar uma tabela sempre a torna mais rápida, mesmo quando as consultas não filtram pela chave de partição."
    answer: false
    explanation: "Sem filtro pela chave, o planejador pode precisar visitar todas as partições. O ganho depende do padrão de consulta e da manutenção."
---

# Particionamento

Uma tabela de eventos com bilhões de linhas por ano fica difícil de consultar, indexar e limpar. O particionamento declarativo divide a tabela em partes menores, chamadas partições, mantendo uma tabela-mãe para consultas. A divisão pode ser por faixa (`RANGE`), lista (`LIST`) ou hash (`HASH`). Para dados temporais, `RANGE` por mês ou dia é o padrão.

Com `PARTITION BY RANGE (criado_em)`, você cria partições com limites definidos. Consultas que filtram pela data permitem **partition pruning**: o planejador ignora partições que não podem conter o resultado. Isso reduz leitura e memória. Sem filtro pela chave de partição, o ganho pode desaparecer, porque todas as partições precisam ser consideradas.

A maior vantagem operacional é a retenção. Em vez de `DELETE FROM eventos WHERE criado_em < ...`, você executa `DROP TABLE eventos_2024_01` ou `DETACH PARTITION`. A operação é rápida e não gera bloat. Também é possível anexar partições carregadas previamente com `ATTACH PARTITION`, útil em migrações.

Atenção às chaves. A chave primária e as restrições `UNIQUE` precisam incluir a chave de partição. Índices são criados por partição ou na tabela-mãe, e o custo de manutenção distribuído deve ser planejado. Extensões como `pg_partman` automatizam criação e retenção, mas o conceito continua o mesmo.

## Por que isso importa

Particionamento resolve retenção e consultas por faixa em volumes grandes. Mal usado, adiciona complexidade sem ganho. O DBA decide com base no crescimento e no padrão de acesso.

## Conceitos-chave

- **PARTITION BY RANGE:** faixas de valores.
- **Partição padrão:** recebe o que não casa.
- **Pruning:** descarte de partições irrelevantes.
- **ATTACH/DETACH:** anexa e desanexa partições.
- **Retenção:** descarte rápido de dados antigos.
- **Chave de partição:** precisa participar de restrições únicas.

## Erros comuns

Particionar sem filtrar pela chave. Esquecer a partição padrão. Criar chave primária sem a chave de partição. Automatizar retenção com DELETE em vez de DROP.

## Checklist de domínio

- [ ] Sei escolher RANGE, LIST ou HASH.
- [ ] Sei explicar pruning.
- [ ] Sei planejar retenção por partição.
- [ ] Sei citar restrições de chave primária.

## Resumo

Particionamento divide para operar e consultar melhor. Funciona quando a chave está nos filtros. Retenção por DROP é o grande ganho, mas o desenho de chaves precisa acompanhar.
