# CyberQuest

Plataforma gamificada de aprendizado de hacking ético em português, inspirada em experiências como o Codedex. O aluno percorre trilhas, resolve exercícios corrigidos no servidor, ganha XP/Bits/conquistas e pratica em laboratórios Docker descartáveis com terminal web.

> **Ética primeiro:** todo conteúdo ofensivo é direcionado apenas aos alvos descartáveis da própria plataforma e sempre acompanha a correção/defesa. Nunca use estas técnicas contra sistemas sem autorização escrita.

## Requisitos

- Node.js 20+ e pnpm 9
- Docker Engine/Desktop acessível em `/var/run/docker.sock`
- Linux, macOS ou Windows com WSL2 (recomendado: Ubuntu 24.04)

O site continua funcionando sem Docker: apenas a área de labs fica indisponível, com mensagem explicativa.

## Primeiro uso

```bash
cp .env.example .env
pnpm install
pnpm labs-build
pnpm seed
pnpm dev
```

Abra:

- Web: http://localhost:5173
- API: http://localhost:4000
- Healthcheck: http://localhost:4000/api/health

O `pnpm seed` é idempotente. Se o banco estiver vazio, a API também tenta sincronizar o catálogo ao iniciar.

## Docker Compose

Para rodar API e web em containers (web em http://localhost:8080):

```bash
export JWT_SECRET="troque-por-um-segredo-longo"
export LAB_FLAG_SECRET="troque-por-outro-segredo-longo"
pnpm labs-build                 # imagens dos labs, no daemon do host
docker compose build
docker compose up -d
```

O `api` monta `/var/run/docker.sock` e `./data`, então os labs e o SQLite ficam no host. As portas dos alvos web são publicadas em `127.0.0.1` pelo daemon do host. O `PUBLIC_ORIGIN` (padrão `http://localhost:8080`) define a origem permitida no navegador. Em produção, use TLS e um reverse proxy autenticado.

Para parar sem apagar o banco:

```bash
docker compose down
```

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development`, `test` ou `production` |
| `API_PORT` | `4000` | Porta da API |
| `WEB_ORIGIN` | `http://localhost:5173` | Origens permitidas, separadas por vírgula |
| `PUBLIC_ORIGIN` | `http://localhost:8080` | Origem usada pelo Docker Compose (web em container) |
| `JWT_SECRET` | `change-me` | Segredo do cookie de sessão; obrigatório trocar em produção |
| `LAB_FLAG_SECRET` | `change-me-too` | Segredo HMAC das flags; obrigatório trocar em produção |
| `DATABASE_PATH` | `./data/cyberquest.db` | Caminho do SQLite |
| `MAX_CONCURRENT_LABS` | `3` | Limite global de labs ativos |
| `LAB_DEFAULT_TTL_MINUTES` | `60` | TTL base dos labs |
| `DOCKER_SOCKET` | `/var/run/docker.sock` | Socket usado pelo dockerode |
| `CONTENT_DIR` | `../../content` | Diretório do currículo |
| `LABS_DIR` | `../../labs` | Diretório dos manifests/writeups |

Em produção a API recusa iniciar com os segredos padrão.

## Comandos

```bash
pnpm dev            # shared + API + web em modo desenvolvimento
pnpm build          # build de todos os pacotes
pnpm test           # Vitest em shared e API
pnpm lint           # ESLint com zero warnings
pnpm seed           # sincroniza content/ e labs/ no SQLite
pnpm labs-build     # constrói cyberquest/{attacker,target,proxy}
pnpm labs-clean     # remove containers/redes com cyberquest.managed=true
pnpm audit          # auditoria de dependências
docker compose up -d # API + web em containers (porta 8080)
make dev|build|test|lint|seed|labs-build|labs-clean
```

## Estrutura

```text
apps/api            Express + TypeScript + SQLite + dockerode
apps/web            React 18 + Vite + Tailwind + xterm.js
packages/shared     Tipos, schemas zod e regras puras de gamificação
content/tracks/     Trilhas, módulos e lições em YAML/Markdown
labs/images/        Dockerfiles das imagens attacker/target/proxy
labs/manifests/     Contratos dos labs e objetivos
labs/writeups/      Soluções liberadas após a conclusão
scripts/            Build/limpeza dos labs e cópia de assets
docs/               Guias, decisões e backlog
```

## O que está implementado

- Cadastro, login, logout, sessão httpOnly e configurações de perfil.
- 11 trilhas, 31 módulos e 104 lições; Trilhas 0–3 completas e Trilhas 4–9 com amostra completa + esqueletos reais.
- Exercícios de múltipla escolha, múltipla resposta, verdadeiro/falso, ordenação, associação, completar comando, terminal simulado, code review e flag.
- XP, níveis, títulos, Bits, streak com congelamento, conquistas, ranking, desafio diário, revisão espaçada, loja e mascote Byte.
- 10 labs Docker com terminal web, rede interna, flags HMAC por sessão, dicas pagas, writeup e limpeza por TTL.
- Painel, mapa de trilhas, lições, labs, ranking, conquistas, loja, perfil, configurações e páginas de erro.

## Segurança

- Senhas com argon2id; JWT em cookie `httpOnly`, `SameSite=Lax` e `Secure` em produção.
- CSRF por validação de `Origin` + SameSite; rate limit no login e nas rotas gerais.
- Toda entrada validada com zod; SQL sempre parametrizado; gabaritos e flags nunca aparecem em endpoints de leitura.
- Labs: `cap-drop ALL`, `no-new-privileges`, sem `privileged`, sem montar o socket Docker dentro dos containers, limites de CPU/memória/PIDs, rede interna, TTL e labels de limpeza.
- O container `attacker` não recebe flags. Cada flag é derivada de `HMAC(userId:objetivo:nonce)`.

## Testes

```bash
pnpm test
```

Cobertura atual: regras de gamificação, SM-2, payload público sem gabaritos, correção de todos os tipos de exercício, HMAC de flags, orquestrador de labs com Docker mockado (provisionamento, rollback, stop, expiração e extensão), bloqueio sem autenticação, registro, progresso, desbloqueio da próxima lição, XP idempotente, ranking e contagens do catálogo. São 25 testes.

## Adicionar conteúdo e labs

- Conteúdo: [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)
- Labs: [`docs/LAB_GUIDE.md`](docs/LAB_GUIDE.md)
- Decisões técnicas: [`docs/DECISIONS.md`](docs/DECISIONS.md)
- Pendências e riscos conhecidos: [`docs/BACKLOG.md`](docs/BACKLOG.md)

## Solução de problemas

**Docker não encontrado no healthcheck**

Verifique `docker info`. No WSL2, confirme que o Docker Desktop está iniciado e que o socket existe em `/var/run/docker.sock`.

**`docker-credential-desktop.exe: executable file not found`**

Acontece quando o `docker` é invocado sem o `PATH`/config do Docker Desktop. Em builds por scripts não interativos, um workaround local é apontar um `DOCKER_CONFIG` temporário:

```bash
DOCKER_CONFIG=/tmp/cq-docker-config pnpm labs-build
```

Isso pode emitir um warning de JSON inválido, mas o build local continua. O correto é ajustar o credential helper do Docker Desktop no ambiente.

**Banco desatualizado**

Rode `pnpm db:migrate` e depois `pnpm seed`.

**Lab preso ou containers órfãos**

Rode `pnpm labs-clean`. A API também limpa sessões expiradas a cada minuto e órfãos ao iniciar.

## Status

MVP funcional. `pnpm audit` está limpo, `docker compose` sobe API/web e o fluxo de lab (start, terminal WebSocket, captura de flag, XP e stop) foi validado em container. Instalação limpa validada (install, seed, testes e build) e Lighthouse com acessibilidade 100 nas páginas públicas e autenticadas testadas (performance 75–88 no Chrome headless/WSL). Consulte `docs/BACKLOG.md` antes de tratar o projeto como pronto para produção.
