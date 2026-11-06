# PLANO_CYBERQUEST.md — Plataforma gamificada de Hacking Ético (PT-BR)

> **Leitor deste documento: uma IA de desenvolvimento (opencode).**
> Este arquivo é a fonte única de verdade do projeto. Leia-o inteiro antes de escrever qualquer código.
> Nome do projeto: **CyberQuest** (provisório, centralizado em uma constante `APP_NAME` para troca fácil).

---

## 0. Instruções de execução para a IA (LEIA PRIMEIRO)

1. **Execute o projeto inteiro, fase por fase (seção 16), sem parar para pedir confirmação.** Quando houver ambiguidade, escolha a opção mais simples que satisfaça os critérios de aceite e registre a decisão em `docs/DECISIONS.md`.
2. **Mantenha um arquivo `PROGRESS.md` na raiz.** Após concluir cada tarefa, marque o checkbox correspondente e anote em 1 linha o que foi feito. Se a sessão for interrompida, retome a partir dele. Ao iniciar, se `PROGRESS.md` já existir, continue de onde parou.
3. **Crie também um `AGENTS.md`** na raiz com: comandos de build/test/lint/dev, estrutura de pastas e convenções (resumo das seções 3, 4 e 13). Isso serve de memória curta para você em contextos longos.
4. **Escreva todo texto de interface, conteúdo educacional, mensagens de erro e comentários de documentação em Português (BR).** Código, nomes de variáveis, rotas e commits em inglês.
5. **Qualidade mínima por fase:** o projeto deve compilar (`pnpm build`), passar no lint e nos testes da fase antes de avançar.
6. **Priorize um MVP funcional ponta a ponta** (fases 1–6) antes de refinamentos. Não deixe `TODO` sem registrar em `PROGRESS.md`.
7. **Não invente dependências desnecessárias.** Use as listadas na seção 3; se precisar de outra, justifique em `DECISIONS.md`.
8. **Escopo ético inegociável (seção 9.6):** nenhum conteúdo ou lab pode instruir ataques contra sistemas reais de terceiros. Todo exercício ofensivo ocorre apenas em alvos descartáveis, isolados e criados pela plataforma.
9. **Conteúdo educacional:** antes da Fase 3, leia `curriculo/README.md` e os arquivos de trilha. Eles são a especificação de cada lição (seção 10).
10. **Ao terminar**, gere um `README.md` com instruções de instalação, execução, estrutura, como criar conteúdo e como criar labs.

---

## 1. Visão geral

### 1.1 Objetivo
Uma plataforma web para **aprender cibersegurança com foco em hacking ético**, no estilo do Codedex: trilhas visuais, lições curtas, prática imediata, gamificação forte e tom divertido. O conteúdo segue a estrutura do roadmap **roadmap.sh/cyber-security** (fundamentos de TI → redes → conceitos de segurança → criptografia → web → pentest → blue team → cloud → carreira).

### 1.2 Público
Iniciante a intermediário, falante de português brasileiro, sem pré-requisito além de saber usar um computador. Uso inicial: **local/pessoal** (um estudante rodando na própria máquina), mas a arquitetura deve suportar múltiplos usuários com contas.

### 1.3 Diferencial
Labs **reais em Docker** (terminal de verdade dentro do navegador contra alvos vulneráveis isolados) combinados com lições interativas e gamificação.

### 1.4 Premissas assumidas
- **Ambiente do usuário: Windows 10/11 com WSL2 (Ubuntu).** Todo o desenvolvimento e execução acontece **dentro do WSL2**, com Docker Desktop (integração WSL2 ativada) ou Docker Engine instalado no WSL, e Node.js 20+ instalado no WSL (via nvm). Ver seção 15.1.
- Execução local por padrão; deploy público multiusuário é fase futura (seção 17) e exige endurecimento extra.
- Sem dependência de serviços pagos. Nenhuma chamada a APIs externas em tempo de execução.

---

## 2. Escopo

### 2.1 MVP (obrigatório nesta execução)
- Cadastro/login, perfil, progresso persistente.
- Mapa de trilhas → módulos → lições, com desbloqueio progressivo.
- Lições em Markdown com exercícios interativos (quiz, ordenar, completar comando, terminal simulado).
- Sistema de XP, níveis, moedas (Bits), streak, conquistas, ranking semanal.
- **Labs Docker** com terminal web (xterm.js), alvo vulnerável, validação de flag dinâmica, dicas e writeup pós-conclusão.
- Conteúdo completo das Trilhas 0 a 3 e pelo menos 1 lab por trilha de 4 a 6 (restante com lições-esqueleto reais, ver seção 10).
- Painel do aluno, página de conquistas, página de ranking, página de configurações.
- docker-compose para subir tudo, seeds, testes, README.

### 2.2 Fora do MVP (registrar como backlog em `docs/BACKLOG.md`)
Ligas competitivas multiusuário, modo equipe/CTF ao vivo, deploy público, certificados em PDF, editor de conteúdo via UI, app mobile, integração com TryHackMe/HackTheBox.

---

## 3. Stack (fixa)

| Camada | Tecnologia |
|---|---|
| Monorepo | **pnpm workspaces** |
| Frontend | **React 18 + Vite + TypeScript**, React Router, TanStack Query, Zustand (estado de UI), Tailwind CSS, Framer Motion, lucide-react, canvas-confetti |
| Markdown | react-markdown + remark-gfm + rehype-highlight (ou shiki) |
| Terminal web | **xterm.js** (+ addon-fit) via WebSocket |
| Backend | **Node 20 + Express + TypeScript** |
| Banco | **SQLite** via `better-sqlite3` (migrations SQL versionadas, sem ORM pesado) |
| Validação | **zod** (schemas compartilhados em `packages/shared`) |
| Auth | Senha com `@node-rs/argon2` (argon2id), sessão via **JWT em cookie httpOnly**, SameSite=Lax |
| Segurança HTTP | helmet, express-rate-limit, cors restrito, validação de entrada em todas as rotas |
| Docker | `dockerode` (API do Docker) + `ws` (WebSocket) |
| Jobs | `node-cron` (limpeza de labs expirados, reset de ranking semanal, verificação de streak) |
| Logs | pino |
| Testes | Vitest (unit/integration), supertest (API), Playwright (1 smoke test e2e opcional) |
| Lint/format | ESLint + Prettier + TypeScript strict |

