# Guia de áreas de conhecimento

Áreas agrupam trilhas por especialidade. Cada área tem progresso, XP e conquistas próprios, mas compartilha usuários, bits, streak e catálogo de exercícios.

## Estrutura

```text
content/
  areas/
    ciberseguranca.yml
    bancos-de-dados.yml
  tracks/
    00-boas-vindas/
      track.yml        # area: ciberseguranca
      ...
```

O frontmatter de uma área fica em `content/areas/<slug>.yml`:

```yaml
slug: ciberseguranca
title: Cibersegurança
description: Do básico ao pentest...
icon: 🛡️
color: "#00ff9c"
position: 1
status: active
```

- `slug`: identificador estável usado na URL e nas referências.
- `position`: define a ordem de exibição; não pode se repetir.
- `status`: `active` exibe a área normalmente; `coming_soon` mostra o card bloqueado.
- `color`: usada nos cards e destaques visuais.

Para vincular uma trilha, adicione `area: <slug>` ao `track.yml`. Trilhas sem `area` continuam válidas por compatibilidade e são associadas a `ciberseguranca` com um warning no seed.

## Regras de progresso

- A cadeia de desbloqueio é isolada por área: concluir a primeira lição de uma área não bloqueia nem libera outra área.
- Pré-requisitos explícitos (`prerequisites`) continuam funcionando dentro da área.
- `xp_events.area_id` registra o XP de lição, módulo, exercício, lab e objetivo de lab.
- Presença diária, desafio diário e conquistas globais ficam sem área.
- O ranking semanal global continua usando `weekly_xp`. O ranking filtrado por área soma `xp_events.area_id`.

## API

- `GET /api/tracks?area=<slug>`: trilhas filtradas por área.
- `GET /api/areas`: lista áreas com progresso, XP e próxima lição do usuário autenticado.
- `GET /api/areas/:slug`: detalhe da área com suas trilhas.
- `GET /api/me/stats/areas`: progresso e XP por área do usuário.
- `GET /api/me/achievements?area=<slug>`: conquistas globais e da área informada.
- `GET /api/leaderboard/weekly?area=<slug>` e `GET /api/leaderboard/all-time?area=<slug>`: ranking filtrado.

## UI

- `/areas`: lista de áreas.
- `/areas/:slug`: trilhas da área e próxima lição.
- `/trilhas`: redireciona para `/areas` quando há mais de uma área ativa, ou direto para a única área ativa.
- Trilhas e lições exibem breadcrumb com a área de origem.
- O layout oferece seletor de área quando existe mais de uma área ativa.

## Adicionando uma área

1. Crie `content/areas/<slug>.yml` com `status: active` (ou `coming_soon`).
2. Crie as trilhas em `content/tracks/` com `area: <slug>` e posições únicas dentro da área.
3. Rode `pnpm db:migrate` se houver migração nova e `pnpm seed`.
4. Valide `GET /api/areas`, `GET /api/tracks?area=<slug>` e a navegação em `/areas`.
5. Rode `pnpm test`, `pnpm lint` e `pnpm build`.

## Migração e compatibilidade

A migração `002_areas.sql` cria `areas` e adiciona `area_id` em `tracks`, `xp_events` e `achievements`. Ela faz backfill do conteúdo legado em `ciberseguranca`. Novas áreas não precisam repetir a migração; basta criar o YAML e rodar o seed.
