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

**Resumo Fase 7 (parcial):** Adicionados testes de gamificação/SM-2, payload público, correção de todos os exercícios, HMAC de flags, auth, progresso, desbloqueio, XP idempotente, ranking, catálogo e orquestrador. Dependências atualizadas (zod 4, react-router 7, Vite 7, Vitest 4, dockerode 5, node-cron 4) e `pnpm audit` sem vulnerabilidades conhecidas. `pnpm test` (25 testes), `pnpm lint` e `pnpm build` passam. `docker-compose.yml` entrega API/web, imagens multi-stage, nginx e entrypoint; smoke test validou health, auth, listagem, start de lab, captura de flag com XP, terminal web via WebSocket e stop. Instalação limpa validada em `/tmp` (install, test, build e seed). Lighthouse: acessibilidade 100, SEO 100 e performance 75–88 em landing, login, cadastro, painel, trilhas e labs. Adicionados gzip/cache no nginx e `robots.txt`. Documentação atualizada. Teste Docker opcional continua pendente.

## Próximos passos

1. Adicionar teste de integração Docker opcional, ignorado quando o daemon não estiver disponível.
2. Revisar editorialmente os exercícios gerados e aprofundar Trilhas 4–9.
3. Reduzir o bundle inicial (code-splitting) para melhorar a performance.
