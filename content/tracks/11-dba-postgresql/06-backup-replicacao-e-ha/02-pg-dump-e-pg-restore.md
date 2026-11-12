---
slug: "pg-dump-e-pg-restore"
title: "pg_dump e pg_restore"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["estrategias-de-backup"]
lab_slug: "backup-e-restore"
exercises:
  - type: fill_command
    xp: 10
    question: "Complete o comando de backup lógico no formato custom."
    template: "pg_dump -___ -f padaria.dump padaria"
    blanks: ["Fc"]
    accepted: [["Fc"], ["fc"], ["-format=custom"], ["F", "c"]]
    explanation: "O formato custom é comprimido e permite restaurar partes com pg_restore -l e -L."
  - type: single_choice
    xp: 10
    question: "O que pg_dump de um banco NÃO inclui?"
    options:
      - "Tabelas do schema public"
      - "Roles do cluster"
      - "Sequências"
      - "Funções do banco"
    answerIndex: 1
    explanation: "Roles e tablespaces são objetos do cluster. Use pg_dumpall --globals-only para exportar papéis."
  - type: order
    xp: 12
    question: "Ordene uma restauração lógica segura em outro ambiente."
    items:
      - "Conferir contagens e validar a aplicação"
      - "Criar um banco vazio"
      - "Restaurar com pg_restore"
      - "Garantir roles e extensões necessárias"
    correctOrder: [3, 1, 2, 0]
    explanation: "Dependências do cluster vêm antes; depois o banco vazio, o restore e a validação. Liberar sem conferir é arriscado."
---

# pg_dump e pg_restore

`pg_dump` exporta um banco de forma consistente enquanto ele continua em uso. Ele abre uma transação repetível e lê um snapshot, evitando uma cópia "quebrada" entre tabelas. O formato `plain` gera SQL; `custom` (`-Fc`) é comprimido e flexível; `directory` (`-Fd`) permite paralelismo com `-j`; `tar` é menos usado hoje. O formato custom é o ponto de partida mais comum.

`pg_restore` lê formatos não textuais. `-l` lista o conteúdo, `-L` restaura apenas os itens selecionados, `-d` define o banco de destino, `-j` paraleliza e `--clean --if-exists` remove objetos antes de recriar. Para um banco inteiro, `--clean` pode ser perigoso; em uma restauração parcial, a seleção por lista é uma ferramenta poderosa.

O dump de um banco não inclui roles, tablespaces nem todos os objetos globais. Em outro cluster, crie os papéis e extensões antes. `pg_dumpall --globals-only` exporta roles e configurações globais. Também é possível usar `-s` para somente esquema e `-a` para somente dados.

Restaurar não é o fim. Verifique contagens, relacionamentos, sequências, permissões e o comportamento da aplicação. Meça o tempo total. Um restore que "terminou sem erro" mas deixou sequências atrasadas gera falhas futuras de chave duplicada.

## Por que isso importa

Backup lógico é a ferramenta mais portátil do DBA. Saber selecionar partes evita restaurar um banco inteiro para recuperar uma tabela.

## Conceitos-chave

- **Snapshot consistente:** leitura coerente durante o dump.
- **Formato custom:** comprimido e selecionável.
- **pg_restore -l/-L:** lista e seleção de objetos.
- **pg_dumpall:** objetos globais.
- **-s e -a:** esquema e dados separados.

## Erros comuns

Esquecer roles no destino. Restaurar por cima sem limpar. Ignorar sequências. Não validar o resultado. Guardar dump sem cifra.

## Checklist de domínio

- [ ] Sei criar dump custom.
- [ ] Sei listar e restaurar itens específicos.
- [ ] Sei exportar roles globais.
- [ ] Sei validar uma restauração.

## Resumo

pg_dump tira uma foto consistente de um banco. pg_restore permite selecionar e paralelizar. Dependências globais e validação fazem parte do procedimento.
