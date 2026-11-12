---
slug: "migracoes-de-esquema"
title: "Migrações de esquema"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: order
    xp: 12
    question: "Coloque os passos de uma migração segura para adicionar uma coluna obrigatória em uma tabela grande."
    items:
      - "Definir NOT NULL após preencher todas as linhas"
      - "Adicionar a coluna sem NOT NULL"
      - "Preencher a coluna em lotes"
      - "Atualizar a aplicação para gravar a nova coluna"
    correctOrder: [1, 2, 3, 0]
    explanation: "Expandir (coluna nullable), preencher em lotes e só depois impor a regra evita travar a tabela e quebrar versões antigas da aplicação."
  - type: single_choice
    xp: 8
    question: "Qual comando cria um índice sem bloquear escritas na tabela?"
    options:
      - "CREATE INDEX CONCURRENTLY"
      - "CREATE INDEX LOCK TABLE"
      - "CREATE UNIQUE INDEX NOLOCK"
      - "ALTER INDEX ONLINE"
    answerIndex: 0
    explanation: "CONCURRENTLY constrói o índice em segundo plano, sem a trava que bloqueia escritas. Não pode rodar dentro de uma transação."
  - type: match
    xp: 8
    question: "Relacione a operação ao risco principal."
    pairs:
      - ["ALTER TABLE com trava exclusiva em tabela grande", "Bloqueia todas as consultas durante a operação"]
      - ["Preencher milhões de linhas em um único UPDATE", "Transação longa e alto uso de recursos"]
      - ["Remover coluna ainda usada pela aplicação antiga", "Quebra de consultas de versões em produção"]
    explanation: "Cada operação tem um efeito colateral. Uma migração segura divide o trabalho e considera as versões em convivência."
---

# Migrações de esquema

O banco de uma aplicação em produção muda ao longo do tempo: novas colunas, novos índices, novas regras. Cada mudança precisa ser versionada, aplicada de forma repetível e, idealmente, reversível. **Migrações** são arquivos numerados com as alterações, aplicadas em ordem. Ferramentas como Flyway, Liquibase, Sqitch e os sistemas de migração de frameworks registram quais migrações já rodaram e aplicam apenas as pendentes.

O desafio real não é escrever o `ALTER TABLE`, é fazê-lo sem derrubar o sistema. Algumas operações pedem trava exclusiva na tabela e bloqueiam todas as consultas enquanto rodam. Em uma tabela pequena, isso dura milissegundos. Em uma tabela de milhões de linhas, pode parar a aplicação por minutos. Por isso é importante conhecer o efeito de cada comando e usar `lock_timeout` para que a migração desista em vez de travar tudo.

A técnica clássica é **expandir, migrar, contrair**. Primeiro, adicione a coluna sem `NOT NULL`, o que costuma ser rápido. Depois, preencha os valores em lotes para não criar uma transação gigantesca. Em seguida, atualize a aplicação para gravar na nova coluna e só então imponha `NOT NULL`, validando as constraints. Por fim, remova o que ficou obsoleto, quando nenhuma versão em produção ainda usa.

Índices em tabelas vivas devem usar `CREATE INDEX CONCURRENTLY`. Ele constrói o índice sem bloquear escritas, ao custo de demorar mais e de não poder rodar dentro de uma transação. Da mesma forma, adicionar constraints com `NOT VALID` e validar depois reduz o tempo de trava.

Migrações devem ser idempotentes quando possível e sempre pensadas para convivência: durante uma implantação, versões antiga e nova da aplicação podem usar o banco ao mesmo tempo. Remover uma coluna que a versão antiga ainda lê quebra o sistema naquele intervalo. Uma regra prática é nunca fazer mudanças incompatíveis no mesmo deploy em que a aplicação muda.

## Por que isso importa

Uma migração mal planejada é uma das causas mais comuns de indisponibilidade em banco de dados. O DBA é responsável por revisar o impacto de cada mudança antes de ela chegar à produção. Migrações seguras permitem evoluir o sistema sem janelas de manutenção e sem apostas.

## Conceitos-chave

- **Migração versionada:** arquivo numerado aplicado em ordem.
- **Expandir, migrar, contrair:** padrão de mudança segura.
- **Trava exclusiva:** bloqueia leituras e escritas.
- **lock_timeout:** limite de espera por trava.
- **CREATE INDEX CONCURRENTLY:** índice sem bloquear escritas.
- **Compatibilidade entre versões:** antiga e nova convivem durante o deploy.

## Erros comuns

Adicionar `NOT NULL` com default em tabela grande sem planejamento é um erro clássico. Outro é preencher milhões de linhas em uma única transação. Também é frequente criar índice sem `CONCURRENTLY` em produção. Por fim, remover colunas no mesmo deploy em que a aplicação deixa de usá-las.

## Checklist de domínio

- [ ] Consigo versionar uma mudança de esquema.
- [ ] Consigo ordenar a estratégia expandir, migrar, contrair.
- [ ] Consigo explicar quando usar CREATE INDEX CONCURRENTLY.
- [ ] Consigo identificar operações com trava pesada.

## Resumo

Migrações versionam o esquema. A mudança segura divide o trabalho em etapas compatíveis, usa lotes, controla travas e considera as versões em convivência. Mudar o banco sem parar o sistema exige planejamento, não sorte.
