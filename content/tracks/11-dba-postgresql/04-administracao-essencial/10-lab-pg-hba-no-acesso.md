---
slug: "lab-pg-hba-no-acesso"
title: "Lab: O acesso que não entra (pg_hba)"
kind: lab
difficulty: 3
est_minutes: 25
xp: 250
status: complete
prerequisites: ["autenticacao-pg-hba-e-ssl"]
lab_slug: "pg-hba-no-acesso"
exercises:
  - type: single_choice
    xp: 10
    question: "A aplicação recebe 'no pg_hba.conf entry'. Qual é a primeira coisa a verificar?"
    options:
      - "Se existe uma regra que cobre banco, usuário e origem da conexão"
      - "Se o disco está cheio"
      - "Se o autovacuum está rodando"
      - "Se o índice da tabela está válido"
    answerIndex: 0
    explanation: "A mensagem indica que nenhuma regra casou. Verifique tipo, banco, usuário, endereço e ordem no pg_hba.conf."
  - type: true_false
    xp: 10
    statement: "Depois de corrigir o pg_hba.conf, um reload é suficiente; não é necessário reiniciar o servidor."
    answer: true
    explanation: "As regras de autenticação são recarregadas por SIGHUP, normalmente via SELECT pg_reload_conf()."
  - type: match
    xp: 10
    question: "Relacione a mensagem ao diagnóstico provável."
    pairs:
      - ["no pg_hba.conf entry", "Nenhuma regra casou para origem, banco ou usuário"]
      - ["password authentication failed", "A regra casou, mas a senha ou o método está errado"]
      - ["too many connections", "Limite de conexões ou pool mal dimensionado"]
      - ["permission denied for schema public", "Falta USAGE no schema ou privilégio no objeto"]
    explanation: "Separe falha de autenticação, autorização e capacidade. Cada camada tem mensagem e correção diferentes."
---

# Lab: O acesso que não entra (pg_hba)

O terminal deste laboratório abre **dentro do container do banco**, como usuário `postgres`. A aplicação da Padaria Byte não consegue conectar, e o log alterna entre "no pg_hba.conf entry" e "password authentication failed". Sua missão é ler a evidência, corrigir a regra e provar que não deixou uma porta aberta.

Comece pelo log do servidor. Localize a tentativa de conexão e observe o usuário, o banco, o endereço de origem e o método. Depois, inspecione o `pg_hba.conf`. Lembre que a primeira regra que casa vence: uma regra `trust` ampla no topo pode mascarar qualquer restrição posterior. Use `SELECT * FROM pg_hba_file_rules;` para ver as regras carregadas e erros de sintaxe.

A correção deve permitir `app_rw` a partir da rede interna com `scram-sha-256`, sem abrir `0.0.0.0/0` para `trust`. Se a senha estiver errada, redefina-a com `ALTER ROLE app_rw PASSWORD '...'` e confirme que `password_encryption` está em `scram-sha-256`. Após editar, recarregue com `SELECT pg_reload_conf();` e teste a conexão com `psql`.

Por último, valide que nenhuma regra `trust` ampla permaneceu. O objetivo automático verifica o estado do servidor, não apenas o texto do arquivo. Uma correção que funciona, mas deixa uma brecha, não é uma correção completa.

## Por que isso importa

Diagnosticar autenticação é uma das tarefas mais frequentes no plantão. Separar regra ausente, senha errada e permissão negada evita mudanças às cegas e reduz o tempo de indisponibilidade.

## Conceitos-chave

- **pg_hba_file_rules:** visão das regras ativas.
- **Primeira regra que casa:** critério de decisão.
- **scram-sha-256:** método esperado.
- **pg_reload_conf():** aplica sem reiniciar.
- **Mínimo escopo:** banco, usuário e rede específicos.

## Erros comuns

Adicionar `trust` para "resolver rápido". Reiniciar em vez de recarregar. Corrigir a regra e esquecer a senha. Testar só localmente e não pela rede da aplicação.

## Checklist de domínio

- [ ] Sei localizar a evidência no log.
- [ ] Sei escrever uma regra específica e segura.
- [ ] Sei recarregar e testar a conexão.
- [ ] Sei confirmar que não há trust amplo.

## Resumo

O lab cobra diagnóstico, correção e prova. Leia o log, ajuste o escopo, use scram, recarregue e valide o estado final. O painel do lab mostra os objetivos verificados automaticamente.