---

## 4. Estrutura do repositório

```
cyberquest/
├── AGENTS.md
├── PROGRESS.md
├── README.md
├── docker-compose.yml          # api + web + build das imagens de lab
├── Makefile                    # atalhos: dev, build, test, seed, labs-build
├── .env.example
├── pnpm-workspace.yaml
├── package.json
├── docs/
│   ├── DECISIONS.md
│   ├── BACKLOG.md
│   ├── CONTENT_GUIDE.md        # como escrever lições
│   └── LAB_GUIDE.md            # como criar labs
├── packages/
│   └── shared/                 # tipos TS + schemas zod + constantes de gamificação
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── db/ (connection.ts, migrate.ts, migrations/*.sql, seed.ts)
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── content/        # lê /content e serve trilhas/lições
│   │   │   │   ├── progress/
│   │   │   │   ├── gamification/   # xp, level, streak, badges, ranking
│   │   │   │   ├── exercises/      # correção server-side
│   │   │   │   └── labs/           # docker orchestration + ws terminal
│   │   │   ├── middleware/
│   │   │   ├── jobs/
│   │   │   └── utils/
│   │   └── tests/
│   └── web/
│       ├── src/
│       │   ├── main.tsx, App.tsx, routes.tsx
│       │   ├── pages/
│       │   ├── components/ (ui/, lesson/, exercises/, labs/, gamification/, layout/)
│       │   ├── hooks/, lib/, store/, styles/
│       │   └── assets/ (mascote SVG, ícones de badges)
│       └── tests/
├── content/                    # CONTEÚDO EDUCACIONAL (Markdown/YAML), versionado
│   ├── tracks/
│   │   └── 00-boas-vindas/
│   │       ├── track.yml
│   │       └── 01-etica-e-lei/
│   │           ├── module.yml
│   │           ├── 01-o-que-e-hacker-etico.md
│   │           └── ...
│   └── achievements.yml
└── labs/                       # DEFINIÇÕES DE LABS
    ├── images/
    │   ├── attacker/Dockerfile
    │   ├── linux-basics/Dockerfile
    │   ├── net-target/Dockerfile
    │   └── web-sqli/ (Dockerfile + app vulnerável própria)
    └── manifests/
        ├── linux-basics.yml
        └── ...
```

---

## 5. Modelo de dados (SQLite)

Conteúdo (trilhas, módulos, lições, labs) vive em arquivos em `/content` e `/labs`. O comando `pnpm seed` lê esses arquivos e **sincroniza** (upsert) as tabelas de catálogo, preservando o progresso dos usuários (chave = `slug`).

```sql
-- Usuários
users(id INTEGER PK, username TEXT UNIQUE, email TEXT UNIQUE, password_hash TEXT,
      display_name TEXT, avatar_id TEXT DEFAULT 'byte-default', role TEXT DEFAULT 'student',
      xp_total INTEGER DEFAULT 0, level INTEGER DEFAULT 1, bits INTEGER DEFAULT 0,
      streak_current INTEGER DEFAULT 0, streak_best INTEGER DEFAULT 0,
      streak_freezes INTEGER DEFAULT 0, last_activity_date TEXT, created_at TEXT)

-- Catálogo (sincronizado do /content)
tracks(id PK, slug UNIQUE, title, description, icon, color, position INTEGER)
modules(id PK, track_id FK, slug UNIQUE, title, description, position, xp_reward)
lessons(id PK, module_id FK, slug UNIQUE, title, kind TEXT,   -- 'lesson' | 'lab' | 'boss'
        difficulty INTEGER, est_minutes INTEGER, xp_reward INTEGER, position,
        content_path TEXT, lab_slug TEXT NULL)
exercises(id PK, lesson_id FK, position, type TEXT, payload_json TEXT, xp INTEGER)

-- Progresso
user_lessons(user_id, lesson_id, status TEXT,        -- 'locked'|'available'|'in_progress'|'completed'
             best_score INTEGER, attempts INTEGER, completed_at TEXT, PRIMARY KEY(user_id, lesson_id))
exercise_attempts(id PK, user_id, exercise_id, correct INTEGER, answer_json TEXT, created_at TEXT)

-- Gamificação
xp_events(id PK, user_id, source_type TEXT, source_id TEXT, amount INTEGER, created_at TEXT)
bit_events(id PK, user_id, reason TEXT, amount INTEGER, created_at TEXT)
achievements(id PK, slug UNIQUE, title, description, icon, rarity TEXT, criteria_json TEXT)
user_achievements(user_id, achievement_id, unlocked_at, PRIMARY KEY(user_id, achievement_id))
weekly_xp(user_id, week_start TEXT, xp INTEGER, PRIMARY KEY(user_id, week_start))
daily_challenges(date TEXT PK, exercise_id FK, bonus_xp INTEGER)
review_queue(user_id, exercise_id, next_review_at TEXT, interval_days INTEGER, ease REAL,
             PRIMARY KEY(user_id, exercise_id))

-- Labs
lab_templates(id PK, slug UNIQUE, title, difficulty INTEGER, ttl_minutes INTEGER,
              xp_reward INTEGER, manifest_path TEXT)
lab_sessions(id TEXT PK (uuid), user_id, lab_slug, status TEXT,  -- 'starting'|'running'|'stopped'|'expired'|'error'
             network_id TEXT, container_ids_json TEXT, proxy_ports_json TEXT,
             nonce TEXT, started_at TEXT, expires_at TEXT, stopped_at TEXT)
lab_objectives_done(session_id, user_id, objective_id TEXT, completed_at TEXT,
                    hints_used INTEGER, PRIMARY KEY(user_id, lab_slug, objective_id))
hint_usage(user_id, scope TEXT, scope_id TEXT, hint_index INTEGER, cost_bits INTEGER, created_at TEXT)
```

