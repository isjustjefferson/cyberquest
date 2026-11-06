# AGENTS.md — Memória curta do CyberQuest

Leia `PLANO_CYBERQUEST.md` (fonte de verdade) e `curriculo/` (conteúdo) antes de mudanças grandes.

## Ambiente

- Desenvolvimento dentro do WSL2 Ubuntu, em `~/projetos/cyberquest` (nunca `/mnt/c`).
- Node 20+ via nvm, pnpm 9. Docker Engine/Desktop acessível em `/var/run/docker.sock`.
- Vite escuta em `0.0.0.0:5173`; API em `0.0.0.0:4000`.
- Arquivos `.sh`, `Dockerfile` e entrypoints usam LF (ver `.gitattributes`).

## Comandos

```bash
pnpm install            # instala dependências
pnpm dev                # shared build + api (4000) + web (5173)
pnpm build              # build de todos os pacotes
pnpm lint               # ESLint
pnpm test               # Vitest em todos os pacotes
pnpm seed               # sincroniza content/ e labs/ no SQLite
pnpm labs-build         # build das imagens cyberquest/*
pnpm labs-clean         # remove containers/redes gerenciados
make dev | build | test | seed | labs-build | labs-clean
```

## Estrutura

- `packages/shared` — tipos, schemas zod, constantes e regras puras de gamificação.
- `apps/api` — Express + TypeScript + SQLite (better-sqlite3), migrations em `src/db/migrations`, módulos em `src/modules`, jobs em `src/jobs`.
- `apps/web` — React 18 + Vite + Tailwind; páginas em `src/pages`, componentes em `src/components`, clientes em `src/lib`.
- `content/tracks/<trilha>/track.yml`, `<modulo>/module.yml` e lições `.md` com frontmatter.
- `labs/images/<imagem>/Dockerfile` e `labs/manifests/<lab>.yml`.
- `docs/` — decisões, backlog, guias de conteúdo e de labs.

## Convenções

- TypeScript strict; sem `any` implícito. Código/rotas/commits em inglês; UI/conteúdo/erros em PT-BR.
- API em camadas: `routes → controller → service → repository`; regras puras no shared.
- SQL sempre parametrizado. Validação zod em toda entrada. Nunca expor gabaritos/flags em endpoints de leitura.
- Cookies: httpOnly, SameSite=Lax, Secure em produção. CSRF por verificação de Origin + SameSite.
- Labs: rede interna, cap-drop, no-new-privileges, nunca privileged/socket, limites, TTL, flags HMAC por sessão.
- Conteúdo ofensivo só contra alvos descartáveis da plataforma, sempre com a correção/defesa.
- Slugs de `curriculo/` são imutáveis.
