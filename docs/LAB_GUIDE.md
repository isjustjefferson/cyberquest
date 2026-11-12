# Guia dos laboratórios Docker

Os labs são ambientes descartáveis e isolados para praticar as técnicas ensinadas. Cada sessão recebe rede própria, containers próprios, flags exclusivas ou verificação automática de objetivos e TTL.

> Nunca use as técnicas dos labs fora dos alvos da plataforma. A única autorização válida é a do escopo descartável criado para a sua sessão.

## Arquitetura

```text
attacker/workstation (rede interna) ──> target(s) (rede interna)
        │
        └── proxy socat (ponte TCP) ──> 127.0.0.1:<porta livre> no host
```

- `attacker`: container com ferramentas ofensivas de linha de comando. Não recebe flags.
- `workstation`: estação DBA com `psql`, `pg_dump`, `pg_restore` e utilitários. Também não recebe flags.
- `target`: alvo HTTP/TCP ou PostgreSQL. Recebe `CQ_LAB` e, quando há objetivos de flag, as flags da sessão.
- `proxy`: publica o alvo web em `127.0.0.1` numa porta livre, apenas quando o manifest declara `expose_web_port`.
- A rede é `bridge` com `Internal: true` por padrão.
- Containers, redes e volumes recebem labels `cyberquest.managed=true`, `cyberquest.session` e `cyberquest.user`. Volumes também recebem `cyberquest.name`.

O terminal web usa WebSocket + xterm.js e executa comandos via `docker exec` no container definido em `terminal.container` (ou no `attacker`/`workstation` padrão), com o usuário definido em `terminal.user`.

## Segurança aplicada

- `CapDrop: ["ALL"]` em todos os containers.
- `SecurityOpt: ["no-new-privileges"]`.
- `NET_RAW` é adicionado somente ao attacker, para `ping`/`nmap`.
- Containers PostgreSQL recebem apenas `CHOWN`, `SETUID`, `SETGID`, `DAC_OVERRIDE` e `FOWNER`, necessários ao entrypoint oficial.
- Nunca há `privileged`, montagem do socket Docker ou acesso ao host.
- Limites de memória, CPU e PIDs via `LAB_SECURITY`; manifests podem reduzir CPU/memória por container.
- `/tmp` com `noexec`/`nosuid` nos alvos.
- Porta do proxy publicada apenas em `127.0.0.1`.
- Flags derivadas de `HMAC(userId:objetivo:nonce)` com `LAB_FLAG_SECRET`.
- Validação de flag em tempo constante.
- Objetivos com `verify` não exibem campo de flag e são corrigidos pelo estado real do container.
- Rollback remove containers, rede e volumes se o provisionamento falhar.
- Limpeza por TTL a cada minuto, ao iniciar a API e por `pnpm labs-clean`; sessões encerradas removem também os volumes efêmeros.

## Imagens

```bash
pnpm labs-build
```

Constrói:

- `cyberquest/attacker:latest` — ferramentas ofensivas de linha de comando.
- `cyberquest/target:latest` — servidor Python único, parametrizado por `CQ_LAB`.
- `cyberquest/proxy:latest` — `socat` para publicar o alvo web no host.
- `cyberquest/dba-workstation:latest` — estação PostgreSQL com `psql`, cliente `pg_dump`/`pg_restore` e utilitários.

Os labs DBA usam a imagem oficial `postgres:16`. O script de build não baixa essa imagem; na primeira sessão o Docker fará o pull, ou rode `docker pull postgres:16` antes.

Não é necessário criar uma imagem por lab. O alvo escolhe o cenário em tempo de execução:

```yaml
env:
  CQ_LAB: "web-sqli-login"
```

## Manifesto

Arquivo: `labs/manifests/<slug>.yml`.

```yaml
slug: "web-sqli-login"
title: "Bypass de login com SQL Injection"
description: "Descrição exibida ao aluno."
difficulty: 3
ttl_minutes: 35
xp_reward: 200
network:
  internal: true
containers:
  attacker:
    image: "cyberquest/attacker:latest"
    hostname: "attacker"
  targets:
    - name: "target"
      image: "cyberquest/target:latest"
      hostname: "target"
      env:
        CQ_LAB: "web-sqli-login"
      expose_web_port: 8080
      healthcheck:
        path: "/health"
        timeout_s: 30
objectives:
  - id: "bypass-login"
    title: "Faça bypass do login"
    xp: 80
    hints:
      - text: "Envie o formulário com o usuário ' OR '1'='1."
        cost_bits: 10
writeup: "writeups/web-sqli-login.md"
```

Lab DBA com PostgreSQL real e verificação automática:

