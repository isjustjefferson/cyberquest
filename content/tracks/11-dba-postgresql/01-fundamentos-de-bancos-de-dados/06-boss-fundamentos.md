---
slug: "boss-fundamentos-bd"
title: "Boss: Fundamentos"
kind: boss
difficulty: 1
est_minutes: 8
xp: 100
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "A Padaria Byte precisa garantir que um pedido nunca aponte para um cliente inexistente. Qual recurso do banco ajuda diretamente?"
    options:
      - "Chave estrangeira"
      - "Índice de texto completo"
      - "Materialized view"
      - "Extensão de grafos"
    answerIndex: 0
    explanation: "A chave estrangeira impede que pedidos referenciem clientes ausentes. Ela é uma restrição de integridade referencial."
  - type: single_choice
    xp: 10
    question: "O que melhor descreve atomicidade?"
    options:
      - "A transação inteira é confirmada ou desfeita"
      - "Cada comando é confirmado separadamente"
      - "Leituras nunca veem dados antigos"
      - "O banco fica disponível mesmo sem disco"
    answerIndex: 0
    explanation: "Atomicidade trata a transação como unidade indivisível. Se uma operação falha, as anteriores são desfeitas."
  - type: true_false
    xp: 10
    statement: "No PostgreSQL, um cluster é necessariamente composto por várias máquinas."
    answer: false
    explanation: "Cluster, no vocabulário do PostgreSQL, é uma instância com seu diretório de dados e vários bancos, normalmente em uma única máquina."
  - type: multi_choice
    xp: 10
    question: "Quais afirmações sobre bancos relacionais são verdadeiras?"
    options:
      - "Permitem consultas flexíveis sobre dados relacionados"
      - "Aplicam restrições de integridade declaradas"
      - "Eliminam a necessidade de modelagem"
      - "Podem sofrer com joins e consultas mal planejadas"
    answerIndexes: [0, 1, 3]
    explanation: "Relações flexíveis, restrições e necessidade de bom planejamento fazem parte do modelo. Modelagem continua essencial."
  - type: order
    xp: 10
    question: "Ordene o ciclo de uma alteração segura."
    items:
      - "Inspecionar o estado atual"
      - "Executar a alteração em transação"
      - "Verificar o resultado"
      - "Confirmar ou desfazer"
    correctOrder: [0, 1, 2, 3]
    explanation: "O ciclo inspecionar, agir, verificar e confirmar reduz erros e torna o efeito explícito."
  - type: match
    xp: 10
    question: "Relacione o comando do psql ao efeito."
    pairs:
      - ["\\l", "Lista bancos"]
      - ["\\dt", "Lista tabelas"]
      - ["\\d clientes", "Descreve a tabela clientes"]
      - ["\\c padaria_dev", "Troca para o banco padaria_dev"]
    explanation: "Meta-comandos do psql começam com barra invertida e operam no cliente, não no servidor."
---

# Boss: Fundamentos

Este boss reúne os conceitos do primeiro módulo. A Padaria Byte está saindo da planilha e precisa de uma base confiável. Você deve demonstrar que entende por que o banco relacional existe, como as transações protegem operações compostas, qual é o vocabulário do PostgreSQL e como navegar pelo `psql` sem destruir nada.

A primeira decisão é sobre **integridade**. Em uma planilha, nada impede que uma linha de pedido aponte para um cliente que foi apagado. No banco relacional, a chave estrangeira transforma essa regra em uma restrição. A aplicação pode até esquecer de validar, mas o banco não. Essa diferença é central: regras de integridade não devem depender de cada tela ou script lembrar delas.

A segunda decisão é sobre **unidades de trabalho**. Um pedido envolve inserir o cabeçalho, inserir itens e baixar estoque. Se o processo falhar no meio, o banco não pode deixar um pedido sem itens ou estoque baixado sem venda. A transação e o ACID fornecem essa garantia. O `COMMIT` confirma; o `ROLLBACK` desfaz. O WAL protege a durabilidade após a confirmação.

O vocabulário importa para não criar confusões operacionais. **Cluster** é a instância, não um conjunto de servidores. **SGBD** é o software. **Esquema** é a definição de objetos. **Cluster de máquinas** é outra coisa, resolvida por replicação, failover ou orquestração. Um DBA precisa usar os termos com precisão para comunicar risco e arquitetura.

Por fim, o `psql` é a ferramenta de inspeção. Antes de criar, alterar ou remover, o profissional olha o estado atual: quais bancos existem, em qual está conectado, quais tabelas e restrições estão presentes. O ciclo inspecionar, agir, verificar e confirmar evita a maior parte dos acidentes. O boss testa esse raciocínio em cenários curtos, como em uma entrevista técnica ou em um plantão.

## Estratégia para o boss

Leia cada pergunta pensando no risco operacional. Se a alternativa promete “sempre mais rápido”, desconfie. Se ignora transações, modelagem ou restrições, provavelmente está errada. Em comandos do `psql`, lembre que a barra invertida indica meta-comando do cliente. Em ACID, diferencie o escopo de cada letra: atomicidade não é durabilidade, e consistência não substitui validação de negócio.

## Checklist de domínio

- [ ] Consigo justificar o uso de chave estrangeira.
- [ ] Consigo explicar atomicidade com um exemplo.
- [ ] Consigo usar o vocabulário de cluster e esquema corretamente.
- [ ] Consigo inspecionar um banco no `psql` antes de alterar.

## Resumo

O boss consolida a fundação: dados relacionados pedem integridade, operações compostas pedem transações e o trabalho diário pede inspeção. Quem domina esses pontos está pronto para escrever SQL com menos risco e para entender o restante da trilha DBA.
