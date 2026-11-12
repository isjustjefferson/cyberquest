---
slug: "extensoes"
title: "Extensões"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["plpgsql-funcoes-e-procedures"]
lab_slug: null
exercises:
  - type: match
    xp: 12
    question: "Relacione a extensão ao uso principal."
    pairs:
      - ["pg_trgm", "Similaridade e busca por trecho"]
      - ["pgcrypto", "Hash e criptografia"]
      - ["pg_stat_statements", "Estatísticas de consultas"]
      - ["PostGIS", "Dados geográficos"]
      - ["pg_cron", "Agendamento dentro do banco"]
    explanation: "Cada extensão adiciona funções e tipos. Instale apenas de fontes confiáveis e avalie compatibilidade."
  - type: true_false
    xp: 10
    statement: "Extensões são código executado dentro do servidor e ampliam a superfície de ataque."
    answer: true
    explanation: "Extensões rodam com privilégios no processo do banco. Origem, versão e manutenção importam."
---

# Extensões

`CREATE EXTENSION` adiciona recursos ao PostgreSQL. `pg_stat_statements` é quase obrigatória para diagnóstico. `pg_trgm` acelera buscas por trecho com índice GIN. `pgcrypto` oferece hash e criptografia. `uuid-ossp` ou `gen_random_uuid()` geram identificadores. PostGIS adiciona tipos e funções geográficas.

Consulte `pg_available_extensions` e `pg_extension` para ver o que está disponível e instalado. Algumas extensões exigem bibliotecas do sistema e privilégios elevados. Em serviços gerenciados, a lista permitida varia.

Antes de instalar, avalie manutenção, compatibilidade com a versão, impacto de upgrade e segurança. Extensão é código dentro do servidor; instale apenas de fontes confiáveis e mantenha atualizada.

Em ambientes gerenciados, confirme se a extensão está na lista suportada e se o plano permite habilitá-la. Em ambientes próprios, documente a versão e inclua-a no procedimento de restauração: o catálogo guarda que a extensão foi instalada, mas o servidor também precisa dos arquivos binários compatíveis. Evite dar superusuário a quem só precisa criar uma extensão aprovada; prefira provisionar o recurso por uma rotina administrativa controlada.

## Por que isso importa

Extensões evitam reinventar recursos e são parte do ecossistema. Também são superfície de ataque e dependência operacional.

## Conceitos-chave

- **CREATE EXTENSION**
- **pg_available_extensions**
- **pg_trgm**
- **pgcrypto**
- **GIN**
- **origem confiável**

## Erros comuns

Instalar sem avaliar. Ignorar upgrade. Usar extensão não suportada no gerenciado. Esquecer permissões.

## Checklist de domínio

- [ ] Sei listar extensões disponíveis.
- [ ] Sei associar extensão e uso.
- [ ] Sei avaliar risco.

## Resumo

Extensões ampliam o banco com recursos prontos. Instale com critério, mantenha atualizadas e trate como código de servidor.
