# PROGRESS.md — CyberQuest

Retome a partir do primeiro checkbox desmarcado. Cada item concluído tem uma linha do que foi feito.

## Fase 1 — Fundação
- [x] Monorepo pnpm, TS, ESLint/Prettier, `packages/shared`, `AGENTS.md`, `.env.example`
- [x] API Express base, config validada, pino, helmet, health
- [x] SQLite + sistema de migrations + schema da seção 5
- [x] Web Vite+React+Tailwind com tema, layout, roteamento
- [x] *Aceite:* `pnpm dev` sobe api e web; `/api/health` responde; build passa.

**Resumo Fase 1:** Monorepo criado com shared/API/web, config zod, pino/helmet, SQLite com migrations e health.

## Fase 2 — Auth e usuários
- [x] Registro/login/logout/me, argon2id, cookie JWT, rate limit, CSRF
- [x] Páginas entrar/cadastro, rotas protegidas
- [x] *Aceite:* fluxo completo funciona; testes de auth verdes.

**Resumo Fase 2:** Auth com argon2id, JWT em cookie httpOnly, CSRF por Origin, rate limits e páginas de login/cadastro. Testes de integração cobrem registro, login, rota protegida e bloqueio sem auth.

## Fase 3 — Conteúdo e motor de lições
- [x] Schemas zod do frontmatter + parser de `/content` + seed idempotente
- [x] Endpoints de trilhas/lições; desbloqueio por pré-requisito
- [x] Renderizador Markdown com callouts; `ExerciseRenderer` com todos os tipos (exceto labs); `SimTerminal`
- [x] Mapa de trilhas (`TrackMap`) e página de lição com barra de progresso
- [x] Conteúdo das **Trilhas 0–3 completo**
- [x] *Aceite:* um usuário completa uma lição ponta a ponta; respostas corrigidas no servidor.

**Resumo Fase 3:** Loader YAML/Markdown com zod, seed idempotente, 11 trilhas/31 módulos/104 lições/284 exercícios no banco. Integração completa da primeira lição validada por teste, incluindo desbloqueio da seguinte e correção server-side.

## Fase 4 — Gamificação
- [x] XP/níveis/Bits/streak (com timezone e freeze), eventos idempotentes
- [x] Conquistas (seed 38) + toasts; mascote Byte; animações de level-up
- [x] Painel, ranking semanal/all-time, desafio diário, revisão espaçada, loja básica
- [x] Jobs cron (streak, reset semanal)
- [ ] *Aceite:* testes unitários da seção 14 verdes; painel reflete progresso em tempo real.

**Resumo Fase 4:** XP/níveis/Bits/streak, 38 conquistas, ranking, desafio diário, SM-2, loja, mascote e jobs. Testes cobrem regras puras, ranking e XP idempotente; ainda faltam testes de conquistas e do cron.

## Fase 5 — Labs Docker
- [x] Imagens `attacker`, `target`, `proxy` (o alvo único é parametrizado por `CQ_LAB`) + `pnpm labs-build`
- [x] `LabOrchestrator`, rede interna, limites, labels, rollback, cleanup, flags dinâmicas
- [x] WebSocket de terminal + `LabWorkspace` (xterm.js), proxy sidecar, timer, estender/encerrar
- [x] Validação de flag, dicas pagas, writeup pós-conclusão, termo de uso
- [x] Labs: `ola-terminal`, `linux-basics`, `explorando-a-rede`, `hashes-e-encoding`, `recon-nmap`, `web-sqli-login`, `web-xss-idor`, `padaria-byte`, `analise-de-logs`, `auditar-dockerfile`
- [x] *Aceite:* iniciar → usar terminal → capturar flag → XP concedido → encerrar sem containers órfãos.

**Resumo Fase 5:** Três imagens e 10 manifests/writeups. Rede interna, `cap-drop`, `no-new-privileges`, limites, TTL, HMAC de flags e rollback. Corrigido vazamento de flags para o attacker e parsing de `CQ_FLAG_*` no alvo. Testes manuais de flag passaram em `ola-terminal`, `web-sqli-login`, `padaria-byte` e `analise-de-logs`. Adicionados 5 testes do orquestrador com Docker mockado (provisionamento, rollback, stop, expiração e extensão). Corrigido o usuário do terminal para `student` na imagem attacker, alinhado ao plano e ao PS1.