```yaml
slug: "psql-primeiros-passos"
title: "Primeiros passos com psql"
description: "Conecte-se a um PostgreSQL real."
difficulty: 1
ttl_minutes: 30
xp_reward: 200
network:
  internal: true
containers:
  workstation:
    image: "cyberquest/dba-workstation:latest"
    hostname: "workstation"
  targets:
    - name: "db"
      image: "postgres:16"
      hostname: "db"
      env:
        POSTGRES_PASSWORD: "{{generated_password}}"
        POSTGRES_DB: "padaria"
      init_scripts:
        - "content/datasets/padaria_byte.sql"
      ephemeral_volumes:
        - "/var/lib/postgresql/data"
      resources:
        memory_mb: 512
        cpus: 0.5
      healthcheck:
        cmd: "pg_isready -h 127.0.0.1 -U postgres"
        timeout_s: 90
terminal:
  container: "workstation"
  user: "student"
objectives:
  - id: "explorar"
    title: "Confirme que a tabela clientes está acessível"
    xp: 40
    verify:
      type: "sql"
      container: "db"
      user: "postgres"
      database: "padaria"
      query: "SELECT count(*) > 0 FROM clientes;"
      expect:
        equals: "t"
writeup: "writeups/psql-primeiros-passos.md"
```

Campos validados por zod em `apps/api/src/modules/labs/manifest.ts`:

- `slug` (`[a-z0-9-]+`) e `title`/`description`.
- `difficulty` 1–5, `ttl_minutes` 5–240, `xp_reward` >= 0.
- Imagens devem começar com `cyberquest/` ou ser `postgres:*`.
- Deve existir `containers.attacker` ou `containers.workstation`; no máximo um dos dois.
- Pelo menos um objetivo; IDs `[a-z0-9-]+`.
- `flag_mode` aceita `dynamic` (padrão) ou `static`; não pode coexistir com `verify`.
- `writeup` é um caminho relativo dentro de `labs/`.

Campos opcionais de `targets[]`:

- `command`: substitui o `CMD` do container (array).
- `init_scripts`: arquivos `.sql`/`.sh` copiados para `/docker-entrypoint-initdb.d` antes do start.
- `files`: lista `{ source, destination }`; o arquivo é copiado via `putArchive` para um diretório existente.
- `ephemeral_volumes`: caminhos que recebem volume nomeado descartável. Volume com o mesmo `mountPath` é compartilhado entre containers. Em labs com dois PostgreSQL, use subdiretórios distintos em `PGDATA` (por exemplo, `/var/lib/postgresql/data/primary` e `/var/lib/postgresql/data/standby`) para compartilhar o volume sem misturar os clusters.
- `healthcheck.cmd`: comando executado até retornar 0; alternativa a `healthcheck.path`, também útil para validar um serviço auxiliar.
- `resources`: `memory_mb` e `cpus` para reduzir os limites globais.
- `expose_web_port`: publica a porta via proxy `socat`.

Placeholders disponíveis em `env` e `image`:

- `{{generated_password}}`: senha HMAC exclusiva da sessão.
- `${PG_MAJOR}`: versão major configurada em `LAB_PG_MAJOR` (padrão `16`).

Em `verify`:

- `type: "sql"`: executa `psql` no container e compara a saída.
- `type: "cmd"`: executa `sh -c` e compara `exit_code` e/ou saída.
- `container`/`user`/`database` selecionam onde e como executar.
- `expect.equals`, `expect.matches` (regex) e `expect.exit_code` são opcionais, mas pelo menos um é necessário.
- `psql` roda com `-X -w -At -P pager=off`, sem prompt de senha e sem pager.

## Flags

O servidor alvo exporta uma variável por objetivo:

```text
CQ_FLAG_<OBJETIVO_EM_MAIUSCULAS>
```

Caracteres fora de `[A-Z0-9]` viram `_`. O servidor Python converte de volta para o ID minúsculo com hífens.

Exemplo: objetivo `bypass-login` → `CQ_FLAG_BYPASS_LOGIN` → valor `CQ{...}`.

O container attacker/workstation **não** recebe essas variáveis. A flag só é validada pela API, comparando com o HMAC da sessão. Ao usar dica, o XP daquele objetivo é reduzido por `hintAdjustedXp`.

Objetivos com `verify` não usam flags: a API executa a verificação no container e responde apenas `passed`/`message`. A UI troca o campo de flag pelo botão **Verificar**. Para esses objetivos, o XP é concedido diretamente após a verificação bem-sucedida.

## Ciclo de vida

