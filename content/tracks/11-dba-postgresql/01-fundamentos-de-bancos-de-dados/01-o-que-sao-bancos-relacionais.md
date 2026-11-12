---
slug: "o-que-sao-bancos-relacionais"
title: "O que são bancos de dados relacionais"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: match
    xp: 10
    question: "Relacione cada termo à sua definição."
    pairs:
      - ["Tabela", "Conjunto nomeado de linhas e colunas que representa um tipo de entidade"]
      - ["Linha", "Um registro individual, como um cliente ou um pedido"]
      - ["Coluna", "Um atributo com nome e tipo, como preco ou cidade"]
      - ["Chave primária", "Coluna ou combinação que identifica cada linha sem ambiguidade"]
      - ["SGBD", "Software que armazena, protege e consulta os dados"]
    explanation: "A tabela organiza registros; a linha é um registro; a coluna define um atributo; a chave primária identifica a linha; o SGBD gerencia todo o conjunto."
  - type: single_choice
    xp: 10
    question: "O que é o SGBD?"
    options:
      - "O software que gerencia armazenamento, acesso e integridade dos dados"
      - "Um arquivo de planilha compartilhado na rede"
      - "A pessoa responsável por digitar os dados"
      - "Um tipo de cabo usado para conectar servidores"
    answerIndex: 0
    explanation: "O Sistema Gerenciador de Banco de Dados é o programa que controla o banco: recebe consultas, aplica regras, coordena concorrência e protege os dados."
  - type: true_false
    xp: 10
    statement: "Um banco relacional é a mesma coisa que uma planilha com várias abas."
    answer: false
    explanation: "A planilha é uma ferramenta de edição livre. O banco relacional impõe tipos, chaves, restrições e transações, além de controlar acesso concorrente."
---

# O que são bancos de dados relacionais

A Padaria Byte começou com uma planilha: clientes numa aba, pedidos em outra. Enquanto havia uma única pessoa e poucos pedidos, tudo funcionava. Quando a equipe cresceu, dois funcionários passaram a editar o mesmo arquivo ao mesmo tempo, o mesmo cliente apareceu escrito de três formas e uma linha foi apagada sem querer. A planilha não tinha como impedir esses problemas. O banco relacional existe para resolver exatamente essa classe de falha.

Um **banco de dados** é uma coleção organizada de dados. Um **banco relacional** organiza esses dados em **tabelas**: estruturas com linhas e colunas. Cada tabela representa um tipo de entidade — clientes, produtos, pedidos —, cada **linha** representa um registro individual e cada **coluna** define um atributo com nome e tipo. O conjunto de tabelas, tipos e regras forma o **esquema**.

O que torna o modelo relacional especial não é apenas guardar tabelas. É a capacidade de **ligar** tabelas por chaves. A chave primária identifica uma linha de forma única; a chave estrangeira aponta para uma linha de outra tabela. Em vez de repetir o nome e o endereço do cliente em cada pedido, guardamos o `cliente_id`. Se o endereço mudar, atualizamos um único lugar. Essa ligação é o que permite consultas flexíveis e reduz inconsistências.

O **SGBD** é o software que fica entre a aplicação e os arquivos. O PostgreSQL recebe comandos SQL, decide como executá-los, controla quem pode ler ou alterar cada objeto, coordena transações simultâneas e recupera o banco após uma queda. A aplicação não abre o arquivo diretamente: ela conversa com o SGBD, que aplica as regras. Essa separação é uma camada de segurança e de organização.

## Por que isso importa

Bancos relacionais brilham quando os dados têm relações claras e a correção importa. Pedidos precisam apontar para clientes existentes; um pagamento não pode ser registrado pela metade; o estoque não pode ficar negativo por causa de duas vendas simultâneas. O banco impõe essas regras no nível dos dados, e não apenas na interface. Isso significa que um script, uma integração ou uma correção manual também passam pelas mesmas garantias.

Também existem limitações. O esquema rígido exige planejamento e migrações quando o modelo muda. A escala costuma ser vertical antes de exigir estratégias mais complexas. Consultas muito grandes e joins mal planejados podem ficar lentos. Nenhuma tecnologia elimina a necessidade de entender o domínio.

## Conceitos-chave

- **Tabela:** conjunto nomeado de linhas e colunas.
- **Linha:** um registro, como o pedido 42.
- **Coluna:** atributo tipado, como `preco numeric(10,2)`.
- **Chave primária:** identifica cada linha sem ambiguidade.
- **Chave estrangeira:** cria uma relação válida entre tabelas.
- **Esquema:** definição de tabelas, colunas, tipos e restrições.
- **SGBD:** software que gerencia o banco e seu acesso.

## Erros comuns

O erro mais frequente de quem vem de planilhas é tratar cada necessidade como uma nova coluna. Isso espalha dados repetidos e cria inconsistência. Outro erro é acreditar que uma chave primária pode ser trocada a qualquer momento; ela é referência para outras tabelas. Por fim, não confunda banco de dados com a ferramenta de consulta: `psql`, DBeaver e a API da aplicação são clientes; o PostgreSQL é o SGBD.

## Checklist de domínio

- [ ] Consigo diferenciar dado, tabela, esquema e SGBD.
- [ ] Consigo explicar por que uma chave primária é necessária.
- [ ] Consigo dar um exemplo de relação entre duas tabelas.
- [ ] Consigo apontar um problema de planilha que um banco relacional evita.

## Resumo

Um banco relacional organiza dados em tabelas ligadas por chaves e impõe regras de integridade. O SGBD gerencia armazenamento, concorrência, segurança e recuperação. A Padaria Byte precisa dessa estrutura porque o volume cresceu, várias pessoas escrevem ao mesmo tempo e erros de dados passaram a custar dinheiro.