## Fase 6 — Conteúdo restante e polimento
- [x] Trilhas 4–10 conforme a regra de profundidade da seção 10
- [x] Página de perfil/configurações, tema claro, acessibilidade, responsividade
- [x] Estados vazios, loading skeletons, tratamento de erros amigável
- [x] *Aceite:* Lighthouse acessibilidade 100 nas 6 páginas medidas; único erro de console é o 401 esperado de `/auth/me` para visitante.

**Resumo Fase 6:** Trilhas 4–9 com amostra completa + esqueletos `draft`; Trilha 10 `coming_soon`. Perfil, configurações, tema, estados de loading/erro e responsividade implementados. Lighthouse rodou em landing, login, cadastro, painel, trilhas e labs: acessibilidade 100, SEO 100 e performance 75–88 (Chrome headless no WSL).

## Fase 7 — Qualidade e entrega
- [ ] Testes completos (seção 14), revisão de segurança (seção 12)
- [x] `pnpm audit` limpo e dependências vulneráveis atualizadas
- [x] `README.md`, `docs/CONTENT_GUIDE.md`, `docs/LAB_GUIDE.md`, `docs/BACKLOG.md`
- [x] Verificação final: instalação limpa seguindo o README funciona do zero
- [ ] *Aceite:* todos os checkboxes do `PROGRESS.md` marcados ou movidos justificadamente para o backlog.

**Resumo Fase 7 (parcial):** Adicionados testes de gamificação/SM-2, payload público, correção de todos os exercícios, HMAC de flags, auth, progresso, desbloqueio, XP idempotente, ranking, catálogo e orquestrador. Dependências atualizadas (zod 4, react-router 7, Vite 7, Vitest 4, dockerode 5, node-cron 4) e `pnpm audit` sem vulnerabilidades conhecidas. `pnpm test` (39 testes), `pnpm lint` e `pnpm build` passam. `docker-compose.yml` entrega API/web, imagens multi-stage, nginx e entrypoint; smoke test validou health, auth, listagem, start de lab, captura de flag com XP, terminal web via WebSocket e stop. Instalação limpa validada em `/tmp` (install, test, build e seed). Lighthouse: acessibilidade 100, SEO 100 e performance 75–88 em landing, login, cadastro, painel, trilhas e labs. Adicionados gzip/cache no nginx e `robots.txt`. Documentação atualizada. Teste Docker opcional continua pendente.

## Expansão DBA

### E1 — Introdução de Áreas
- [x] Migration `002_areas.sql` com tabela `areas`, `area_id` em tracks/XP/conquistas e backfill de `ciberseguranca`
- [x] `content/areas/*.yml` e `area` no frontmatter das 11 trilhas existentes
- [x] Loader, seed idempotente e schemas compartilhados para áreas
- [x] Progresso/desbloqueio isolado por área e XP por área em `xp_events.area_id`
- [x] APIs `/areas`, `/areas/:slug`, `/me/stats/areas` e filtros `?area=` em trilhas, conquistas e ranking
- [x] UI `/areas`, `/areas/:slug`, redirect de `/trilhas`, seletor de área, breadcrumbs, dashboard “Suas áreas” e filtros
- [x] `docs/AREAS_GUIDE.md`, decisões registradas e testes de migração/API
- [x] *Aceite:* `pnpm db:migrate`, `pnpm seed`, `pnpm test` (27), `pnpm lint` e `pnpm build` verdes
- [x] E2 — motor SQL `sql_query`

**Resumo E1:** Hierarquia Área → Trilha → Módulo → Lição ativa. As 11 trilhas existentes ficaram em Cibersegurança; Bancos de Dados existe como área ativa ainda sem trilhas. Progresso e XP são isolados por área, com ranking e conquistas filtráveis. Backup pré-migração em `backups/cyberquest-dev-20261109-1912.db`.

