---
slug: "configuracao-postgresql-conf"
title: "Configuração: postgresql.conf"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["psql-e-ferramentas-de-linha-de-comando"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual parâmetro exige reinício do servidor para mudar de valor?"
    options:
      - "log_min_duration_statement"
      - "shared_buffers"
      - "search_path"
      - "work_mem"
    answerIndex: 1
    explanation: "shared_buffers é alocado na inicialização do postmaster. log_min_duration_statement aceita reload; search_path e work_mem podem variar por sessão."
  - type: sql_query
    xp: 14
    dataset: padaria_byte
    setup: ""
    prompt: "Liste os 5 primeiros parâmetros de configuração cujo contexto é 'postmaster', em ordem alfabética."
    starter: "SELECT name AS parametro\nFROM pg_settings\nWHERE context = ''\nORDER BY name\nLIMIT 5;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT name AS parametro
        FROM pg_settings
        WHERE context = 'postmaster'
        ORDER BY name
        LIMIT 5;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A coluna context indica quando o parâmetro pode ser alterado."
        cost_bits: 5
      - text: "Filtre exatamente o valor postmaster."
        cost_bits: 8
    explanation: "pg_settings mostra valor, contexto e se há reinício pendente. Parâmetros postmaster só mudam ao reiniciar."
  - type: true_false
    xp: 8
    statement: "ALTER SYSTEM edita diretamente o arquivo postgresql.conf."
    answer: false
    explanation: "ALTER SYSTEM grava em postgresql.auto.conf, que é lido por último e sobrescreve o postgresql.conf. Isso explica configurações que parecem ignoradas."
---

# Configuração: postgresql.conf

O PostgreSQL lê configuração de camadas. `postgresql.conf` é o arquivo principal. `postgresql.auto.conf` é escrito por `ALTER SYSTEM` e tem precedência. Arquivos incluídos com `include` e `include_dir` entram na ordem definida. Além disso, `ALTER DATABASE ... SET` e `ALTER ROLE ... SET` aplicam valores por banco ou papel, e comandos `SET` valem para a sessão atual.

Nem toda mudança é imediata. O contexto de cada parâmetro define o mecanismo: `postmaster` exige reinício, `sighup` aceita recarregar configuração, `user` e `superuser` permitem alteração por sessão. A visão `pg_settings` mostra o contexto, o valor atual, o valor padrão e se existe reinício pendente (`pending_restart`). Use `SHOW nome` para uma leitura rápida.

O ciclo seguro é: descubra o contexto, valide a sintaxe, aplique, recarregue quando possível e confirme. `SELECT pg_reload_conf();` envia SIGHUP ao postmaster e faz os backends lerem configurações que não exigem reinício. `ALTER SYSTEM SET ...` grava no arquivo automático; `ALTER SYSTEM RESET ...` remove a entrada. Para reverter um parâmetro, saiba se ele veio do arquivo principal, do auto.conf ou de um comando de sessão.

Versione a configuração. Em um cluster de produção, mudanças devem passar por revisão e ter registro do motivo, do valor anterior e do efeito esperado. Medir antes e depois evita "ajustes" que pioram a carga. Um arquivo bem documentado também acelera a recuperação de desastres.

## Por que isso importa

Configuração errada causa desde logs ausentes até servidor sem memória. Saber onde o valor está definido e como aplicá-lo evita reinícios desnecessários e resolve o clássico "mudei e não teve efeito".

## Conceitos-chave

- **postgresql.conf:** configuração principal.
- **postgresql.auto.conf:** saída de ALTER SYSTEM, com precedência.
- **Contexto:** postmaster, sighup, user ou superuser.
- **pg_reload_conf():** recarrega sem reiniciar.
- **pending_restart:** indica mudança aguardando reinício.

## Erros comuns

Editar o arquivo principal e esquecer um `ALTER SYSTEM` antigo. Reiniciar sem necessidade. Mudar parâmetros sem medir. Aplicar valor inválido e deixar o serviço fora do ar.

## Checklist de domínio

- [ ] Sei consultar contexto e reinício pendente.
- [ ] Sei diferenciar reload e restart.
- [ ] Sei explicar a precedência do auto.conf.
- [ ] Sei documentar uma mudança de configuração.

## Resumo

Configuração vem em camadas e com contextos diferentes. `pg_settings` é a fonte da verdade; `pg_reload_conf()` aplica o que não exige reinício. Mudanças devem ser medidas e versionadas.
