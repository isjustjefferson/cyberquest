---
slug: "logs-e-auditoria"
title: "Logs e auditoria"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: draft
prerequisites: ["monitoramento-metricas-chave"]
lab_slug: null
exercises:
  - type: fill_command
    xp: 10
    question: "Para registrar consultas acima de 500 ms, complete o valor."
    template: "log_min_duration_statement = ___"
    blanks: ["500"]
    accepted: [["500"], ["500ms"]]
    explanation: "O valor é em milissegundos. 500 registra consultas que levam mais de meio segundo."
  - type: true_false
    xp: 10
    statement: "Registrar todas as instruções em produção é sempre inofensivo."
    answer: false
    explanation: "Além do volume, o log pode conter dados pessoais em parâmetros. Avalie privacidade, retenção e custo."
---

# Logs e auditoria

O log é a memória do servidor. Configure `log_destination`, `logging_collector`, `log_line_prefix` com horário, usuário, banco e PID. `log_min_duration_statement` captura consultas lentas; `log_lock_waits` revela esperas; `log_connections` e `log_disconnections` mostram acessos.

`log_statement` pode registrar todas as instruções, mas gera volume e expõe dados. Para auditoria estruturada, `pgaudit` registra ações com mais controle. Envie logs para um coletor central, defina retenção e proteja o acesso.

Analise com ferramentas como pgBadger e crie alertas para erros e padrões. Evite gravar dados pessoais desnecessários; a LGPD e políticas internas se aplicam ao log.

`log_line_prefix` pode incluir `%m` para horário, `%u` para usuário, `%d` para banco, `%p` para PID e `%a` para nome da aplicação. Um prefixo consistente permite correlacionar o log do PostgreSQL com proxy, aplicação e sistema operacional. Defina rotação por tamanho ou tempo, retenção compatível com investigação e controle de acesso restrito. Em um incidente, timestamps sincronizados por NTP ajudam a reconstruir a sequência; sem isso, a análise pode atribuir eventos à ordem errada.

## Por que isso importa

Logs explicam incidentes e sustentam auditoria, mas também criam risco de privacidade e custo.

## Conceitos-chave

- **log_line_prefix**
- **log_min_duration_statement**
- **log_lock_waits**
- **pgaudit**
- **rotação**
- **LGPD**

## Erros comuns

Registrar tudo. Nunca rotacionar. Deixar log local apenas. Ignorar dados pessoais.

## Checklist de domínio

- [ ] Sei configurar log útil.
- [ ] Sei equilibrar detalhe e privacidade.
- [ ] Sei centralizar e analisar.

## Resumo

Logs dão visibilidade e auditoria. Configure o essencial, proteja dados sensíveis e centralize a análise.
