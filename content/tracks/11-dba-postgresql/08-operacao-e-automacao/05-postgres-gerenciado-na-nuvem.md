---
slug: "postgres-gerenciado-na-nuvem"
title: "PostgreSQL gerenciado na nuvem"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["automacao-com-scripts-e-iac"]
lab_slug: null
exercises:
  - type: match
    xp: 12
    question: "Relacione a tarefa ao responsável típico."
    pairs:
      - ["Patch do sistema operacional", "Provedor"]
      - ["Modelagem e índices", "Cliente"]
      - ["Backup gerenciado", "Provedor"]
      - ["Controle de acesso aos dados", "Cliente"]
    explanation: "O provedor cuida da infraestrutura; o cliente continua responsável por dados, desempenho e acessos."
  - type: true_false
    xp: 10
    statement: "Num PostgreSQL gerenciado, ninguém precisa se preocupar com índices e consultas lentas."
    answer: false
    explanation: "O modelo é de responsabilidade compartilhada. Modelagem, índices, consultas e acessos continuam do cliente."
---

# PostgreSQL gerenciado na nuvem

Serviços como Amazon RDS/Aurora, Google Cloud SQL/AlloyDB e Azure Database for PostgreSQL assumem parte da operação: provisionamento, patches, backups e, em alguns casos, HA. O cliente continua dono da modelagem, dos índices, das consultas, dos acessos e dos custos.

Limitações são reais: geralmente não há superusuário, a lista de extensões é restrita e parâmetros são controlados. Planeje compatibilidade antes de escolher. HA gerenciada não substitui backup nem PITR bem configurado.

Custos crescem com instância, armazenamento, I/O e tráfego. Dimensione com métricas e revise. Vendor lock-in merece atenção; recursos proprietários podem dificultar migração.

Compare a janela de backup, retenção de WAL, limites de conexões e opções de restauração antes de escolher um serviço. A alta disponibilidade oferecida pode cobrir falha de zona, mas não necessariamente erro humano ou corrupção lógica; mantenha uma cópia independente e ensaie a recuperação. Observe também custos de saída de dados e armazenamento de snapshots. Uma instância superdimensionada é fácil de comprar e difícil de perceber depois, então associe métricas de carga a revisões periódicas de capacidade.

## Por que isso importa

Gerenciado reduz trabalho de infraestrutura, mas não elimina a responsabilidade do DBA sobre desempenho, segurança e custo.

## Conceitos-chave

- **responsabilidade compartilhada**
- **superusuário ausente**
- **extensões limitadas**
- **parâmetros restritos**
- **custo**
- **lock-in**

## Erros comuns

Assumir que tudo é gerenciado. Ignorar limites de extensão. Não revisar custos. Deixar backups sem teste.

## Checklist de domínio

- [ ] Sei separar responsabilidades.
- [ ] Sei avaliar limitações.
- [ ] Sei revisar custo e migração.

## Resumo

Gerenciado cuida da infraestrutura; o cliente cuida dos dados e do desempenho. Conheça limites e custos antes de adotar.