### E2 — Motor de SQL (`sql_query`)
- [x] Módulo `exercises/sql/` com PGlite em worker, timeout, limites e fila
- [x] Modos `result_match`, `state_check`, `plan_check` + endpoints `run`, `answer`, `schema`
- [x] Dataset `padaria_byte.sql` determinístico (40 clientes, 25 produtos, 300 pedidos, 800 itens) + teste de carga
- [x] Componente `SqlQueryExercise` com CodeMirror, esquema, resultados, dicas e diff resumido
- [x] Payload público sem `expected_sql`/`check_sql`; `sql_query` fora do desafio diário até E5
- [x] Testes unitários e integração; `pnpm test` (37), `pnpm lint`, `pnpm build` e `pnpm audit` verdes
- [x] *Aceite:* exercício resolvido ponta a ponta; timeout aborta o worker; gabarito não aparece em respostas de leitura

**Resumo E2:** Novo tipo `sql_query` com PostgreSQL real via PGlite/WASM, isolado por tentativa em worker e sem Docker. O timeout de execução começa após a carga do dataset; a fila protege a memória. O editor carrega sob demanda (code-split) e exibe esquema, dicas e resultados. Dataset da Padaria Byte é determinístico e os testes cobrem os três modos, timeout, erro de sintaxe, tolerância numérica e idempotência de XP.

### E3 — Conteúdo da trilha `11-dba-postgresql`
- [x] `track.yml` da trilha DBA (`bancos-de-dados`, posição 1) e 3 módulos com `module.yml`
- [x] Módulo 1 — Fundamentos: 6 lições (incl. lab `psql` com `lab_slug: null` até E4 e boss `boss-fundamentos-bd`)
- [x] Módulo 2 — SQL essencial: 13 lições + boss `boss-sql-essencial`, com ≥3 `sql_query` por lição
- [x] Módulo 3 — Modelagem e design: 5 lições + boss `boss-modelagem`
- [x] Todos os `sql_query` usam `padaria_byte`; correções em `result_match`/`state_check` e exercícios de outros tipos conforme currículo
- [x] Teste `apps/api/tests/dba-content.test.ts` executa o gabarito e o `check_sql` de cada `sql_query` da trilha
- [x] Contagens de integração atualizadas (12 trilhas, 34 módulos, 130 lições, 381 exercícios)
- [x] *Aceite:* `pnpm seed`, `pnpm test` (39), `pnpm lint` e `pnpm build` verdes

**Resumo E3:** Trilha DBA completa com 26 lições em 3 módulos. O conteúdo segue os slugs imutáveis do currículo e a regra de profundidade (3+ exercícios SQL por lição do módulo essencial). A validação automatizada carrega cada gabarito no PGlite, aplica o `setup` quando existe e roda o `check_sql`, cobrindo os 45 `sql_query` da trilha. O processo revelou e corrigiu dois exercícios que violavam a FK de `itens_pedido` ao apagar pedidos. O lab de `psql` foi ligado ao manifesto na E4.

### E4 — Labs de PostgreSQL real
- [x] Extensão do manifesto: `workstation`, `terminal`, `verify`, `init_scripts`, `files`, `ephemeral_volumes`, `resources` e `healthcheck.cmd`; allowlist `cyberquest/*` + `postgres:*`
- [x] Endpoint `POST /api/lab-sessions/:id/verify`, botão **Verificar** na UI, XP por objetivo, remoção de volumes na limpeza e em rollback
- [x] Imagem `cyberquest/dba-workstation` + `pnpm labs-build`; `postgres:16` como target real
- [x] Labs: `psql-primeiros-passos`, `roles-e-privilegios`, `pg-hba-no-acesso`, `query-lenta`, `vacuum-e-bloat`, `locks-e-deadlock`, `backup-e-restore`
- [x] Writeups dos 7 labs, scripts SQL de setup e link do lab de `psql` na lição
- [x] Testes: schema de manifestos antigos/novos, orquestrador com volumes, verificação e Docker real opcional
- [x] *Aceite:* `psql-primeiros-passos` iniciado com Docker real, objetivo verificado, containers/volumes removidos e `docker ps`/`docker volume ls` filtrados por `cyberquest.managed=true` vazios

