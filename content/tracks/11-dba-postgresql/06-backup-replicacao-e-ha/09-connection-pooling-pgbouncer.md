---
slug: "connection-pooling-pgbouncer"
title: "Connection pooling com PgBouncer"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["arquitetura-processos-e-memoria"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual é o principal motivo de usar um pooler?"
    options:
      - "Reduzir o número de conexões reais e o custo de processos no banco"
      - "Aumentar o tamanho do WAL"
      - "Substituir backups"
      - "Eliminar a necessidade de índices"
    answerIndex: 0
    explanation: "O pooler reaproveita um conjunto pequeno de conexões reais entre muitos clientes, reduzindo processos e memória no PostgreSQL."
  - type: match
    xp: 12
    question: "Relacione o modo do PgBouncer ao momento em que a conexão é devolvida."
    pairs:
      - ["session", "Ao final da sessão do cliente"]
      - ["transaction", "Ao final de cada transação"]
      - ["statement", "Ao final de cada comando"]
    explanation: "Transaction dá mais escala, mas quebra estado de sessão. Session é mais compatível e menos eficiente."
  - type: true_false
    xp: 8
    statement: "No modo transaction, prepared statements e SET de sessão podem se comportar de forma diferente."
    answer: true
    explanation: "A conexão física muda entre transações. Recursos que dependem de estado de sessão precisam de cuidado ou de configuração específica."
---

# Connection pooling com PgBouncer

Cada conexão PostgreSQL é um processo. Aplicações com muitos workers abrem centenas de conexões, a maioria ociosa, e o servidor gasta memória e CPU só para mantê-las. Um **pooler** fica entre a aplicação e o banco, mantendo um conjunto pequeno de conexões reais e multiplexando os clientes.

O PgBouncer oferece três modos. Em `session`, a conexão é presa ao cliente até o fim da sessão: máxima compatibilidade, pouca multiplexação. Em `transaction`, a conexão é devolvida ao final de cada transação: é o modo mais usado para escala, mas quebra estado de sessão, como `SET` local, `LISTEN`, cursores com hold e alguns prepared statements. Em `statement`, a devolução é ainda mais agressiva e raramente indicada.

Dimensionamento é um equilíbrio. O pool não deve ser grande a ponto de recriar o problema no banco, nem pequeno a ponto de enfileirar. Monitore `SHOW POOLS;`, tempos de espera e uso de conexões. O `max_connections` do PostgreSQL deve considerar o pooler e conexões administrativas, não o número bruto de clientes.

Pooling na aplicação, como HikariCP ou pgx pool, também ajuda, mas cada instância mantém seu próprio pool. Em ambientes com muitos pods, um pooler central evita a multiplicação. A escolha depende do padrão de uso e da compatibilidade necessária.

## Por que isso importa

Conexões demais derrubam o banco; de menos, enfileiram a aplicação. O DBA precisa dimensionar pooler e banco juntos.

## Conceitos-chave

- **Pooler:** intermediário de conexões.
- **session:** conexão por sessão.
- **transaction:** conexão por transação.
- **statement:** conexão por comando.
- **SHOW POOLS:** métricas do PgBouncer.
- **max_connections:** limite do servidor.

## Erros comuns

Usar transaction sem revisar estado de sessão. Dimensionar pool maior que o banco suporta. Ignorar fila de espera. Esquecer conexões administrativas.

## Checklist de domínio

- [ ] Sei explicar o custo de conexão.
- [ ] Sei diferenciar os modos.
- [ ] Sei dimensionar um pool.
- [ ] Sei monitorar filas.

## Resumo

Pooler reduz processos e melhora escala. O modo transaction é poderoso, mas exige compatibilidade. Dimensione com métricas, não com palpite.
