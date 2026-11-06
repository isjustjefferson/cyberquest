# Guia dos laboratórios Docker

Os labs são ambientes descartáveis e isolados para praticar as técnicas ensinadas. Cada sessão recebe rede própria, containers próprios, flags exclusivas e TTL.

> Nunca use as técnicas dos labs fora dos alvos da plataforma. A única autorização válida é a do escopo descartável criado para a sua sessão.

## Arquitetura

```text
attacker (rede interna) ──> target(s) (rede interna)
        │
        └── proxy socat (ponte TCP) ──> 127.0.0.1:<porta livre> no host
```

- `attacker`: container com ferramentas de linha de comando. Não recebe flags.
- `target`: alvo HTTP/TCP. Recebe `CQ_LAB` e as flags da sessão.
- `proxy`: publica o alvo web em `127.0.0.1` numa porta livre, apenas quando o manifest declara `expose_web_port`.
- A rede é `bridge` com `Internal: true` por padrão.
- Todo recurso recebe labels `cyberquest.managed=true`, `cyberquest.session` e `cyberquest.user`.

O terminal web usa WebSocket + xterm.js e executa comandos no container `attacker` via `docker exec`.

## Segurança aplicada

- `CapDrop: ["ALL"]` em todos os containers.
- `SecurityOpt: ["no-new-privileges"]`.
- `NET_RAW` é adicionado somente ao attacker, para `ping`/`nmap`.
- Nunca há `privileged`, montagem do socket Docker ou acesso ao host.
- Limites de memória, CPU e PIDs via `LAB_SECURITY`.
- `/tmp` com `noexec`/`nosuid` nos alvos.
- Porta do proxy publicada apenas em `127.0.0.1`.
- Flags derivadas de `HMAC(userId:objetivo:nonce)` com `LAB_FLAG_SECRET`.
- Validação de flag em tempo constante.
- Rollback remove containers e rede se o provisionamento falhar.
- Limpeza por TTL a cada minuto, ao iniciar a API e por `pnpm labs-clean`.

## Imagens

```bash
pnpm labs-build
```

Constrói:

- `cyberquest/attacker:latest` — ferramentas ofensivas de linha de comando.
- `cyberquest/target:latest` — servidor Python único, parametrizado por `CQ_LAB`.
- `cyberquest/proxy:latest` — `socat` para publicar o alvo web no host.

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

Campos validados por zod em `apps/api/src/modules/labs/manifest.ts`:

- `slug` (`[a-z0-9-]+`) e `title`/`description`.
- `difficulty` 1–5, `ttl_minutes` 5–240, `xp_reward` >= 0.
- Imagens devem começar com `cyberquest/`.
- Pelo menos um objetivo; IDs `[a-z0-9-]+`.
- `flag_mode` aceita `dynamic` (padrão) ou `static`.
- `writeup` é um caminho relativo dentro de `labs/`.

## Flags

O servidor alvo exporta uma variável por objetivo:

```text
CQ_FLAG_<OBJETIVO_EM_MAIUSCULAS>
```

Caracteres fora de `[A-Z0-9]` viram `_`. O servidor Python converte de volta para o ID minúsculo com hífens.

Exemplo: objetivo `bypass-login` → `CQ_FLAG_BYPASS_LOGIN` → valor `CQ{...}`.

O container attacker **não** recebe essas variáveis. A flag só é validada pela API, comparando com o HMAC da sessão. Ao usar dica, o XP daquele objetivo é reduzido por `hintAdjustedXp`.

## Ciclo de vida

1. Aluno aceita o termo em `/api/me/lab-terms`.
2. `POST /api/labs/:slug/start` cria a sessão.
3. A API cria rede, alvos, attacker e, se necessário, proxy.
4. O terminal conecta no attacker.
5. Aluno envia flags em `POST /api/lab-sessions/:id/flag`.
6. Ao completar todos os objetivos, recebe XP do lab e Bits.
7. Sessão pode ser estendida uma vez ou encerrada.
8. TTL expirado, `DELETE` da sessão ou `pnpm labs-clean` removem tudo.

## Adicionar um lab

1. Crie `labs/manifests/<slug>.yml`.
2. Se o cenário for novo, implemente as rotas em `labs/images/target/server.py` usando `CQ_LAB` e `flag("objetivo")`.
3. Crie `labs/writeups/<slug>.md` com passos, comandos, flags (via API) e correção/defesa.
4. Referencie o lab em uma lição com `kind: lab` e `lab_slug`.
5. Rode `pnpm labs-build` se mudou imagens.
6. Rode `pnpm seed` para registrar o manifest.
7. Teste: iniciar, executar comandos no attacker, capturar cada flag, enviar pela API, encerrar e confirmar que não restaram containers/rede.
8. Rode `pnpm labs-clean` e confirme que o ambiente ficou limpo.

## Teste manual rápido

Com uma sessão ativa, descubra o ID da sessão na interface ou pela API. Exemplo de comando no terminal do attacker:

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

O cookie precisa ser o da sessão autenticada. Para testes automatizados completos, uma integração Docker deve ser opcional e ignorada quando Docker não estiver disponível.

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
```

**Flag inválida**

- Confirme o `objectiveId` exato do manifest.
- A flag é da sessão atual; reiniciar o lab gera novo nonce e novas flags.
- Copie a flag completa, incluindo `CQ{...}`.

## Limitações conhecidas

- Não há teste automatizado do orquestrador com Docker mockado.
- Teste de integração Docker é manual e depende do ambiente.
- `docker-compose` ainda não foi entregue.
- Em produção multiusuário, a publicação do proxy em `127.0.0.1` exige reverse proxy autenticado e orquestração em host dedicado; veja `docs/BACKLOG.md`.