Crie índices em chaves estrangeiras e em `xp_events(user_id, created_at)`. Use transações para qualquer operação que conceda XP/Bits.

---

## 6. API REST (prefixo `/api`)

**Auth**
- `POST /auth/register` `{username,email,password}` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me`

**Conteúdo e progresso**
- `GET /tracks` → trilhas com % de conclusão do usuário
- `GET /tracks/:slug` → módulos e lições com status
- `GET /lessons/:slug` → markdown renderizável + exercícios (**sem** as respostas corretas)
- `POST /lessons/:slug/start` · `POST /lessons/:slug/complete`
- `POST /exercises/:id/answer` `{answer}` → `{correct, explanation, xpGained, ...}` (correção **sempre no servidor**)
- `GET /review/due` → exercícios de revisão espaçada devidos hoje

**Gamificação**
- `GET /me/stats` (xp, nível, progresso até o próximo, streak, bits)
- `GET /me/achievements` · `GET /achievements`
- `GET /leaderboard/weekly` · `GET /leaderboard/all-time`
- `GET /daily-challenge` · `POST /daily-challenge/answer`
- `POST /shop/streak-freeze` (gasta Bits)
- `POST /me/avatar` (escolhe item cosmético já desbloqueado)

**Labs**
- `GET /labs` · `GET /labs/:slug` (descrição, objetivos, dificuldade — sem flags)
- `POST /labs/:slug/start` → cria sessão (máx. 1 ativa por usuário)
- `GET /lab-sessions/:id` (status, tempo restante, portas de proxy)
- `POST /lab-sessions/:id/extend` (uma vez, +15 min) · `DELETE /lab-sessions/:id` (encerrar)
- `POST /lab-sessions/:id/flag` `{objectiveId, flag}` → valida e concede XP
- `POST /lab-sessions/:id/hint` `{objectiveId}` → revela próxima dica (custa Bits)
- `WS /ws/lab-sessions/:id/terminal` → terminal interativo (autenticado por cookie)

Formato de erro padrão: `{ "error": { "code": "STRING", "message": "PT-BR legível" } }`.

---

## 7. Gamificação (o coração do produto)

### 7.1 XP e níveis
- XP acumulado para atingir o nível `L`: `xpForLevel(L) = 50 * L * (L - 1)` (L1=0, L2=100, L3=300, L4=600…). Implementar em `packages/shared`.
- Fontes de XP: exercício correto (5–15), lição concluída (20–60 por dificuldade), **lição perfeita** (+50% sem erros), módulo concluído (bônus), lab (100–500 conforme dificuldade), objetivo de lab (parcelas), desafio diário, conquistas.
- Dica usada em lab reduz XP do objetivo em 20% por dica (mínimo 40% do valor).
- **Primeira vez no dia**: +10 XP de bônus de "presença".

### 7.2 Títulos de nível (rank)
| Nível | Título |
|---|---|
| 1–3 | Curioso(a) |
| 4–6 | Aprendiz de Shell |
| 7–10 | Analista Júnior |
| 11–15 | Caçador(a) de Bugs |
| 16–22 | Pentester |
| 23–30 | Red Teamer |
| 31+ | Lenda do Kernel |

### 7.3 Moeda: **Bits**
Ganhos: lições, labs, streak de 7/30 dias, conquistas. Gastos: **congelar streak** (50 Bits), **comprar dica extra** (10–30 Bits), **itens cosméticos** do avatar/tema do terminal (loja simples, 6–10 itens seed).

### 7.4 Streak
- Conta dias consecutivos com ao menos 1 atividade que gere XP. Fuso horário do usuário (guardar `timezone` em `users`, padrão `America/Sao_Paulo`).
- **Streak freeze** salva 1 dia perdido (máx. 2 acumulados). Job diário reavalia streaks.
- Marcos (3, 7, 14, 30, 100 dias) dão Bits + conquista + animação.

### 7.5 Conquistas (badges) — definidas em `content/achievements.yml`
Raridades: comum, rara, épica, lendária. Mínimo de 25 no seed. Exemplos:
- *Primeiro Byte* (1ª lição) · *Hello, Shell* (1º lab concluído) · *Sem Dicas* (lab sem dicas)
- *Maratonista* (streak 7) · *Persistente* (streak 30)
- *Primeiro Sangue* (1º a validar uma flag de um lab novo, se multiusuário) — no modo local, "Primeira Flag"
- *Cartógrafo* (completar todas as lições de Redes) · *Injeção Letal* (lab de SQLi) · *Criptógrafo* (trilha 3 completa)
- *Coruja* (estudar após 23h) · *Madrugador* (antes das 6h) · *Perfeccionista* (10 lições perfeitas)
- *Colecionador* (10 conquistas) · *Lenda* (nível 31)
Avaliar conquistas num serviço único `evaluateAchievements(userId, event)` chamado após eventos relevantes; disparar toast animado no frontend.

### 7.6 Mapa de trilhas (estilo "jogo")
A tela principal mostra a trilha como **mapa de nós conectados** (caminho sinuoso), com estados: bloqueado (cadeado), disponível (pulsando), concluído (check com estrelas 1–3 conforme desempenho). Cada módulo termina com um **Boss Fight** (desafio combinado: 5–8 exercícios cronometrados ou um mini-lab).

### 7.7 Mecânicas extras (incluir no MVP as marcadas ✅)
- ✅ **Desafio diário** (1 exercício aleatório de conteúdo já visto + bônus de XP).
- ✅ **Revisão espaçada** (SM-2 simplificado sobre exercícios errados/concluídos) com card "Revisão do dia".
- ✅ **Estrelas por lição** (1–3 conforme erros).
- ✅ **Mascote "Byte"** (gatinho de capuz, SVG original) que reage: comemora, incentiva ao errar, lembra do streak.
- ✅ **Ranking semanal** (XP da semana, reset segunda 00:00) e all-time.
- ✅ **Dicas progressivas** em labs (custam Bits e XP).
- ✅ **Writeup desbloqueável**: após concluir um lab, mostrar o passo a passo explicado.
- ✅ **Terminal temático** (cores desbloqueáveis na loja).
- ⏭️ Fase 2: ligas semanais por tiers (Bronze→Diamante), eventos sazonais ("Semana do Phishing"), modo Red vs Blue Team, perfil público compartilhável, certificados PDF por trilha, "Modo Hardcore" (sem dicas/sem revisão, XP ×2), metas semanais personalizáveis, modo desafio entre amigos.

---

## 8. Tipos de exercício (corrigidos no servidor)

Cada exercício é definido em frontmatter/YAML na lição. Tipos:

| `type` | Descrição | Payload (resumo) |
|---|---|---|
| `single_choice` | Múltipla escolha única | `question, options[], answerIndex, explanation` |
| `multi_choice` | Várias corretas | `options[], answerIndexes[]` |
| `true_false` | Verdadeiro/Falso | `statement, answer` |
| `order` | Ordenar etapas (ex.: fases do pentest) | `items[], correctOrder[]` |
| `match` | Ligar pares (ex.: porta ↔ serviço) | `pairs[[a,b]]` |
| `fill_command` | Completar um comando | `template: "nmap ___ 10.0.0.5", blanks[], accepted[][]` |
| `sim_terminal` | **Terminal simulado** no navegador (sem Docker) com FS/comandos virtuais, validando estado final | `scenario: ref, goal, allowedCommands[]` |
| `code_review` | Marcar linhas vulneráveis num trecho | `code, vulnerableLines[]` |
| `flag` | Digitar uma flag estática (conteúdo teórico/CTF leve) | `flagHash` (nunca em texto puro) |

**Terminal simulado (`sim_terminal`)**: implementar em `apps/web/src/lib/simshell/` um interpretador mínimo (ls, cd, cat, pwd, grep, echo, whoami, id, find, chmod, ping/nslookup fake etc.) sobre um sistema de arquivos virtual definido em JSON. A validação final é enviada ao servidor com o histórico de comandos e o estado final para correção. É usado nas lições introdutórias para treinar sem precisar de container.

---

## 9. Sistema de Labs com Docker (parte mais crítica)

### 9.1 Conceito
Cada sessão de lab cria, sob demanda e de forma **efêmera**:
1. Uma **rede Docker interna** exclusiva (`internal: true`, sem acesso à internet nem ao host).
2. Um container **attacker** (terminal do aluno, com ferramentas de pentest).
3. Um ou mais containers **target** (alvos vulneráveis).
4. Opcionalmente um **proxy sidecar** para o aluno abrir o alvo web no navegador.

O aluno acessa o terminal do container attacker via **xterm.js** (WebSocket → `docker exec` com TTY).

### 9.2 Manifesto de lab (`labs/manifests/<slug>.yml`)
```yaml
slug: web-sqli-login
title: "Bypass de Login com SQL Injection"
difficulty: 2            # 1..5
ttl_minutes: 60
xp_reward: 250
description: |
  A empresa fictícia "Padaria Byte" tem um painel de login. Seu objetivo é...
