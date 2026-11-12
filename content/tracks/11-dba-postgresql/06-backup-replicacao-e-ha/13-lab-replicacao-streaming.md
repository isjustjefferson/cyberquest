---
slug: "lab-replicacao-streaming"
title: "Lab: Replicação em streaming"
kind: lab
difficulty: 4
est_minutes: 40
xp: 350
status: complete
prerequisites: ["replicacao-streaming"]
lab_slug: "replicacao-streaming"
exercises:
  - type: single_choice
    xp: 12
    question: "Qual consulta confirma o estado da réplica no primário?"
    options:
      - "SELECT * FROM pg_stat_replication;"
      - "SELECT * FROM pg_roles;"
      - "SHOW work_mem;"
      - "SELECT pg_switch_wal();"
    answerIndex: 0
    explanation: "pg_stat_replication mostra estado, posições e atraso dos standbys conectados."
  - type: true_false
    xp: 10
    statement: "Uma consulta de escrita na réplica deve ser recusada enquanto ela estiver em hot standby."
    answer: true
    explanation: "O standby aceita leitura, mas não escrita, até ser promovido. A exceção são objetos temporários de sessão."
  - type: order
    xp: 14
    question: "Ordene a preparação de uma réplica em streaming."
    items:
      - "Iniciar com standby.signal e acompanhar a recuperação"
      - "Criar papel de replicação e regra no pg_hba.conf"
      - "Configurar primary_conninfo"
      - "Restaurar um backup base no destino"
    correctOrder: [1, 3, 2, 0]
    explanation: "Acesso de replicação vem primeiro; depois a cópia base, a conexão e a inicialização. O log confirma o streaming."
---

# Lab: Replicação em streaming

O laboratório sobe dois PostgreSQL com a imagem oficial. O primário já tem a Padaria Byte; o standby está vazio. O objetivo é configurar o papel de replicação, tirar um backup base, iniciar a réplica e mostrar que os dados chegam em tempo real.

No primário, crie um papel com `REPLICATION` e libere a conexão no `pg_hba.conf`. No destino, use `pg_basebackup -R` para copiar o cluster e gerar o `primary_conninfo`. Crie `standby.signal` se a ferramenta não criou, ajuste permissões e inicie o servidor. O log deve mostrar a recuperação contínua.

Na réplica, consulte `pg_stat_wal_receiver` e compare as posições com o primário. No primário, veja `pg_stat_replication`. Insira um cliente na Padaria Byte pelo primário e confirme que ele aparece na réplica. Tente um `INSERT` na réplica e observe a recusa: é hot standby.

Por fim, simule uma falha. Pare o primário, promova a réplica com `pg_ctl promote` e valide que ela aceita escrita. Registre o que a aplicação precisaria fazer para se reconectar. O objetivo automático verifica o streaming e a promoção.

## Por que isso importa

Réplicas são operação real: papel, WAL, backup base, monitoramento e promoção. O lab conecta cada peça e mostra o comportamento do hot standby.

## Conceitos-chave

- **REPLICATION:** atributo do papel.
- **pg_basebackup -R:** cópia base com conexão.
- **standby.signal:** modo standby.
- **pg_stat_replication:** monitoramento.
- **Promoção:** escrita liberada.
- **Hot standby:** leitura apenas.

## Erros comuns

Esquecer pg_hba. Copiar cluster com versão errada. Não monitorar atraso. Promover sem redirecionar aplicação. Tentar escrever no standby.

## Checklist de domínio

- [ ] Sei preparar o acesso de replicação.
- [ ] Sei criar a cópia base.
- [ ] Sei monitorar o streaming.
- [ ] Sei promover com segurança.

## Resumo

O lab monta um standby real, confirma replicação e executa promoção. Cada etapa corresponde a um objetivo automático do painel.