**Resumo E4:** Sete labs DBA rodam com PostgreSQL real e terminal na estação `dba-workstation`. Objetivos operacionais são verificados por `psql` ou comando no container, sem flag artificial; objetivos antigos continuam em modo flag. Volumes efêmeros são compartilhados por `mountPath` e removidos no stop/expiração/rollback/`labs-clean`. O smoke test real revelou e corrigiu dois travamentos: o pager do `psql` e o stream multiplexado do `docker exec` (agora `hijack` + `Tty` + `-P pager=off`). `pnpm seed` registra 17 labs; `pnpm test` (7 shared + 40 API), `pnpm lint` e `pnpm build` verdes.

### E5 — Conteúdo de administração e operação + labs avançados
- [x] Módulo 4 — Administração essencial: 11 lições (incl. labs de roles e pg_hba e boss)
- [x] Módulo 5 — Desempenho e tuning: 13 lições (incl. labs de query lenta, vacuum e locks e boss)
- [x] Módulo 6 — Backup, replicação e HA: 14 lições completas
- [x] Módulos 7–9 conforme a regra de profundidade: 1 lição completa por módulo, lab final e demais `draft` com ≥250 palavras e 2 exercícios
- [x] Labs `pitr`, `replicacao-streaming` e `resgate-padaria-byte` com manifests, scripts de preparo e writeups
- [x] 15 conquistas DBA (labs, módulo, lições, trilha e critérios de SQL), totalizando 53
- [x] `sql_query` no desafio diário (`result_match`/`plan_check`) e revisão espaçada com SQL
- [x] Testes: desafio diário SQL, revisão SQL, conquistas de sequência/volume, profundidade do conteúdo e smoke Docker real dos três labs novos
- [x] Contagens e documentação atualizadas: 40 módulos, 187 lições, 566 exercícios, 53 conquistas, 20 labs
- [x] *Aceite:* 10 labs principais de DBA iniciam com PostgreSQL real; `pnpm seed`, testes, lint e build verdes

**Resumo E5:** A trilha DBA chegou a 9 módulos e 83 lições, com os módulos 1–6 completos e os módulos 7–9 seguindo a profundidade planejada. O desafio diário e a revisão agora aceitam SQL, e as conquistas cobrem labs, módulo de modelagem, lições de JOIN/CTE/window e sequências de consultas. Os labs avançados rodaram com Docker real: PITR com cópia de recuperação, replicação streaming com primário/standby e o plantão da Padaria Byte com sessões esgotando conexões. O lab de replicação revelou que volumes compartilhados precisam de `PGDATA` em subdiretórios distintos; o standby também precisa de `chmod 700` antes de iniciar. Os manifests novos foram validados pelos testes de schema e pelo smoke opcional.

### E6 — Qualidade e documentação
- [x] Testes da seção 9: áreas/migração, comparador SQL, `plan_check`, dataset, `sql/run` e `answer`, timeout, manifestos, orquestrador e smoke Docker opcional
- [x] `pnpm audit --audit-level high` sem vulnerabilidades conhecidas
- [x] Revisão das regras de segurança dos labs novos: rede interna, sem socket/privileged, caps mínimos, senha de replicação restrita à rede descartável e `pg_hba` trust apenas no cenário didático
- [x] `README.md`, `docs/CONTENT_GUIDE.md`, `docs/LAB_GUIDE.md`, `docs/DECISIONS.md` e `docs/BACKLOG.md` atualizados
- [x] Verificação de instalação limpa em diretório temporário: `pnpm install --frozen-lockfile`, `pnpm build` e `pnpm seed` passaram
- [x] *Aceite:* todos os checkboxes da expansão marcados ou justificados no backlog

**Resumo E6:** Cobertura de testes da expansão, auditoria de dependências, revisão de segurança dos labs novos, documentação e instalação limpa concluídas. A instalação do zero em cópia temporária reproduziu 2 áreas, 12 trilhas, 40 módulos, 187 lições, 566 exercícios, 53 conquistas e 20 labs. Os labs opcionais `pgbouncer` e `monitoramento` ficaram no backlog, assim como a recuperação real de PITR com WAL em segunda instância.

## Próximos passos

1. Revisar editorialmente os exercícios gerados e aprofundar Trilhas 4–9.
2. Reduzir o bundle inicial (code-splitting) para melhorar a performance.
3. Avaliar os labs opcionais `pgbouncer` e `monitoramento` (registrados no backlog).
4. Substituir a simulação de PITR por recuperação real de WAL em uma segunda instância, se o custo operacional couber.
