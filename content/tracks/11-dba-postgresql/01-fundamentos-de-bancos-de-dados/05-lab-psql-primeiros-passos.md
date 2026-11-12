---
slug: "lab-psql-primeiros-passos"
title: "Lab: Primeiros passos com psql"
kind: lab
difficulty: 1
est_minutes: 20
xp: 200
status: complete
prerequisites: []
lab_slug: "psql-primeiros-passos"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual meta-comando do psql lista os bancos disponíveis na instância?"
    options:
      - "\\l"
      - "\\dt"
      - "\\du"
      - "SELECT databases();"
    answerIndex: 0
    explanation: "\\l lista bancos. \\dt lista tabelas do banco atual, \\du lista roles e \\? mostra a ajuda dos meta-comandos."
  - type: fill_command
    xp: 10
    question: "Complete o comando para conectar ao banco padaria_dev dentro do psql."
    template: "\\c ___"
    blanks: ["padaria_dev"]
    accepted: [["padaria_dev"]]
    explanation: "\\c nome_do_banco troca a conexão atual. No psql, comandos que começam com barra invertida são meta-comandos do cliente, não SQL."
  - type: true_false
    xp: 10
    statement: "Para descobrir a versão do servidor PostgreSQL, posso executar SELECT version(); dentro do psql."
    answer: true
    explanation: "SELECT version() é SQL e retorna a versão do servidor. Meta-comandos como \\conninfo também mostram dados da conexão."
---

# Lab: Primeiros passos com psql

O `psql` é o cliente de linha de comando oficial do PostgreSQL. Ele permite conectar, executar SQL, inspecionar objetos e automatizar tarefas. Neste laboratório da Padaria Byte, você recebe um terminal conectado ao servidor `db` e precisa explorar o ambiente, descobrir onde estão os dados e criar um banco de desenvolvimento. O laboratório real será habilitado junto com a imagem de workstation na fase de labs; esta lição prepara os comandos e o raciocínio.

A primeira distinção importante é entre **SQL** e **meta-comandos**. Tudo que começa com barra invertida é interpretado pelo próprio `psql`, não pelo servidor. `\l` lista bancos, `\c nome` troca a conexão, `\dt` lista tabelas do banco atual, `\d tabela` descreve colunas, índices e restrições, `\du` lista roles, `\?` mostra ajuda e `\q` encerra. Já `SELECT version();` é uma consulta SQL enviada ao servidor.

O roteiro começa pela descoberta. Liste os bancos e identifique qual contém a tabela `clientes`. Conecte-se a ele com `\c`. Rode `\dt` para ver as tabelas e `\d clientes` para inspecionar a estrutura. Observe os tipos, as restrições e a chave primária. Essa exploração é o que um DBA faz antes de qualquer alteração: entender o estado atual em vez de supor.

Depois, crie um banco de desenvolvimento com `CREATE DATABASE padaria_dev;`. O comando precisa ser executado fora de uma transação e exige privilégio adequado. Confirme com `\l` ou consultando `pg_database`. Em seguida, conecte-se ao novo banco e crie uma tabela pequena para praticar. O objetivo não é decorar comandos, mas construir um ciclo: inspecionar, agir, verificar.

Por fim, descubra a versão major do servidor. `SELECT version();` retorna uma string longa; `SHOW server_version;` mostra a versão de forma mais direta. Saber a versão importa porque recursos, extensões e sintaxe variam. Um DBA nunca assume que produção está na mesma versão do tutorial.

## Por que isso importa

O terminal é o último recurso quando a interface gráfica falha e o primeiro quando é preciso automatizar. `psql` funciona em servidores remotos, containers e pipelines. Saber navegar por bancos e tabelas sem depender de uma GUI reduz o tempo de diagnóstico. Também evita o hábito perigoso de rodar comandos destrutivos sem olhar o contexto.

## Conceitos-chave

- **Conexão:** host, porta, banco, usuário e autenticação.
- **Meta-comando:** instrução do cliente `psql`, iniciada por `\`.
- **`\l`, `\c`, `\dt`, `\d`, `\du`:** inspeção de bancos, conexão, tabelas, estrutura e roles.
- **`CREATE DATABASE`:** cria um banco dentro do cluster.
- **`SELECT version()`:** consulta a versão do servidor.
- **`\q`:** encerra a sessão.

## Erros comuns

Executar `\dt` no banco errado e concluir que a tabela não existe é comum. Outro erro é tentar rodar meta-comandos dentro de uma transação ou de um script SQL enviado por driver: eles só existem no `psql`. Também é frequente criar objetos no banco `postgres` por engano. Por fim, não use conta superusuário para tarefas rotineiras; crie roles específicas.

## Checklist de domínio

- [ ] Consigo listar bancos e tabelas sem consultar um guia.
- [ ] Consigo descrever uma tabela e identificar sua chave primária.
- [ ] Consigo criar um banco e confirmar sua existência.
- [ ] Consigo descobrir a versão do servidor.
- [ ] Consigo explicar a diferença entre SQL e meta-comando.

## Resumo

`psql` é a interface direta com o PostgreSQL. Meta-comandos inspecionam o ambiente; SQL altera e consulta dados. O ciclo profissional é sempre inspecionar, agir e verificar. O laboratório completo adicionará verificação automática dos objetivos em um container descartável.
