---
slug: "autenticacao-pg-hba-e-ssl"
title: "Autenticação: pg_hba.conf e SSL/TLS"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["roles-e-privilegios"]
lab_slug: "pg-hba-no-acesso"
exercises:
  - type: order
    xp: 14
    question: "Ordene as regras para que a aplicação use scram e o acesso administrativo local continue funcionando, sem trust aberto."
    items:
      - "host padaria app_rw 10.10.0.0/24 scram-sha-256"
      - "local all postgres peer"
      - "host all all 0.0.0.0/0 scram-sha-256"
      - "host all all 0.0.0.0/0 reject"
    correctOrder: [0, 1, 2, 3]
    explanation: "A primeira regra que casa vence. A regra específica da aplicação vem antes das regras gerais; o reject final fecha o que não foi previsto."
  - type: single_choice
    xp: 10
    question: "Qual método de senha é recomendado hoje para conexões TCP?"
    options:
      - "trust"
      - "md5"
      - "scram-sha-256"
      - "password em texto puro"
    answerIndex: 2
    explanation: "scram-sha-256 não envia a senha em claro e resiste melhor a ataques offline. md5 é legado; trust não autentica."
  - type: code_review
    xp: 12
    question: "Marque a linha que abre o banco para qualquer origem sem autenticação."
    code: |
      local   all   postgres   peer
      host    padaria app_rw 10.10.0.0/24 scram-sha-256
      host    all   all   0.0.0.0/0   trust
      host    all   all   0.0.0.0/0   reject
    vulnerableLines: [3]
    explanation: "host all all 0.0.0.0/0 trust aceita qualquer usuário, de qualquer origem, sem senha. É uma exposição grave em rede."
---

# Autenticação: pg_hba.conf e SSL/TLS

Duas decisões controlam a entrada: em quais interfaces o servidor escuta (`listen_addresses`) e quais regras de autenticação aceitam a conexão (`pg_hba.conf`). Uma regra tem tipo (`local`, `host`, `hostssl`, `hostnossl`), banco, usuário, endereço de origem e método. As regras são lidas de cima para baixo e a **primeira que casa vence**. Por isso, ordem é parte da política de segurança.

Métodos comuns incluem `trust` (aceita sem senha, só para ambiente isolado), `peer` (usa o usuário do sistema operacional), `scram-sha-256` (recomendado para senha), `md5` (legado) e `cert` (autenticação por certificado). `password_encryption` deve ser `scram-sha-256` para que novas senhas sejam armazenadas no formato correto.

Depois de editar, `SELECT pg_reload_conf();` aplica a configuração sem reiniciar. A visão `pg_hba_file_rules` lista as regras carregadas e aponta erros de sintaxe. Um erro de sintaxe pode deixar o servidor sem aceitar conexões; valide antes de recarregar em produção.

TLS protege dados em trânsito. Com `ssl = on` e certificados configurados, clientes podem usar `sslmode=require` para exigir criptografia ou `verify-full` para validar certificado e nome do servidor. TLS não substitui autenticação forte: ele protege o canal, enquanto o `pg_hba.conf` decide quem entra e como.

## Por que isso importa

A maioria dos incidentes de acesso começa com uma regra ampla demais. Entender ordem, método e escopo permite fechar o banco sem quebrar a aplicação legítima.

## Conceitos-chave

- **pg_hba.conf:** regras de autenticação por origem.
- **Primeira regra que casa:** define o resultado.
- **scram-sha-256:** método de senha moderno.
- **pg_hba_file_rules:** inspeção e validação das regras.
- **sslmode:** controle de TLS no cliente.

## Erros comuns

Deixar `host all all 0.0.0.0/0 trust`. Colocar uma regra ampla antes da específica. Editar o arquivo e esquecer o reload. Confundir TLS com autorização.

## Checklist de domínio

- [ ] Sei escrever uma regra específica por banco, usuário e rede.
- [ ] Sei explicar a ordem das regras.
- [ ] Sei validar o arquivo antes de recarregar.
- [ ] Sei diferenciar require de verify-full.

## Resumo

`listen_addresses` define onde escutar; `pg_hba.conf` define quem entra e como. A primeira regra vence. Use scram, restrinja redes e proteja o canal com TLS.