network:
  internal: true
containers:
  attacker:
    image: cyberquest/attacker:latest
    hostname: attacker
  targets:
    - name: webapp
      image: cyberquest/web-sqli:latest
      hostname: padaria.lab
      env:
        FLAG_FILE: /flag.txt         # flag injetada em runtime (ver 9.4)
      expose_web_port: 8080           # gera proxy sidecar para o navegador
      healthcheck: { path: "/", timeout_s: 30 }
objectives:
  - id: find-login
    title: "Encontrar o painel de login"
    xp: 40
    flag_mode: dynamic
    hints:
      - { text: "Tente enumerar diretórios comuns.", cost_bits: 10 }
      - { text: "O diretório se chama /admin.", cost_bits: 20 }
  - id: bypass-login
    title: "Entrar como administrador sem saber a senha"
    xp: 110
    flag_mode: dynamic
writeup: writeups/web-sqli-login.md
```

### 9.3 Imagens de lab (build local via `make labs-build`)
Preferir **Dockerfiles próprios e pequenos** no repositório (controle total das flags e do escopo). Criar no MVP:
- `cyberquest/attacker` — base Debian/Ubuntu slim com: bash, nmap, netcat-openbsd, curl, wget, hydra, sqlmap, gobuster, nikto, john, tcpdump, tshark, python3, dnsutils, whois, openssh-client, vim/nano. Usuário **não-root** `student` (sudo restrito não é necessário). Prompt PS1 temático.
- `cyberquest/linux-basics` — shell com arquivos/permissões para treinar comandos.
- `cyberquest/net-target` — serviços simples e intencionalmente expostos (SSH com credencial fraca fictícia, HTTP, FTP anônimo) para recon/enumeração.
- `cyberquest/web-sqli` — mini-app (Node ou Python/Flask) com login vulnerável a SQLi + XSS refletido + IDOR em rotas distintas.
- Opcionais (documentar como "alvos extras"): `bkimminich/juice-shop`, `webgoat/webgoat` e uma imagem pública de DVWA. Não baixar automaticamente no build; só quando o aluno iniciar o lab que a use.

### 9.4 Flags dinâmicas por sessão
- `flag = "CQ{" + hmac_sha256(SECRET, userId + ":" + objectiveId + ":" + sessionNonce).slice(0, 24) + "}"`.
- A flag é escrita no container alvo em runtime (via `putArchive` ou variável de ambiente lida por script de entrada), nunca baked na imagem.
- `POST /lab-sessions/:id/flag` recalcula o HMAC e compara em tempo constante. Flags não aparecem em nenhuma resposta da API de catálogo.
- Impede compartilhamento de flags entre usuários/sessões.

### 9.5 Ciclo de vida e orquestração (`apps/api/src/modules/labs/`)
- `LabOrchestrator` com métodos: `start(user, labSlug)`, `stop(sessionId)`, `extend(sessionId)`, `getStatus`, `cleanupExpired()`.
- Passos do `start`: validar limite (1 sessão ativa por usuário; máx. global configurável `MAX_CONCURRENT_LABS=3`) → criar rede → criar/iniciar targets e aguardar healthcheck → criar attacker → (se `expose_web_port`) criar sidecar proxy publicado em `127.0.0.1:<porta aleatória livre>` → salvar sessão → retornar status.
- Em **qualquer falha**, executar rollback completo (remover containers/rede criados).
- **Cleanup**: job a cada minuto encerra sessões expiradas; ao subir a API, remover recursos órfãos com label `cyberquest.managed=true`.
- Todos os recursos criados recebem labels: `cyberquest.managed=true`, `cyberquest.session=<id>`, `cyberquest.user=<id>`.
- **Terminal WS**: autenticar cookie → verificar que a sessão pertence ao usuário → `container.exec({Cmd:["/bin/bash"], Tty:true, AttachStdin:true, AttachStdout:true, AttachStderr:true, User:"student"})` → pipe bidirecional com o socket; suportar resize (`{type:"resize",cols,rows}`); fechar exec ao desconectar.
- **Proxy sidecar** (modo local): container leve (ex.: `alpine/socat` ou nginx) conectado à rede interna do lab **e** à bridge padrão, publicando a porta apenas em `127.0.0.1`. Encaminha somente para a porta web do target. Frontend mostra botão "Abrir alvo no navegador" (nova aba).

### 9.6 Segurança dos labs (obrigatório)
1. Rede do lab com `Internal: true` → sem egress para internet; attacker e targets não alcançam o host.
2. Containers: `--cap-drop=ALL` (adicionar apenas o estritamente necessário, ex.: `NET_RAW` no attacker para nmap/tcpdump, `NET_BIND_SERVICE` se preciso), `no-new-privileges`, **nunca** `--privileged`, **nunca** montar o socket do Docker nem diretórios do host dentro dos containers de lab.
3. Limites: `Memory` (512 MB attacker / 512 MB cada target), `NanoCpus` (≈1 CPU), `PidsLimit` (256), `ReadonlyRootfs` nos targets quando possível, tmpfs para `/tmp`.
4. Usuário não-root dentro dos containers sempre que possível.
5. TTL obrigatório com encerramento forçado.
6. A API do Docker (`/var/run/docker.sock`) é acessível **apenas ao backend**; documentar no README o risco (acesso ao socket equivale a root no host) e recomendar rodar em máquina pessoal/VM.
7. Termo de uso exibido antes do primeiro lab (checkbox obrigatório): *"Pratico apenas nos alvos fornecidos pela plataforma e jamais contra sistemas sem autorização expressa por escrito."* Registrar aceite em `users` (`accepted_lab_terms_at`).
8. O conteúdo teórico deve sempre enquadrar técnicas ofensivas dentro de pentest autorizado, escopo, regras de engajamento e a legislação brasileira.

### 9.7 UI do lab (`/labs/:slug`)
Layout em 3 áreas: **painel esquerdo** (briefing, objetivos com checkboxes, dicas, timer), **terminal central** (xterm.js, fullscreen toggle), **barra superior** (status da sessão, estender, encerrar, abrir alvo web). Campo para submeter flag por objetivo, com animação de sucesso (confete + XP). Se o Docker não estiver disponível, a página deve mostrar um diagnóstico claro em PT-BR ("Docker não encontrado. Instale/inicie o Docker e recarregue.") e o resto da plataforma continua funcionando.

---

## 10. Currículo (baseado no roadmap.sh/cyber-security)

> O roadmap.sh/cyber-security é extenso (300+ nós). Este currículo o reorganiza em trilhas jogáveis. A IA deve **escrever o conteúdo em PT-BR**, original (sem copiar textos de terceiros), didático, com exemplos e analogias, no tom descontraído-profissional da plataforma.

> **FONTE DETALHADA DO CONTEÚDO:** a pasta `curriculo/` (ao lado deste arquivo, copie-a para a raiz do projeto) contém **um arquivo por trilha** com cada lição: slug, dificuldade, tempo, XP, objetivo, tópicos-chave, **rascunho da explicação**, exercícios sugeridos com gabarito e labs associados. Leia `curriculo/README.md` primeiro. Use esses arquivos como especificação ao gerar `content/tracks/**`; expanda os rascunhos para o texto final (600–1000 palavras), mantendo os `slug` exatos. Em caso de conflito entre esta seção e `curriculo/`, **`curriculo/` prevalece**.

**Regra de profundidade para esta execução:**
- **Trilhas 0–3: conteúdo COMPLETO** (todas as lições listadas, cada uma com texto + 3 a 6 exercícios).
- **Trilhas 4–6: pelo menos 2 lições completas por módulo + 1 lab funcional por trilha**; as demais lições com texto introdutório real (≥ 250 palavras) e 2 exercícios, marcadas `status: draft` no frontmatter.
- **Trilhas 7–10: estrutura completa (module.yml e lições) com 1 lição completa por módulo**; resto `draft`.
- Registre em `docs/CONTENT_GUIDE.md` o checklist do que está `draft`.

### Trilha 0 — Boas-vindas e Ética *(cor: verde)*
- **M0.1 Ética e Lei**: O que é hacker ético (chapéus branco/cinza/preto) · Escopo, autorização e regras de engajamento · Legislação BR (Lei 12.737/2012, Marco Civil da Internet, LGPD — visão geral e prática responsável) · Divulgação responsável e bug bounty (conceito).
- **M0.2 Seu laboratório**: Como a plataforma funciona (XP, labs, dicas) · Preparando Docker · Primeiro lab guiado "Olá, terminal" (**lab**) · Boss: Quiz de Ética.

### Trilha 1 — Fundamentos de TI *(cor: ciano)*
- **M1.1 Linux essencial**: Sistema de arquivos e navegação · Permissões e donos (chmod/chown) · Processos e serviços · Pacotes e usuários · Redirecionamento, pipes e grep/awk/sed básicos · **Lab: Linux Basics** · Boss.
- **M1.2 Redes essenciais**: Modelo OSI e TCP/IP · Endereçamento IP, sub-redes e NAT · Portas e protocolos comuns (HTTP, DNS, SSH, FTP, SMTP, SMB) · DNS em profundidade · HTTP/HTTPS (métodos, headers, cookies, status) · **Lab: Explorando a rede (curl, ping, dig, nc)** · Boss.
- **M1.3 Windows e conceitos de SO**: Estrutura do Windows (registro, serviços, AD — visão geral) · Usuários e privilégios · Linha de comando/PowerShell básico.
- **M1.4 Scripting**: Bash para automação · Python para segurança (sockets, requests, hashing) · Expressões regulares.

### Trilha 2 — Conceitos de Segurança *(cor: âmbar)*
- **M2.1 Fundamentos**: Tríade CIA e extensões · AAA (autenticação, autorização, auditoria) · Defesa em profundidade e menor privilégio · Ativos, ameaças, vulnerabilidades e riscos.
- **M2.2 Ameaças**: Tipos de malware (visão conceitual) · Engenharia social e phishing (reconhecimento e defesa) · Ataques comuns (DoS, MITM, força bruta — conceito) · Ameaças internas e cadeia de suprimentos.
- **M2.3 Frameworks e gestão**: Modelagem de ameaças (STRIDE) · MITRE ATT&CK e Cyber Kill Chain · NIST CSF, ISO 27001, CIS Controls (visão geral) · Gestão de riscos e CVSS/CVE.

### Trilha 3 — Criptografia e Autenticação *(cor: roxo)*
- **M3.1 Criptografia**: Hash vs criptografia vs encoding · Simétrica (AES) e modos · Assimétrica (RSA, ECC), troca de chaves · Assinaturas digitais · TLS/HTTPS e PKI/certificados · **Lab: hashes, encoding e cracking de hash fraco em ambiente fictício**.
- **M3.2 Autenticação e senhas**: Armazenamento seguro (salt, argon2/bcrypt) · Políticas de senha e gerenciadores · MFA/TOTP · Sessões, cookies e JWT · SSO/OAuth2/OIDC (visão geral) · Boss.

### Trilha 4 — Segurança de Redes *(cor: azul)*
Firewalls e segmentação · IDS/IPS · VPN e túneis · Wi-Fi (WPA2/3, riscos — conceito) · Captura e análise de tráfego (Wireshark/tcpdump) · Protocolos inseguros e como substituí-los · **Lab: Reconhecimento com nmap no alvo `net-target`** · Boss.

### Trilha 5 — Segurança Web *(cor: vermelho)*
Como a web funciona sob o capô · OWASP Top 10 (visão geral e mapeamento) · Injeção (SQLi) · XSS · CSRF · Controle de acesso quebrado e IDOR · Autenticação e sessão quebradas · SSRF e configurações inseguras · Proxy de interceptação (Burp/ZAP — conceito e uso) · Desenvolvimento seguro e correção das falhas · **Labs: `web-sqli-login`, `web-xss-idor`** · Boss.

### Trilha 6 — Pentest: Metodologia e Prática *(cor: laranja)*
Fases (PTES): pré-engajamento, coleta de informação, modelagem de ameaças, análise de vulnerabilidades, exploração, pós-exploração, relatório · OSINT e reconhecimento passivo (apenas sobre alvos autorizados/fictícios) · Varredura e enumeração de serviços · Scanners de vulnerabilidade · Ataques a credenciais (força bruta controlada em lab) · Escalação de privilégio Linux (conceitos e checklists) · Persistência e limpeza (conceito) · **Escrita de relatório profissional** · **Lab final: Padaria Byte (alvo multi-serviço: recon → acesso → privesc → flag)** · Boss.

### Trilha 7 — Blue Team *(cor: ciano-claro)*
Logs e telemetria · SIEM (conceitos) · Resposta a incidentes (preparação → recuperação) · Forense digital (volátil, disco, cadeia de custódia) · Hardening de Linux/Windows · Gestão de vulnerabilidades e patching · Detecção com regras (ex.: Sigma/YARA — conceito) · **Lab: analisar logs de um servidor comprometido (arquivos de log fictícios)**.

### Trilha 8 — Cloud e Containers *(cor: azul-escuro)*
Modelo de responsabilidade compartilhada · IAM e menor privilégio · Armazenamento e segredos · Segurança de containers/Docker e Kubernetes (visão geral) · IaC e DevSecOps · **Lab: auditar um `Dockerfile` e um `docker-compose.yml` inseguros**.

### Trilha 9 — Carreira e Prática Contínua *(cor: dourado)*
Mapa de carreiras (SOC, pentester, AppSec, GRC, DFIR) · Certificações (Security+, eJPT, CEH, PenTest+, OSCP — o que cobrem e para quem) · Como jogar CTFs e onde treinar · Bug bounty responsável · Portfólio e blog técnico · Aprendizado contínuo.

### Trilha 10 — Avançado *(estrutura apenas; backlog)*
Análise de malware · Engenharia reversa · Mobile · Red/Purple Team · Exploit development (conceitos) · Segurança de IA.

### 10.1 Formato de lição (`content/.../NN-slug.md`)
```markdown
---
slug: sql-injection-basico
title: "SQL Injection: quando o banco obedece ao atacante"
kind: lesson            # lesson | lab | boss
difficulty: 2           # 1..5
est_minutes: 12
xp: 40
status: complete        # complete | draft
prerequisites: [http-https-na-pratica]
exercises:
  - type: single_choice
    xp: 8
    question: "Qual é a causa raiz de uma SQL Injection?"
    options:
      - "Falta de HTTPS"
      - "Concatenar entrada do usuário diretamente na consulta"
      - "Usar senhas fracas"
      - "Banco de dados desatualizado"
    answerIndex: 1
    explanation: "A entrada vira parte do código SQL..."
  - type: fill_command
    xp: 10
    template: "sqlmap -u 'http://alvo.lab/item?id=1' ___"
    accepted: [["--batch", "--dbs"]]
---

## O que você vai aprender
...conteúdo em Markdown, com blocos de dica (> **💡 Dica:**), alerta ético (> **⚠️ Ética:**) e código...
```
Blocos especiais a suportar no renderizador: `> 💡`, `> ⚠️`, `> 🎯 Missão` (callouts estilizados).

---

## 11. Frontend: páginas, UX e design

### 11.1 Páginas
`/` (landing, para deslogado) · `/entrar` · `/cadastro` · `/painel` (home logada: continuar de onde parou, streak, desafio diário, revisão, XP da semana) · `/trilhas` (mapa) · `/trilhas/:slug` (mapa de nós da trilha) · `/licao/:slug` · `/labs` · `/labs/:slug` · `/ranking` · `/conquistas` · `/loja` · `/perfil` · `/configuracoes` · `404`.

### 11.2 Direção visual
- **Tema escuro "terminal moderno"** como padrão (alternância claro/escuro opcional).
- Paleta (CSS vars/Tailwind): fundo `#0b0f14`, superfície `#111823`, borda `#1e2a3a`, texto `#e6edf3`, primária (verde neon) `#00ff9c`, ciano `#22d3ee`, âmbar `#fbbf24`, perigo `#ff4d6d`, roxo `#a78bfa`.
- Tipografia: **Inter** (UI) e **JetBrains Mono** (código/títulos de destaque) — via pacote npm/`@fontsource`, sem CDN externo.
- Componentes com cantos arredondados, brilho sutil nos elementos ativos, microanimações (Framer Motion) em: ganho de XP, subida de nível, desbloqueio de conquista, acerto/erro de exercício.
- Mascote **Byte** (SVG original, 4 estados: neutro, feliz, triste, comemorando).
- Sons opcionais (desligados por padrão; toggle nas configurações) — usar WebAudio simples, sem arquivos pesados.
- **Responsivo** (mobile-first; o lab em mobile mostra aviso recomendando desktop). **Acessibilidade**: contraste AA, foco visível, navegação por teclado, `aria-*` nos exercícios, opção de reduzir animações (`prefers-reduced-motion`).

### 11.3 Componentes-chave
`TrackMap`, `LessonNode`, `LessonView` (markdown + exercícios sequenciais com barra de progresso), `ExerciseRenderer` (um componente por tipo), `SimTerminal`, `LabWorkspace` (xterm.js), `XPBar`, `LevelUpModal`, `AchievementToast`, `StreakFlame`, `Leaderboard`, `BitsWallet`, `MascotByte`, `Callout`, `ConfettiBurst`.

### 11.4 Estado e dados
TanStack Query para dados de servidor (invalidação após conclusão de exercício/lição), Zustand para UI (tema, sons, toasts). Rotas protegidas redirecionam para `/entrar`. Mensagens de feedback imediatas e otimistas onde seguro.

---

## 12. Segurança do próprio site (dogfooding)

- Senhas: argon2id. Rate limit forte em `/auth/*` (ex.: 10 tentativas/15 min/IP) e geral (100 req/min).
- Cookies: `httpOnly`, `sameSite=lax`, `secure` em produção. Proteção CSRF para métodos mutáveis (token duplo-submit ou verificação de `Origin`).
- Validação zod em todas as entradas; consultas SQL **sempre parametrizadas**.
- helmet com CSP restritiva; CORS apenas para a origem do frontend.
- Respostas de exercício e flags nunca expostas em endpoints de leitura.
- Autorização: toda rota de lab/sessão confere `user_id` dono.
- Logs sem dados sensíveis. Segredos só via `.env` (`JWT_SECRET`, `LAB_FLAG_SECRET`, etc.); o app deve **recusar iniciar em produção** com segredos padrão.
- Dependências: rodar `pnpm audit` no CI local e registrar o resultado.

---

## 13. Convenções de código

- TypeScript `strict`, sem `any` implícito. ESLint + Prettier configurados na raiz.
- API em camadas por módulo: `routes → controller → service → repository`. Regras de gamificação isoladas e testáveis (funções puras em `packages/shared` quando possível).
- Commits convencionais (`feat:`, `fix:`, `chore:`…), mensagens em inglês.
- Nada de lógica de negócio nos componentes React; extrair em hooks/serviços.
- Variáveis de ambiente tipadas e validadas com zod em `config.ts`.

`.env.example` mínimo:
```
NODE_ENV=development
API_PORT=4000
WEB_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
LAB_FLAG_SECRET=change-me-too
DATABASE_PATH=./data/cyberquest.db
MAX_CONCURRENT_LABS=3
LAB_DEFAULT_TTL_MINUTES=60
DOCKER_SOCKET=/var/run/docker.sock
```

---

## 14. Testes (mínimos esperados)

- **Unit**: `xpForLevel`, cálculo de XP com penalidade de dicas, streak (com freeze e fuso), SM-2, avaliação de conquistas, HMAC de flags, correção de cada tipo de exercício.
- **API (supertest)**: registro/login, bloqueio de rota sem auth, progresso de lição desbloqueando a seguinte, concessão de XP idempotente (não duplicar XP ao reenviar), ranking.
- **Labs**: testes do orquestrador com Docker mockado + 1 teste de integração opcional (pulado automaticamente se Docker indisponível) que sobe `linux-basics`, valida flag e encerra.
- **Seed**: teste que valida todos os arquivos de `/content` e `/labs` contra schemas zod (frontmatter obrigatório, slugs únicos, pré-requisitos existentes, imagens referenciadas existem).
- **E2E (opcional)**: cadastro → completar 1 lição → ver XP no painel.

---

## 15. DevOps e execução

- `docker-compose.yml`: serviços `api` (monta `/var/run/docker.sock` e `./data`) e `web` (build estático servido por nginx ou `vite preview`); perfil `labs-build` para construir as imagens de `labs/images/*`.
- `Makefile`/scripts pnpm: `dev` (api+web em paralelo com hot reload), `build`, `test`, `lint`, `seed`, `labs-build`, `labs-clean` (remove recursos `cyberquest.managed=true`).
- Fluxo de primeiro uso documentado no README: `cp .env.example .env` → `pnpm i` → `make labs-build` → `pnpm seed` → `pnpm dev`.
- Healthcheck `GET /api/health` (inclui status do Docker).

### 15.1 Windows + WSL2 (ambiente do usuário)
- **Clonar/criar o projeto dentro do sistema de arquivos do WSL** (ex.: `~/projetos/cyberquest`), **nunca** em `/mnt/c/...`. Em `/mnt/c` o I/O é lento e o hot reload do Vite pode falhar.
- Rodar opencode, pnpm, Node e Docker CLI **dentro do terminal do WSL**.
- Docker: o socket fica em `/var/run/docker.sock` dentro do WSL (Docker Desktop com "WSL integration" ativada para a distro, ou Docker Engine nativo no WSL). Manter `DOCKER_SOCKET=/var/run/docker.sock`.
- O frontend (Vite) deve escutar em `0.0.0.0` (`server.host: true`) para o navegador do Windows acessar via `http://localhost:5173`. O mesmo vale para a API (`http://localhost:4000`).
- Proxy sidecar dos labs: publicar portas em `127.0.0.1:<porta>`; o encaminhamento automático de `localhost` do WSL2 para o Windows deve permitir abrir o alvo no navegador. Documentar no README o fallback (usar o IP da distro via `hostname -I`) caso `localhost` não funcione.
- Fim de linha: arquivos `.sh`, `Dockerfile` e scripts de entrada dos labs **devem usar LF**. Criar `.gitattributes` com `* text=auto eol=lf` e `.editorconfig`.
- No README, incluir seção "Instalação no Windows (WSL2)" com: `wsl --install`, instalação do nvm/Node 20, pnpm, Docker Desktop + integração WSL, e checagem com `docker run hello-world`.
- Se o Docker não estiver acessível, a plataforma segue funcionando sem os labs (ver seção 9.7).

---

## 16. Fases de implementação (checklist para `PROGRESS.md`)

**Fase 1 — Fundação**
- [ ] Monorepo pnpm, TS, ESLint/Prettier, `packages/shared`, `AGENTS.md`, `.env.example`
- [ ] API Express base, config validada, pino, helmet, health
- [ ] SQLite + sistema de migrations + `schema` da seção 5
- [ ] Web Vite+React+Tailwind com tema, layout, roteamento
- *Aceite:* `pnpm dev` sobe api e web; `/api/health` responde; build passa.

**Fase 2 — Auth e usuários**
- [ ] Registro/login/logout/me, argon2id, cookie JWT, rate limit, CSRF
- [ ] Páginas entrar/cadastro, rotas protegidas
- *Aceite:* fluxo completo funciona; testes de auth verdes.

**Fase 3 — Conteúdo e motor de lições**
- [ ] Schemas zod do frontmatter + parser de `/content` + seed idempotente
- [ ] Endpoints de trilhas/lições; desbloqueio por pré-requisito
- [ ] Renderizador Markdown com callouts; `ExerciseRenderer` com todos os tipos (exceto labs); `SimTerminal`
- [ ] Mapa de trilhas (`TrackMap`) e página de lição com barra de progresso
- [ ] Conteúdo das **Trilhas 0–3 completo**
- *Aceite:* um usuário completa uma lição ponta a ponta; respostas corrigidas no servidor.

**Fase 4 — Gamificação**
- [ ] XP/níveis/Bits/streak (com timezone e freeze), eventos idempotentes
- [ ] Conquistas (seed ≥ 25) + toasts; mascote Byte; animações de level-up
- [ ] Painel, ranking semanal/all-time, desafio diário, revisão espaçada, loja básica
- [ ] Jobs cron (streak, reset semanal)
- *Aceite:* testes unitários da seção 14 verdes; painel reflete progresso em tempo real.

**Fase 5 — Labs Docker**
- [ ] Imagens `attacker`, `linux-basics`, `net-target`, `web-sqli` + `make labs-build`
- [ ] `LabOrchestrator`, rede interna, limites, labels, rollback, cleanup, flags dinâmicas
- [ ] WebSocket de terminal + `LabWorkspace` (xterm.js), proxy sidecar, timer, estender/encerrar
- [ ] Validação de flag, dicas pagas, writeup pós-conclusão, termo de uso
- [ ] Labs: `ola-terminal`, `linux-basics`, `explorando-a-rede`, `hashes-e-encoding`, `recon-nmap`, `web-sqli-login`, `web-xss-idor`, `padaria-byte` (final)
- *Aceite:* iniciar → usar terminal → capturar flag → XP concedido → encerrar sem containers órfãos (`docker ps -a --filter label=cyberquest.managed=true` vazio).

**Fase 6 — Conteúdo restante e polimento**
- [ ] Trilhas 4–10 conforme a regra de profundidade da seção 10
- [ ] Página de perfil/configurações, tema claro, acessibilidade, responsividade
- [ ] Estados vazios, loading skeletons, tratamento de erros amigável
- *Aceite:* navegação completa sem erros no console; Lighthouse acessibilidade ≥ 90 nas páginas principais.

**Fase 7 — Qualidade e entrega**
- [ ] Testes completos (seção 14), `pnpm audit`, revisão de segurança (seção 12)
- [ ] `README.md`, `docs/CONTENT_GUIDE.md`, `docs/LAB_GUIDE.md`, `docs/BACKLOG.md`
- [ ] Verificação final: instalação limpa seguindo o README funciona do zero
- *Aceite:* todos os checkboxes do `PROGRESS.md` marcados ou movidos justificadamente para o backlog.

---

## 17. Evolução futura (backlog sugerido)

Ligas competitivas, eventos sazonais, modo Red vs Blue, perfis públicos e certificados em PDF, editor de conteúdo via UI, multiusuário em produção (reverse proxy autenticado para alvos web, orquestração isolada em host dedicado ou gVisor/Firecracker, cotas por usuário), integração com CTFd, trilha avançada (malware, reversa, mobile), PWA/offline para lições teóricas, comunidade (fórum/comentários), geração de novos labs a partir de templates.

---

## 18. Definição de pronto (DoD) do projeto

1. Instalação do zero seguindo o README funciona.
2. Usuário cria conta, avança pelas Trilhas 0–3, ganha XP/nível/streak/conquistas e vê o ranking.
3. Ao menos **8 labs** rodam em Docker com terminal web, flags dinâmicas e encerramento limpo.
4. Todas as regras de segurança das seções 9.6 e 12 implementadas e testadas.
5. Testes verdes, lint limpo, build limpo.
6. Nenhum conteúdo incentiva ou instrui ataque a terceiros sem autorização.
