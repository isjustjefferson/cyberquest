---
slug: "portfolio-e-projeto-final"
title: "Projeto final: desenhar, implementar e operar"
kind: lesson
difficulty: 4
est_minutes: 120
xp: 400
status: draft
prerequisites: ["perfis-dba-sre-data-engineer", "certificacoes-e-recursos", "contribuindo-com-o-postgres"]
lab_slug: null
exercises:
  - type: multi_choice
    xp: 14
    question: "Quais itens pertencem à entrega do projeto final?"
    options:
      - "Esquema normalizado com constraints"
      - "Consultas analíticas com window functions e CTEs"
      - "Otimizações com EXPLAIN antes e depois"
      - "Segredos e dados reais no repositório"
      - "README com decisões e plano de backup"
    answerIndexes: [0, 1, 2, 4]
    explanation: "A entrega prova o ciclo completo. Dados reais e segredos nunca devem ir para o repositório."
  - type: true_false
    xp: 10
    statement: "Um projeto de portfólio deve mostrar decisões e medições, não apenas o esquema final."
    answer: true
    explanation: "Decisões e evidências demonstram raciocínio de engenharia. O esquema sozinho conta pouco."
  - type: single_choice
    xp: 10
    question: "Qual é a melhor forma de demonstrar uma otimização?"
    options:
      - "Comparar EXPLAIN e tempo antes e depois"
      - "Dizer que ficou mais rápido"
      - "Aumentar work_mem sem medir"
      - "Criar todos os índices possíveis"
    answerIndex: 0
    explanation: "Plano e medição antes/depois comprovam a mudança e mostram o custo. Sem linha de base, não há evidência."
---

# Projeto final: desenhar, implementar e operar

O projeto final consolida a trilha. Escolha um domínio — clínica, escola, e-commerce — e percorra o ciclo completo: requisitos, modelagem ER, normalização, DDL com constraints, dataset de teste e consultas analíticas com window functions e CTEs.

Meça desempenho. Crie índices com base em `EXPLAIN`, registre planos e tempos antes e depois. Modele papéis e, quando fizer sentido, RLS. Configure backup e teste a restauração. Opcionalmente, monte replicação em Docker Compose.

Documente as decisões em um README: por que esse modelo, esses índices, esse plano de backup. Publique no GitHub sem dados reais nem segredos. Escreva um post explicando um problema de desempenho resolvido.

A entrega é autoavaliada na plataforma: esquema, consultas, otimizações, papéis, backup testado e README. O valor está em demonstrar raciocínio e evidência, não apenas o resultado.

## Por que isso importa

Portfólio é prova de prática. Um projeto bem documentado mostra que você sabe projetar, medir, operar e comunicar.

## Conceitos-chave

- **modelagem e normalização**
- **DDL com constraints**
- **window functions e CTEs**
- **EXPLAIN antes/depois**
- **papéis e RLS**
- **backup testado**
- **README**

## Erros comuns

Publicar dados reais. Não medir. Ignorar documentação. Criar índices sem evidência. Esquecer restauração.

## Checklist de domínio

- [ ] Sei modelar e implementar o esquema.
- [ ] Sei medir e otimizar consultas.
- [ ] Sei documentar decisões.
- [ ] Sei publicar sem segredos.

## Resumo

O projeto final prova o ciclo completo: requisito, modelo, consulta, índice, segurança, backup e documentação. Evidência vale mais que afirmação.
