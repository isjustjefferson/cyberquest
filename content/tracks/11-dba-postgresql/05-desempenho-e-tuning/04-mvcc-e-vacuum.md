---
slug: "mvcc-e-vacuum"
title: "MVCC e VACUUM"
kind: lesson
difficulty: 4
est_minutes: 20
xp: 60
status: complete
prerequisites: ["indices-em-profundidade"]
lab_slug: "vacuum-e-bloat"
exercises:
  - type: single_choice
    xp: 10
    question: "O que acontece com a versão antiga de uma linha após um UPDATE?"
    options:
      - "É sobrescrita imediatamente no mesmo espaço"
      - "Fica como tupla morta até ser limpa pelo VACUUM"
      - "É movida automaticamente para uma tabela de histórico"
      - "É apagada pelo WAL no mesmo instante"
    answerIndex: 1
    explanation: "O UPDATE cria uma nova versão. A antiga permanece visível para transações que ainda precisam dela e depois é marcada como morta."
  - type: true_false
    xp: 8
    statement: "VACUUM FULL pode ser executado a qualquer hora sem impacto para os usuários."
    answer: false
    explanation: "VACUUM FULL reescreve a tabela e pede ACCESS EXCLUSIVE. Ele bloqueia leituras e escritas durante a operação."
  - type: match
    xp: 12
    question: "Relacione o conceito à sua função."
    pairs:
      - ["xmin", "Transação que criou a versão"]
      - ["xmax", "Transação que apagou ou substituiu a versão"]
      - ["Visibility Map", "Marca páginas sem tuplas mortas"]
      - ["Wraparound", "Risco de esgotar os IDs de transação"]
      - ["Bloat", "Espaço inchado por versões antigas"]
    explanation: "MVCC usa identificadores de transação para decidir visibilidade. O Visibility Map acelera vacuum e index-only scans."
---

# MVCC e VACUUM

O PostgreSQL usa **MVCC** (Multiversion Concurrency Control): leitores não bloqueiam escritores e escritores não bloqueiam leitores. Em vez de sobrescrever uma linha, um `UPDATE` cria uma nova versão e mantém a antiga enquanto alguma transação ainda puder precisá-la. Cada versão carrega `xmin`, a transação que a criou, e `xmax`, a transação que a invalidou.

Quando nenhuma transação precisa mais de uma versão antiga, ela vira **tupla morta**. O `VACUUM` marca esse espaço como reutilizável, atualiza o *visibility map* e impede que a tabela cresça sem limite. Ele não devolve espaço ao sistema operacional na maioria dos casos; apenas permite que o PostgreSQL reutilize as páginas. `VACUUM FULL` reescreve a tabela e devolve espaço ao SO, mas exige `ACCESS EXCLUSIVE` e pode levar muito tempo.

O acúmulo de tuplas mortas gera **bloat**: tabelas e índices maiores do que o necessário, mais I/O e planos piores. Fatores comuns são updates em massa, deletes antigos, autovacuum mal ajustado e transações longas que impedem a limpeza. O `VACUUM (ANALYZE)` combina limpeza e atualização de estatísticas.

Existe também o risco de **transaction ID wraparound**. Os IDs de transação são finitos; se o vacuum não conseguir avançar `datfrozenxid`, o servidor pode entrar em modo de emergência ou parar. Por isso, monitorar idade de transações não é opcional em bases grandes. O vacuum é manutenção crítica, não luxo.

## Por que isso importa

Bloat degrada desempenho lentamente e é confundido com falta de índice. Entender MVCC explica por que updates custam, por que transações longas atrapalham e por que VACUUM é parte da operação.

## Conceitos-chave

- **MVCC:** versões de linha para concorrência.
- **xmin/xmax:** criador e removedor da versão.
- **Tupla morta:** versão que não é mais visível.
- **VACUUM:** recupera espaço reutilizável.
- **VACUUM FULL:** reescreve e bloqueia.
- **Wraparound:** limite de IDs de transação.

## Erros comuns

Rodar VACUUM FULL em horário de pico. Achar que VACUUM devolve disco sempre. Manter transação aberta por horas. Ignorar a idade de `datfrozenxid`.

## Checklist de domínio

- [ ] Sei explicar o que UPDATE faz com a versão antiga.
- [ ] Sei diferenciar VACUUM e VACUUM FULL.
- [ ] Sei reconhecer causas de bloat.
- [ ] Sei explicar o risco de wraparound.

## Resumo

MVCC troca sobrescrita por versões. VACUUM limpa o que não é mais necessário; FULL devolve espaço ao custo de bloqueio. Transações longas e autovacuum inadequado alimentam bloat.
