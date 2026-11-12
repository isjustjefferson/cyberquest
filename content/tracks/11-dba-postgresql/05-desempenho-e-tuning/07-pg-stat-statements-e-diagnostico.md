---
slug: "pg-stat-statements-e-diagnostico"
title: "pg_stat_statements e diagnóstico"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["explain-e-planos-de-execucao"]
lab_slug: "query-lenta"
exercises:
  - type: single_choice
    xp: 10
    question: "Por que o tempo total é mais útil que o tempo médio para priorizar otimizações?"
    options:
      - "Porque revela consultas rápidas executadas muitas vezes que somam muito custo"
      - "Porque o tempo médio nunca é confiável"
      - "Porque consultas lentas não aparecem no pg_stat_statements"
      - "Porque o total ignora o tempo de espera por locks"
    answerIndex: 0
    explanation: "Uma consulta de 2 ms executada 5 milhões de vezes pode consumir mais que uma consulta de 30 s executada uma vez por dia."
  - type: fill_command
    xp: 10
    question: "Complete a consulta que ordena as consultas pelo maior tempo total de execução."
    template: "SELECT query FROM pg_stat_statements ORDER BY ___ DESC LIMIT 5;"
    blanks: ["total_exec_time"]
    accepted: [["total_exec_time"]]
    explanation: "total_exec_time acumula o tempo de execução. mean_exec_time mostra a média por chamada; ambos ajudam, mas respondem perguntas diferentes."
  - type: true_false
    xp: 8
    statement: "pg_stat_statements precisa estar em shared_preload_libraries e normalmente exige reinício para começar a coletar."
    answer: true
    explanation: "A extensão instrumenta o executor. O carregamento em shared_preload_libraries acontece na inicialização do postmaster."
---

# pg_stat_statements e diagnóstico

Otimizar sem dados é adivinhação. O `pg_stat_statements` agrega consultas por formato normalizado: valores literais viram parâmetros (`$1`, `$2`), e execuções equivalentes são somadas. Ele mostra `calls`, `total_exec_time`, `mean_exec_time`, `rows`, leitura de blocos e uso de WAL. Para habilitar, adicione a extensão a `shared_preload_libraries`, reinicie e execute `CREATE EXTENSION pg_stat_statements;`.

A pergunta certa depende do objetivo. **Tempo total** identifica quem mais consome o servidor, incluindo consultas rápidas e frequentes. **Tempo médio** destaca consultas individualmente caras. **Chamadas** mostram volume. **Blocos lidos** revela pressão de I/O e cache. Combine essas dimensões em vez de olhar apenas a consulta mais lenta do dia.

A normalização tem limites. Consultas geradas dinamicamente com estrutura diferente podem aparecer separadas; literais em `IN` podem variar. Ainda assim, é a melhor visão agregada disponível. Use `pg_stat_reset()` com cuidado: você perde o histórico e precisa esperar nova coleta.

Complementos úteis incluem `log_min_duration_statement` para registrar consultas acima de um limite, `auto_explain` para planos de consultas lentas e visões de atividade e tabelas. Estabeleça uma rotina: toda semana, liste as principais consultas por tempo total, verifique planos das suspeitas e meça o efeito de qualquer mudança.

## Por que isso importa

A consulta que mais custa raramente é a que parece mais lenta no teste manual. Dados agregados direcionam o esforço para onde o impacto é maior.

## Conceitos-chave

- **Normalização:** literais viram parâmetros.
- **total_exec_time:** custo acumulado.
- **mean_exec_time:** custo médio.
- **shared_preload_libraries:** carregamento na inicialização.
- **log_min_duration_statement:** registro por limite.
- **pg_stat_reset:** zera contadores.

## Erros comuns

Ordenar só por tempo médio. Habilitar a extensão sem reiniciar. Comparar períodos após reset sem registrar a data. Otimizar consulta irrelevante para a carga.

## Checklist de domínio

- [ ] Sei habilitar pg_stat_statements.
- [ ] Sei interpretar total, média e chamadas.
- [ ] Sei combinar com logs.
- [ ] Sei montar uma rotina semanal de análise.

## Resumo

pg_stat_statements transforma execuções em dados agregados. Priorize por impacto total, confirme com planos e registre o antes e depois.