1. Aluno aceita o termo em `/api/me/lab-terms`.
2. `POST /api/labs/:slug/start` cria a sessão.
3. A API cria rede, alvos, attacker e, se necessário, proxy.
4. O terminal conecta no container definido em `terminal` (ou no attacker/workstation padrão).
5. Aluno envia flags em `POST /api/lab-sessions/:id/flag` ou verifica objetivos automáticos em `POST /api/lab-sessions/:id/verify` com `{ objectiveId }`.
6. Ao completar todos os objetivos, recebe XP do lab e Bits.
7. Sessão pode ser estendida uma vez ou encerrada.
8. TTL expirado, `DELETE` da sessão ou `pnpm labs-clean` removem containers, rede e volumes.

## Adicionar um lab

1. Crie `labs/manifests/<slug>.yml`.
2. Se o cenário for novo, implemente as rotas em `labs/images/target/server.py` usando `CQ_LAB` e `flag("objetivo")`, ou use `postgres:*` com `init_scripts` e `verify`.
3. Crie `labs/writeups/<slug>.md` com passos, comandos, flags (via API) e correção/defesa.
4. Referencie o lab em uma lição com `kind: lab` e `lab_slug`.
5. Rode `pnpm labs-build` se mudou imagens (e `docker pull postgres:16` se usa PostgreSQL).
6. Rode `pnpm seed` para registrar o manifest.
7. Teste: iniciar, executar comandos no terminal, capturar cada flag ou verificar cada objetivo, encerrar e confirmar que não restaram containers, redes ou volumes.
8. Rode `pnpm labs-clean` e confirme que o ambiente ficou limpo.

## Teste manual rápido

Com uma sessão ativa, descubra o ID da sessão na interface ou pela API. Exemplo de comando no terminal:

```bash
curl -s http://target:8080/
```

Envio de flag:

```bash
curl -X POST http://localhost:4000/api/lab-sessions/<id>/flag \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{"objectiveId":"bypass-login","flag":"CQ{...}"}'
```

Verificação automática:

```bash
curl -X POST http://localhost:4000/api/lab-sessions/<id>/verify \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{"objectiveId":"explorar"}'
```

O cookie precisa ser o da sessão autenticada. O teste `apps/api/tests/labs-docker.test.ts` sobe `psql-primeiros-passos`, verifica um objetivo e confirma que containers e volumes foram removidos. Ele também inicia `pitr`, `replicacao-streaming` e `resgate-padaria-byte`, confirma o streaming e a leitura na réplica e encerra tudo. O teste é ignorado quando Docker ou a imagem `dba-workstation` não estão disponíveis.

### Labs avançados de DBA

- `pitr`: a variante do laboratório usa uma cópia de recuperação gerada no preparo. O writeup explica o fluxo real com backup base, WAL arquivado, `recovery_target_time` e `recovery.signal`.
- `replicacao-streaming`: primário e standby compartilham o volume de dados em subdiretórios distintos. O script do standby espera o primário, roda `pg_basebackup -R -X stream` e inicia em recuperação contínua. O terminal fica no standby, com `PGPASSWORD` para consultar o primário.
- `resgate-padaria-byte`: usa `shared_preload_libraries=pg_stat_statements`, uma estação `workstation` e um `session-worker` que abre conexões com `pg_sleep` para esgotar o pool. O terminal fica no banco para permitir editar `pg_hba.conf`, e o post-mortem é validado por SQL.

## Depurar

**Lab não inicia**

- Verifique `GET /api/health` → campo `docker`.
- Confirme que as imagens existem: `docker images | grep cyberquest`.
- Rode `pnpm labs-build`.

**Proxy não responde**

- Confira se o manifest tem `expose_web_port: 8080`.
- Verifique se o alvo responde em `/health` dentro da rede.
- Veja os logs da API; falhas de healthcheck geram rollback.

**Container órfão**

```bash
pnpm labs-clean
docker ps -a --filter label=cyberquest.managed=true
docker network ls --filter label=cyberquest.managed=true
docker volume ls --filter label=cyberquest.managed=true
```

**Flag inválida**

- Confirme o `objectiveId` exato do manifest.
- A flag é da sessão atual; reiniciar o lab gera novo nonce e novas flags.
- Copie a flag completa, incluindo `CQ{...}`.

## Limitações conhecidas

- O teste Docker real é opcional e só roda quando o daemon e a imagem `cyberquest/dba-workstation:latest` estão disponíveis.
- A imagem `postgres:16` é baixada sob demanda; o primeiro start de um lab DBA pode demorar.
- O lab de PITR é uma simulação guiada com cópia de recuperação, não uma recuperação de WAL em uma segunda instância. A prática completa de `recovery_target_time` deve ser feita em ambiente próprio; o procedimento está no writeup.
- O lab de replicação usa dois PostgreSQL e ~1 GB de RAM; em WSL2, encerre outros labs antes de iniciá-lo.
- Em produção multiusuário, a publicação do proxy em `127.0.0.1` exige reverse proxy autenticado e orquestração em host dedicado; veja `docs/BACKLOG.md`.
