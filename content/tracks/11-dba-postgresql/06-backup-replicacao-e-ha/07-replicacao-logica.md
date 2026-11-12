---
slug: "replicacao-logica"
title: "Replicação lógica"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["replicacao-streaming"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual é uma vantagem da replicação lógica?"
    options:
      - "Replicar tabelas específicas e entre versões major diferentes"
      - "Copiar arquivos físicos do cluster"
      - "Eliminar a necessidade de WAL"
      - "Garantir que DDL seja replicado automaticamente"
    answerIndex: 0
    explanation: "A replicação lógica opera no nível de tabelas e mudanças de dados, permitindo seleção e migração entre versões."
  - type: true_false
    xp: 10
    statement: "Alterações de esquema (DDL) são replicadas automaticamente pela replicação lógica."
    answer: false
    explanation: "DDL precisa ser aplicado nos dois lados de forma coordenada. A replicação lógica cobre dados das tabelas publicadas."
  - type: match
    xp: 12
    question: "Relacione o conceito à função."
    pairs:
      - ["PUBLICATION", "Define o que será publicado"]
      - ["SUBSCRIPTION", "Consome uma publicação"]
      - ["wal_level = logical", "Habilita informação para decodificação lógica"]
      - ["REPLICA IDENTITY", "Define como identificar linhas para UPDATE e DELETE"]
    explanation: "Publicação e assinatura formam o contrato. A identidade de réplica é essencial para aplicar alterações corretamente."
---

# Replicação lógica

A replicação lógica envia **mudanças de dados** de tabelas selecionadas, em vez de copiar o cluster inteiro. O primário define uma `PUBLICATION`; o destino cria uma `SUBSCRIPTION` apontando para ela. O WAL precisa estar em `wal_level = logical`, e as tabelas precisam de uma `REPLICA IDENTITY` adequada para que UPDATE e DELETE sejam identificados.

A granularidade é a grande vantagem. Você pode replicar apenas tabelas de relatórios, integrar sistemas ou migrar para uma nova versão major com pouca indisponibilidade. Um cenário comum de upgrade é: criar o banco novo na versão alvo, copiar os dados iniciais, assinar as mudanças, acompanhar o atraso e trocar a aplicação no momento da virada.

As limitações exigem disciplina. DDL não é replicado automaticamente: crie colunas, índices e constraints nos dois lados. Sequências e large objects têm tratamento específico. Conflitos podem ocorrer se o destino receber escritas ou se a ordem não for preservada. Monitore o atraso e os erros da subscription.

Replicação lógica não substitui backup. Ela é uma ferramenta de integração e migração. Se uma tabela for truncada no primário, o truncate pode ser replicado. A recuperação continua dependendo de backup e WAL.

## Por que isso importa

A replicação lógica habilita migrações quase sem parada, relatórios isolados e integração entre sistemas. Saber suas limitações evita surpresas com DDL e conflitos.

## Conceitos-chave

- **Publication:** conjunto publicado.
- **Subscription:** consumidor.
- **wal_level logical:** pré-requisito.
- **REPLICA IDENTITY:** identificação de linhas.
- **DDL manual:** mudanças de esquema nos dois lados.
- **Atraso:** acompanhamento obrigatório.

## Erros comuns

Esquecer DDL no destino. Usar tabela sem chave. Ignorar conflitos. Assumir que sequências são replicadas. Achar que substitui backup.

## Checklist de domínio

- [ ] Sei criar publicação e assinatura.
- [ ] Sei explicar a granularidade.
- [ ] Sei citar limitações de DDL.
- [ ] Sei planejar um upgrade lógico.

## Resumo

Replicação lógica replica dados por tabela e atravessa versões. Publicação e assinatura definem o fluxo; DDL e conflitos exigem cuidado. Backup continua necessário.
