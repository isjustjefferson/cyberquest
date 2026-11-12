---
slug: "estrutura-de-diretorios-e-catalogos"
title: "Estrutura de diretórios e catálogos"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["instalacao-e-docker"]
lab_slug: null
exercises:
  - type: sql_query
    xp: 14
    dataset: padaria_byte
    setup: ""
    prompt: "Liste as 5 maiores tabelas do schema public com o nome e o tamanho total legível, da maior para a menor."
    starter: "SELECT c.relname AS tabela, pg_size_pretty(pg_total_relation_size(c.oid)) AS tamanho\nFROM pg_class c\nJOIN pg_namespace n ON ;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT c.relname AS tabela, pg_size_pretty(pg_total_relation_size(c.oid)) AS tamanho
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind = 'r'
        ORDER BY pg_total_relation_size(c.oid) DESC
        LIMIT 5;
      ordered: true
      compare_column_names: true
    hints:
      - text: "Filtre c.relkind = 'r' para incluir apenas tabelas comuns."
        cost_bits: 5
      - text: "Ordene pela mesma expressão de tamanho usada no SELECT."
        cost_bits: 8
    explanation: "pg_class descreve relações; pg_namespace separa schemas. pg_total_relation_size soma tabela, índices e TOAST."
  - type: single_choice
    xp: 10
    question: "O que fica em pg_wal/?"
    options:
      - "Os arquivos de configuração do cluster"
      - "O diário de transações (WAL)"
      - "Os bancos de dados do usuário"
      - "Os logs de auditoria do sistema operacional"
    answerIndex: 1
    explanation: "pg_wal guarda segmentos do Write-Ahead Log. pg_xact guarda o estado das transações; base/ contém os bancos."
  - type: true_false
    xp: 8
    statement: "Remover arquivos antigos de pg_wal/ manualmente é uma forma segura de liberar espaço."
    answer: false
    explanation: "Apagar WAL manualmente pode impedir a recuperação e causar corrupção. Use arquivamento, checkpoints e remoção correta de slots."
---

# Estrutura de diretórios e catálogos

Todo cluster vive em um diretório apontado por `PGDATA`. Na raiz ficam `postgresql.conf`, `pg_hba.conf`, `postgresql.auto.conf`, o `postmaster.pid` e subdiretórios essenciais. `base/` guarda um diretório por banco, identificado por OID. `global/` contém objetos compartilhados do cluster, como roles. `pg_wal/` guarda o diário de transações, `pg_xact/` o estado de commit e `pg_multixact/` informações de transações distribuídas.

O banco descreve a si mesmo em tabelas de catálogo. `pg_class` lista tabelas, índices, views e sequências. `pg_attribute` descreve colunas. `pg_database` lista bancos e `pg_roles` lista papéis. `information_schema` oferece uma visão padronizada, útil para portabilidade, mas menos específica que os catálogos nativos. Funções como `pg_relation_filepath`, `pg_total_relation_size` e `pg_size_pretty` conectam o mundo SQL aos arquivos e ao espaço em disco.

Esses catálogos são a base de diagnósticos. Para saber o tamanho de uma tabela, você não precisa entrar no sistema de arquivos: consulte `pg_total_relation_size`. Para descobrir quem pode ler uma tabela, consulte privilégios em `information_schema.role_table_grants` ou funções nativas. Consultas de inventário devem virar rotina.

A regra de ouro é: **nunca edite arquivos de dados à mão**. Mexer em `PGDATA` com o servidor parado, especialmente em `pg_wal`, `pg_xact` ou nos arquivos de relação, corrompe o banco de forma difícil de reverter. Operações devem passar por SQL, ferramentas oficiais e procedimentos documentados.

## Por que isso importa

Saber onde as coisas ficam explica backup físico, recuperação e limites de disco. Saber consultar catálogos permite inventário, auditoria e diagnóstico sem depender de interface gráfica.

## Conceitos-chave

- **PGDATA:** raiz do cluster.
- **base/ e global/:** bancos e objetos compartilhados.
- **pg_wal/:** diário de transações.
- **Catálogos:** tabelas que descrevem o próprio banco.
- **OID:** identificador interno de objetos.
- **pg_size_pretty:** formata bytes em unidade legível.

## Erros comuns

Apagar WAL para liberar disco. Procurar dados de usuário diretamente em `base/` e tentar interpretá-los. Ignorar tablespaces ao calcular espaço. Alterar arquivos com o postmaster em execução.

## Checklist de domínio

- [ ] Sei listar os principais diretórios do cluster.
- [ ] Sei consultar tamanho de tabelas e índices.
- [ ] Sei diferenciar catálogo nativo e information_schema.
- [ ] Sei explicar por que não se mexe em pg_wal manualmente.

## Resumo

`PGDATA` organiza dados, WAL e configuração. Catálogos descrevem objetos e alimentam diagnósticos. Arquivos internos são território de ferramentas oficiais, nunca de edição manual.
