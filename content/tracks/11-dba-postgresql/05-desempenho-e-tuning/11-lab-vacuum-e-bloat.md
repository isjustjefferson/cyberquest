---
slug: "lab-vacuum-e-bloat"
title: "Lab: Vacuum e bloat"
kind: lab
difficulty: 4
est_minutes: 30
xp: 300
status: complete
prerequisites: ["autovacuum-e-bloat"]
lab_slug: "vacuum-e-bloat"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual estado de sessão impede o VACUUM de remover versões antigas?"
    options:
      - "idle in transaction"
      - "active"
      - "disabled"
      - "fastpath function call"
    answerIndex: 0
    explanation: "Uma transação ociosa aberta mantém um snapshot. O VACUUM não pode remover versões que ainda seriam visíveis para ela."
  - type: true_false
    xp: 10
    statement: "Ajustar autovacuum_vacuum_scale_factor por tabela é preferível a mudar o valor global para todas as tabelas."
    answer: true
    explanation: "O ajuste local resolve a tabela crítica sem alterar o comportamento de tabelas pequenas que já funcionam bem com o padrão."
  - type: fill_command
    xp: 10
    question: "Complete o comando que limpa e atualiza estatísticas da tabela pedidos."
    template: "VACUUM (___) pedidos;"
    blanks: ["ANALYZE"]
    accepted: [["ANALYZE"], ["analyze"]]
    explanation: "VACUUM (ANALYZE) combina limpeza de tuplas mortas e coleta de estatísticas, útil depois de grandes mudanças."
---

# Lab: Vacuum e bloat

Um script de atualizações em massa deixou `pedidos` inchada. O autovacuum não consegue agir porque uma transação esquecida está aberta em modo `idle in transaction`, segurando um snapshot antigo. O laboratório pede três coisas: encontrar e encerrar a sessão culpada, executar a limpeza e ajustar o autovacuum da tabela crítica.

Comece por `pg_stat_activity`. Filtre por `state = 'idle in transaction'` e observe `state_change`, `xact_start` e a consulta. Confirme o PID antes de agir. `pg_cancel_backend` interrompe a consulta; `pg_terminate_backend` encerra a sessão. Para uma transação ociosa esquecida, terminate costuma ser necessário. Nunca encerre uma sessão de outro time sem confirmar o impacto.

Depois, rode `VACUUM (ANALYZE) pedidos;` e compare `n_dead_tup`, tamanho da tabela e tamanho dos índices. Lembre que VACUUM normal reutiliza espaço, mas não devolve disco ao sistema operacional. Se o bloat continuar, avalie `REINDEX CONCURRENTLY` ou uma janela para `VACUUM FULL`.

Por fim, ajuste o autovacuum **na tabela**: reduza `autovacuum_vacuum_scale_factor` e, se fizer sentido, defina um threshold absoluto. Não mude o global sem evidência. A verificação automática confirma a sessão encerrada, a limpeza e a configuração por tabela.

## Por que isso importa

Bloat cresce silenciosamente e degrada consultas. Saber diagnosticar a causa — inclusive uma transação esquecida — evita tratar sintoma com VACUUM FULL recorrente.

## Conceitos-chave

- **idle in transaction:** snapshot retido.
- **pg_terminate_backend:** encerra sessão.
- **VACUUM (ANALYZE):** limpeza e estatísticas.
- **n_dead_tup:** sinal de lixo.
- **Ajuste por tabela:** configuração local do autovacuum.

## Erros comuns

Encerrar o PID errado. Rodar VACUUM FULL em produção. Mudar o autovacuum global. Ignorar índices inchados.

## Checklist de domínio

- [ ] Sei achar sessões que bloqueiam vacuum.
- [ ] Sei executar a limpeza e medir.
- [ ] Sei ajustar autovacuum por tabela.
- [ ] Sei diferenciar reutilizar e devolver espaço.

## Resumo

O lab une diagnóstico de transação, limpeza e prevenção. Encerre a sessão certa, limpe, meça e ajuste apenas a tabela crítica. O painel valida o estado final.
