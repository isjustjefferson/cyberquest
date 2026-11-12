---
slug: "upgrades-e-manutencao"
title: "Upgrades e manutenção"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["estrategias-de-backup", "replicacao-logica"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "O que muda entre PostgreSQL 17.2 e 17.5?"
    options:
      - "Apenas correções e melhorias da versão menor; basta trocar binários e reiniciar"
      - "O formato dos arquivos de dados, exigindo pg_upgrade"
      - "O nome do banco padrão"
      - "A porta de conexão"
    answerIndex: 0
    explanation: "Versões menores mantêm compatibilidade. Aplique as correções, troque os binários e reinicie; sempre leia as notas de versão."
  - type: match
    xp: 14
    question: "Relacione o método de upgrade à característica."
    pairs:
      - ["pg_dump/pg_restore", "Simples e portátil, mas lento em bases grandes"]
      - ["pg_upgrade --link", "Rápido, com mesmo filesystem e downtime curto"]
      - ["Replicação lógica", "Quase zero downtime, com preparação e validação"]
      - ["Snapshot/restauração", "Depende da infraestrutura e do tempo de cópia"]
    explanation: "Cada método troca simplicidade, tempo e risco. O ensaio em cópia é obrigatório em qualquer caminho."
  - type: true_false
    xp: 8
    statement: "Depois de um upgrade major, executar ANALYZE ajuda o planejador a trabalhar com as novas estatísticas."
    answer: true
    explanation: "O upgrade pode alterar o formato de estatísticas e planos. ANALYZE atualiza o retrato usado pelo planejador."
---

# Upgrades e manutenção

Atualizações **menores** (17.2 para 17.5) mantêm compatibilidade de dados e trazem correções de segurança e bugs. O procedimento é trocar os binários e reiniciar. Mesmo assim, leia as notas: mudanças de comportamento podem exigir ajuste.

Upgrades **maiores** (16 para 17) mudam o formato interno e exigem método. `pg_dump`/`pg_restore` é simples e portátil, mas lento. `pg_upgrade` converte o catálogo e pode usar `--link` para evitar copiar os arquivos, reduzindo o downtime; use `--check` antes. A replicação lógica permite manter origem e destino ativos, copiar dados iniciais, sincronizar mudanças e trocar no momento planejado.

Todo upgrade precisa de ensaio em uma cópia. Meça tempo, valide queries críticas, extensões, roles, configurações e espaço em disco. Verifique compatibilidade das extensões com a nova versão. Tenha um plano de reversão: backup, binários antigos e critérios claros para abortar.

Após a virada, rode `ANALYZE`, monitore planos e compare métricas. Atualize o `pg_hba.conf`, bibliotecas de conexão e ferramentas. Documente o que foi feito e remova o ambiente antigo somente após o período de segurança.

## Por que isso importa

Upgrade mal planejado é uma das maiores causas de indisponibilidade. Ensaio, backup e reversão transformam uma mudança arriscada em procedimento controlado.

## Conceitos-chave

- **Versão menor:** compatível, correções.
- **Versão maior:** formato novo, método obrigatório.
- **pg_upgrade:** conversão do catálogo.
- **Replicação lógica:** transição quase sem parada.
- **ANALYZE pós-upgrade:** estatísticas novas.
- **Plano de reversão:** critério e caminho de volta.

## Erros comuns

Atualizar major sem ensaio. Ignorar extensões. Não medir espaço. Pular ANALYZE. Não definir critérios de abortar.

## Checklist de domínio

- [ ] Sei diferenciar minor e major.
- [ ] Sei comparar métodos de upgrade.
- [ ] Sei montar um checklist de ensaio.
- [ ] Sei planejar reversão.

## Resumo

Minor é rotina; major é projeto. Escolha o método pelo RTO e pelo porte, ensaie, valide e mantenha reversão. ANALYZE e monitoramento fecham o ciclo.
