---
slug: "seguranca-e-hardening-de-banco"
title: "Segurança e hardening de banco"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: draft
prerequisites: ["logs-e-auditoria"]
lab_slug: null
exercises:
  - type: multi_choice
    xp: 14
    question: "Quais itens pertencem a um checklist de hardening?"
    options:
      - "Não expor a porta 5432 à internet"
      - "Usar scram-sha-256 e TLS"
      - "Aplicar menor privilégio"
      - "Desativar todos os backups para reduzir custo"
      - "Cifrar backups"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Rede fechada, autenticação forte, privilégio mínimo e backup cifrado são camadas de defesa. Remover backup aumenta o risco."
  - type: single_choice
    xp: 12
    question: "Como o DBA limita o impacto de uma SQL injection na aplicação?"
    options:
      - "Usando um papel com privilégios mínimos para a aplicação"
      - "Concedendo superusuário à aplicação"
      - "Desabilitando logs"
      - "Permitindo conexões anônimas"
    answerIndex: 0
    explanation: "Defesa em profundidade: mesmo que a aplicação seja explorada, o papel restrito limita o alcance."
  - type: true_false
    xp: 8
    statement: "listen_addresses e firewall são camadas complementares de proteção de rede."
    answer: true
    explanation: "O PostgreSQL pode escutar apenas interfaces necessárias, e o firewall restringe origens. Juntos reduzem exposição."
---

# Segurança e hardening de banco

Hardening é defesa em camadas. Na rede: não expor 5432 à internet, usar firewall e limitar `listen_addresses`. Na autenticação: `scram-sha-256`, TLS e regras específicas no `pg_hba.conf`. Nos privilégios: papéis mínimos, RLS, remoção de contas e bancos de exemplo.

Proteja dados sensíveis com criptografia em repouso e backups cifrados. Mantenha atualizações em dia, audite acessos e guarde segredos fora do código. Consultas parametrizadas na aplicação previnem SQL injection; no banco, o papel restrito limita o estrago se algo passar.

Use benchmarks como CIS PostgreSQL como referência, adaptando ao contexto. Revise permissões públicas, funções SECURITY DEFINER e extensões instaladas. Segurança é processo contínuo, não checklist único.

Separe papéis de aplicação, migração e administração. A aplicação não precisa ser dona das tabelas nem poder criar extensões. Revise periodicamente usuários sem uso, senhas e regras de acesso; quando possível, restrinja origens por rede e banco. Criptografia em repouso protege discos e snapshots, mas o controle de acesso e a gestão das chaves continuam essenciais. Registre decisões e exceções para que o hardening não vire uma lista impossível de manter.

## Por que isso importa

Um banco exposto ou com privilégios excessivos transforma uma falha de aplicação em vazamento total. Camadas reduzem impacto.

## Conceitos-chave

- **rede e firewall**
- **scram-sha-256**
- **TLS**
- **menor privilégio**
- **RLS**
- **backup cifrado**
- **defesa em profundidade**

## Erros comuns

Expor a porta. Usar trust. Dar superusuário à aplicação. Esquecer backup cifrado. Não revisar permissões públicas.

## Checklist de domínio

- [ ] Sei aplicar camadas de rede e autenticação.
- [ ] Sei revisar privilégios.
- [ ] Sei proteger backups e segredos.
- [ ] Sei limitar impacto de injeção.

## Resumo

Hardening combina rede, autenticação, privilégios, criptografia e auditoria. Defesa em profundidade limita o impacto de falhas.
