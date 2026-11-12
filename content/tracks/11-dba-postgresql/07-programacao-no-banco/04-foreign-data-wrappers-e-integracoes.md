---
slug: "foreign-data-wrappers-e-integracoes"
title: "Foreign Data Wrappers e integrações"
kind: lesson
difficulty: 4
est_minutes: 12
xp: 50
status: draft
prerequisites: ["extensoes"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que um FDW permite?"
    options:
      - "Consultar dados externos como se fossem tabelas locais"
      - "Aumentar o tamanho do WAL"
      - "Substituir backups"
      - "Criar índices automaticamente em todos os bancos"
    answerIndex: 0
    explanation: "O Foreign Data Wrapper expõe fontes externas por meio de tabelas estrangeiras no banco local."
  - type: true_false
    xp: 10
    statement: "FDW é sempre a melhor opção para integrar sistemas de alto volume."
    answer: false
    explanation: "Cada consulta atravessa a rede e nem toda operação é empurrada para a origem. Para alto volume, replicação ou ETL podem ser melhores."
---

# Foreign Data Wrappers e integrações

Um FDW permite acessar dados externos como tabelas locais. `postgres_fdw` conecta a outro PostgreSQL; `file_fdw` lê arquivos. O fluxo básico é criar a extensão, um `SERVER`, um `USER MAPPING` com credenciais e `IMPORT FOREIGN SCHEMA`.

A grande questão é desempenho. O planejador tenta empurrar filtros e junções para a origem (*pushdown*), mas nem tudo é suportado. Consultas que cruzam muitos dados pela rede podem ser lentas. Meça e considere replicação lógica ou ETL para uso intenso.

Credenciais de `USER MAPPING` são sensíveis. Proteja-as, restrinja quem pode ler o catálogo e prefira opções de autenticação suportadas pela origem. FDW é integração, não atalho mágico.

Ao investigar uma consulta estrangeira, compare o plano local e o plano na origem. Um filtro simples pode ser enviado ao servidor remoto, enquanto uma função não suportada pode obrigar o PostgreSQL local a transferir muitas linhas. Limite colunas e linhas, defina timeouts de conexão e teste o comportamento quando a origem fica indisponível. Para relatórios recorrentes ou grandes volumes, uma cópia atualizada por ETL pode ser mais previsível que uma consulta síncrona pela rede.

## Por que isso importa

FDW resolve integrações pontuais sem duplicar dados, mas pode esconder custo de rede e riscos de credenciais.

## Conceitos-chave

- **postgres_fdw**
- **file_fdw**
- **CREATE SERVER**
- **USER MAPPING**
- **IMPORT FOREIGN SCHEMA**
- **pushdown**

## Erros comuns

Ignorar rede. Expor credenciais. Assumir pushdown total. Usar para alto volume.

## Checklist de domínio

- [ ] Sei configurar um FDW básico.
- [ ] Sei explicar pushdown.
- [ ] Sei comparar com replicação.

## Resumo

FDW traz dados externos para perto da consulta. Funciona bem para integrações pontuais; alto volume pede outra estratégia.
