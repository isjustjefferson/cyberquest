---
slug: "tuning-de-configuracao"
title: "Tuning de configuração"
kind: lesson
difficulty: 4
est_minutes: 20
xp: 60
status: complete
prerequisites: ["estatisticas-e-analyze"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Por que aumentar work_mem globalmente é arriscado?"
    options:
      - "Porque cada operação de cada sessão pode usar essa quantidade"
      - "Porque work_mem desliga o autovacuum"
      - "Porque work_mem só vale para o banco postgres"
      - "Porque o valor é ignorado em conexões TCP"
    answerIndex: 0
    explanation: "work_mem é por operação. Muitas sessões, cada uma com vários sorts e hashes, multiplicam o consumo e podem esgotar a RAM."
  - type: match
    xp: 14
    question: "Relacione o parâmetro ao efeito principal."
    pairs:
      - ["shared_buffers", "Cache de páginas compartilhado"]
      - ["effective_cache_size", "Estimativa de cache total para o planejador"]
      - ["max_wal_size", "Espaço de WAL antes de forçar checkpoint"]
      - ["checkpoint_completion_target", "Distribuição da escrita de checkpoint"]
      - ["random_page_cost", "Custo relativo de leitura aleatória"]
    explanation: "Alguns parâmetros afetam memória; outros orientam o planejador ou suavizam I/O de checkpoint."
  - type: true_false
    xp: 8
    statement: "Mudar vários parâmetros ao mesmo tempo é a melhor forma de aprender o que funciona."
    answer: false
    explanation: "Sem mudar uma coisa por vez, você não sabe qual ajuste causou o efeito. Meça com carga representativa e registre os resultados."
---

# Tuning de configuração

Tuning começa por método, não por números mágicos. Primeiro entenda a carga: OLTP com muitas transações curtas, relatórios analíticos, ou mistura. Depois dimensione os recursos: CPU, RAM, disco e latência. Só então ajuste parâmetros, um de cada vez, medindo o efeito com uma carga representativa, como `pgbench` ou consultas reais.

Os parâmetros de maior impacto são conhecidos. `shared_buffers` é o cache compartilhado; em servidor dedicado, comece perto de 25% da RAM. `effective_cache_size` não aloca memória: informa ao planejador quanto cache existe no total, incluindo o sistema operacional. `work_mem` é por operação e exige cautela; valores altos podem multiplicar o consumo. `maintenance_work_mem` acelera vacuum e criação de índices, mas é usado por poucos processos.

Checkpoints também afetam. `max_wal_size` maior reduz a frequência de checkpoints forçados; `checkpoint_completion_target` perto de 0,9 distribui a escrita e evita picos. Em SSD, `random_page_cost` menor que o padrão de 4 pode fazer o planejador escolher índices com mais confiança. `max_connections` alto custa memória e processos; prefira pooler a abrir conexões ilimitadas.

Não existe configuração universal. Um servidor de relatórios pode priorizar `work_mem` e paralelismo; um OLTP prioriza latência e concorrência. Ferramentas como PGTune dão um ponto de partida, não uma resposta final. Documente cada mudança, o motivo e o resultado.

## Por que isso importa

Configuração inadequada causa desde lentidão até indisponibilidade. O DBA precisa justificar ajustes com medição, não com folclore.

## Conceitos-chave

- **shared_buffers:** cache compartilhado.
- **effective_cache_size:** estimativa para o planejador.
- **work_mem:** memória por operação.
- **max_wal_size:** limite de WAL.
- **checkpoint_completion_target:** suavização de I/O.
- **random_page_cost:** custo de leitura aleatória.

## Erros comuns

Aumentar tudo de uma vez. Ignorar a concorrência ao dimensionar work_mem. Aumentar max_connections sem pooler. Aplicar receita de internet sem medir a carga local.

## Checklist de domínio

- [ ] Sei diferenciar memória alocada de estimativa.
- [ ] Sei explicar o risco de work_mem alto.
- [ ] Sei ajustar checkpoints com método.
- [ ] Sei medir antes e depois.

## Resumo

Tuning é experimento controlado. Conheça a carga, ajuste um parâmetro por vez, meça e documente. Os maiores ganhos vêm de bom desenho de consultas e índices.
