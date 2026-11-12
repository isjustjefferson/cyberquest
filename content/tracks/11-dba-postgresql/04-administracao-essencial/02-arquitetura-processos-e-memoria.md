---
slug: "arquitetura-processos-e-memoria"
title: "Arquitetura: processos e memória"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["instalacao-e-docker"]
lab_slug: null
exercises:
  - type: match
    xp: 12
    question: "Relacione cada processo ou área de memória à sua função."
    pairs:
      - ["postmaster", "Aceita conexões e supervisiona os processos filhos"]
      - ["checkpointer", "Grava checkpoints e consolida páginas sujas"]
      - ["WAL writer", "Grava o diário de transações no disco"]
      - ["Autovacuum launcher", "Agenda workers de limpeza e análise"]
      - ["shared_buffers", "Cache de páginas compartilhado entre sessões"]
    explanation: "O postmaster não executa consultas: ele orquestra. Processos de fundo cuidam de WAL, checkpoints, estatísticas e manutenção."
  - type: single_choice
    xp: 10
    question: "Por que muitas conexões simultâneas são custosas no PostgreSQL?"
    options:
      - "Porque cada conexão é um processo do sistema operacional com memória própria"
      - "Porque o PostgreSQL usa apenas uma thread para todas as consultas"
      - "Porque cada conexão duplica o diretório de dados"
      - "Porque o WAL é reescrito a cada nova sessão"
    answerIndex: 0
    explanation: "O modelo é processo por conexão. Cada backend consome memória e troca de contexto; poolers reduzem esse custo."
  - type: true_false
    xp: 8
    statement: "work_mem é um limite global para o servidor inteiro."
    answer: false
    explanation: "work_mem vale por operação e por sessão. Uma consulta com vários sorts ou joins pode usar múltiplas vezes esse valor."
---

# Arquitetura: processos e memória

O PostgreSQL usa um modelo de **processo por conexão**. Quando um cliente conecta, o `postmaster` cria um processo backend dedicado. Esse backend interpreta SQL, acessa buffers e devolve resultados. Por isso, milhares de conexões ociosas custam caro: cada uma é um processo com pilha, estado e descritores. Um pooler entre aplicação e banco costuma ser mais eficiente do que aumentar `max_connections` indefinidamente.

Ao redor dos backends, processos de fundo mantêm o banco saudável. O **checkpointer** grava checkpoints e ajuda a limitar o tempo de recuperação. O **background writer** vai escrevendo páginas sujas aos poucos. O **WAL writer** grava o diário de transações, que é a garantia de durabilidade. O **autovacuum launcher** agenda workers para limpar tuplas mortas e atualizar estatísticas. O coletor de estatísticas alimenta visões como `pg_stat_activity` e `pg_stat_database`.

A memória se divide em compartilhada e por sessão. `shared_buffers` é o cache de páginas visível a todos os backends; um ponto de partida comum em servidor dedicado é cerca de 25% da RAM. `work_mem` limita memória por operação de ordenação ou hash, não por consulta inteira nem por servidor. `maintenance_work_mem` atende operações como `VACUUM`, `CREATE INDEX` e `ALTER TABLE`. O sistema operacional também mantém cache de arquivos, por isso `effective_cache_size` orienta o planejador sobre a memória disponível total.

A escrita segue o WAL: a alteração é registrada no diário antes de a página de dados ser considerada durável. Em uma queda, o servidor reaplica o que falta. Entender esse fluxo explica por que disco de WAL, checkpoints e `fsync` são temas críticos de operação.

## Por que isso importa

Sem esse modelo, é fácil "resolver" lentidão aumentando conexões e memória até o servidor cair. O DBA dimensiona processos, cache e WAL de acordo com a carga real.

## Conceitos-chave

- **Backend:** processo que atende uma conexão.
- **Postmaster:** supervisiona o cluster.
- **shared_buffers:** cache compartilhado.
- **work_mem:** memória por operação.
- **WAL:** diário write-ahead.
- **Checkpoint:** ponto consolidado de recuperação.

## Erros comuns

Aumentar `work_mem` globalmente sem considerar concorrência. Confundir cache do sistema operacional com `shared_buffers`. Ignorar o custo de conexões ociosas. Desligar `fsync` em produção para ganhar desempenho e perder durabilidade.

## Checklist de domínio

- [ ] Sei explicar o modelo processo por conexão.
- [ ] Sei diferenciar memória compartilhada e por sessão.
- [ ] Sei citar a função de checkpointer, WAL writer e autovacuum.
- [ ] Sei justificar o uso de pooler.

## Resumo

Backends executam consultas; processos de fundo mantêm WAL, cache e limpeza. Memória compartilhada serve a todos; `work_mem` é por operação. Conexões custam processos, e o WAL garante durabilidade.
