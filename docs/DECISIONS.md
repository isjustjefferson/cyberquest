# Decisões técnicas

Registro curto das decisões que moldaram o MVP e das consequências que devem ser lembradas antes de mudanças grandes.

## 1. Monorepo pnpm com pacote compartilhado

**Decisão:** `apps/api`, `apps/web` e `packages/shared` no mesmo repositório, com pnpm workspaces.

**Motivo:** tipos, schemas zod e regras puras de gamificação precisam ser idênticos no servidor e no cliente. O pacote `shared` evita duplicação e mantém a correção no servidor.

**Consequência:** `packages/shared` é construído antes da API/web em `pnpm dev`; imports usam `@cyberquest/shared`. Regras puras nunca devem ser reimplementadas na UI.

## 2. SQLite com better-sqlite3

**Decisão:** SQLite local com WAL, migrations versionadas e `better-sqlite3`.

**Motivo:** MVP single-node, instalação simples, leitura síncrona eficiente e menos infraestrutura. O schema já modela usuários, progresso, XP, Bits, conquistas, sessões de lab e revisão.

**Consequência:** não há escalabilidade horizontal pronta. Multiusuário em produção exige revisar concorrência, backups e possivelmente migrar para PostgreSQL.

## 3. Sessão por cookie JWT httpOnly

**Decisão:** JWT em cookie `cq_token` com `httpOnly`, `SameSite=Lax` e `Secure` em produção; CSRF por validação de `Origin` + SameSite.

**Motivo:** evita expor token ao JavaScript e reduz risco de XSS roubar sessão. Não há fluxo de API pública para terceiros.

**Consequência:** o frontend depende do cookie e de CORS com credenciais. Requisições server-to-server não são um caso de uso atual.

## 4. Argon2id para senhas

**Decisão:** `@node-rs/argon2` com parâmetros padrão da biblioteca.

**Motivo:** resistência a GPU/ASIC e boa recomendação atual.

**Consequência:** hashing mais caro que bcrypt; rate limit no login e cadastro é obrigatório.

## 5. Conteúdo como arquivos versionados

**Decisão:** Markdown/YAML em `content/`, sincronizado para SQLite por seed idempotente.

**Motivo:** revisão por diff, autoria simples e possibilidade de regenerar o catálogo. O banco guarda o estado do aluno, não a fonte editorial.

**Consequência:** o seed é parte do deploy. Slugs precisam ser estáveis. Conteúdo inválido falha no loader zod.

## 6. Exercícios corrigidos no servidor

**Decisão:** o endpoint público remove gabaritos; a resposta correta fica apenas no payload privado do banco e `gradeExercise` roda na API.

**Motivo:** impedir fraude trivial pelo DevTools.

**Consequência:** qualquer novo tipo de exercício precisa de schema zod, função de correção e payload público explícito. Testes devem garantir que respostas não vazem.

## 7. Trilhas 4–10 com profundidade variável

**Decisão:** Trilhas 0–3 completas; Trilhas 4–9 com as primeiras duas lições de cada módulo completas e o restante como `draft`; Trilha 10 `coming_soon` sem lições.

**Motivo:** entregar o MVP com mapa crível e experiência ponta a ponta sem fingir que todo o currículo foi revisado.

**Consequência:** o status `draft` é visível para o aluno e precisa de revisão editorial. Conquistas e contagens não devem assumir que todas as lições estão completas.

## 8. Imagem de alvo única e parametrizada

**Decisão:** em vez de uma imagem por cenário, `cyberquest/target` lê `CQ_LAB` e serve o cenário correspondente.

**Motivo:** menos builds, menos manutenção e um único servidor Python para todos os labs. O isolamento continua sendo por container e rede.

**Consequência:** todos os cenários compartilham o mesmo código; uma mudança no servidor pode afetar vários labs. Testes manuais por lab continuam necessários.

## 9. Flags dinâmicas por sessão

**Decisão:** `CQ{ HMAC-SHA256(LAB_FLAG_SECRET, userId:objectiveId:nonce)[0:24] }`, nonce aleatório por sessão.

**Motivo:** impede compartilhar flag entre usuários/sessões e evita armazenar a flag em texto puro.

**Consequência:** reiniciar o lab invalida flags antigas. O segredo é crítico: em produção, a API recusa o valor padrão. Trocar o segredo invalida sessões em andamento.

## 10. Attacker sem flags e rede interna

**Decisão:** flags são enviadas apenas aos containers de alvo; o attacker entra na rede interna e recebe apenas `NET_RAW`.

**Motivo:** o aluno deve obter a flag explorando o alvo, não lendo variáveis de ambiente do próprio terminal. Também reduz superfície de ataque.

**Consequência:** qualquer novo container que precise de flag deve ser declarado como target no manifest, nunca como attacker/workstation. Labs com terminal dentro de um target devem usar `verify` em vez de flags, para o aluno não ler o próprio segredo no ambiente.

## 11. Proxy socat para acesso web

**Decisão:** alvos web são publicados no host por um container `socat` em porta livre, ligado somente a `127.0.0.1`.

**Motivo:** permitir abrir formulários no navegador sem expor a rede interna diretamente. O terminal continua sendo o caminho principal.

**Consequência:** o proxy precisa ser conectado à rede interna após subir. Em produção, a porta `127.0.0.1` exige reverse proxy autenticado para acesso remoto.

## 12. Seed de conteúdo no startup e cron diário

**Decisão:** a API sincroniza o catálogo se o banco estiver vazio e novamente todo dia às 04:00.

**Motivo:** facilitar primeiro uso e manter manifests/conteúdo atualizados sem reiniciar.

**Consequência:** erros de conteúdo aparecem em log durante o cron e não derrubam a API. O seed explícito continua sendo o caminho recomendado em deploy.

## 13. Testes de integração com banco temporário

**Decisão:** testes da API usam SQLite em arquivo temporário e `syncCatalog` real, não um mock de conteúdo.

**Motivo:** validar loader, seed, auth, progresso e gamificação no mesmo caminho da produção.

**Consequência:** os testes dependem de `content/` e `labs/` válidos. Isso é intencional: um catálogo quebrado deve falhar no CI.

## 14. Atualização major de dependências

**Decisão:** atualizar zod 3 → 4, react-router 6 → 7, dockerode 4 → 5 e node-cron 3 → 4. Para o frontend, usar Vite 7, `@vitejs/plugin-react` 5 e Vitest 4, em vez de Vite 8/Vitest 5, porque o projeto ainda suporta Node 20.

**Motivo:** zerar as vulnerabilidades reportadas sem elevar o requisito mínimo de runtime. Vitest 5 exige Node 22, então Vitest 4 foi a versão compatível com Vite 7 e Node 20. `minimatch` 11 é forçado via override do pnpm porque a versão transitiva do `@typescript-eslint` ainda estava vulnerável.

**Consequência:** `pnpm audit` não reporta vulnerabilidades conhecidas. Breaking changes tratados: `z.record` com chave e valor, `ZodError.issues` e os tipos nomeados do `node-cron`. Antes de subir para Vite 8/Vitest 5, será necessário elevar o requisito de Node para 22.

## 15. Docker Compose com API no host Docker

**Decisão:** `docker-compose.yml` sobe `api` e `web`, monta `/var/run/docker.sock` e `./data` na API e serve o frontend por nginx na porta 8080. As imagens dos labs são construídas no daemon do host (`pnpm labs-build` ou profile `labs-build`).

**Motivo:** reproduzir o deploy local com um comando sem empacotar o daemon Docker dentro da API. O orquestrador continua criando containers irmãos no host, com portas de proxy publicadas em `127.0.0.1`.

**Consequência:** a API precisa de permissão no socket Docker e o entrypoint adiciona o usuário `node` ao grupo do socket. A porta publicada pelos labs fica no host, não no container da API; em produção isso exige reverse proxy autenticado e TLS. `JWT_SECRET`, `LAB_FLAG_SECRET` e `PUBLIC_ORIGIN` são obrigatórios/ajustáveis no ambiente do Compose.

## 16. Área como raiz do catálogo

**Decisão:** a hierarquia passa a ser Área → Trilha → Módulo → Lição. As trilhas existentes foram associadas a `ciberseguranca`; `bancos-de-dados` foi criada como área ativa independente.

**Motivo:** permitir expansão para outros domínios sem misturar progressão, XP, ranking e conquistas de especialidades diferentes.

**Consequência:** toda trilha deve ter `area` (ou herda `ciberseguranca` por compatibilidade). A UI `/trilhas` redireciona para `/areas` quando há mais de uma área ativa, e o seletor de área aparece no layout. Novos conteúdos devem declarar `area` no `track.yml`.

## 17. Progresso e XP isolados por área

**Decisão:** a cadeia de desbloqueio é calculada separadamente por área, e `xp_events.area_id` registra o XP de lições, módulos, exercícios e labs. Conquistas podem ter `area_id` nulo (globais) ou específico; filtros incluem globais + área. O ranking semanal global continua em `weekly_xp`, enquanto o ranking por área soma `xp_events`.

**Motivo:** o aluno deve poder começar Bancos de Dados sem concluir Cibersegurança, mantendo o comportamento atual das 11 trilhas existentes.

**Consequência:** consultas de progresso, ranking e conquistas precisam considerar a área. Eventos sem área (presença, desafio diário, conquistas globais) não entram no XP filtrado por área. `achievements.area_id` foi adicionado na migração `002_areas.sql` para viabilizar o filtro.

## 18. Motor SQL isolado com PGlite em worker

**Decisão:** exercícios sql_query executam em uma instância PGlite nova em memória, dentro de worker thread, com fila de 2 execuções, timeout de 3 s, limite de 500 linhas e 10 KB de SQL. O timeout começa somente depois que o dataset terminou de carregar; a carga inicial tem limite próprio de 20 s. A correção suporta result_match, state_check e plan_check.

**Motivo:** oferecer PostgreSQL real sem Docker por tentativa, com isolamento e limites previsíveis, sem deixar o tempo de carga do dataset consumir o orçamento da consulta do aluno.

**Consequência:** cada tentativa paga o custo de carregar o dataset (atualmente padaria_byte); uma otimização futura pode clonar um snapshot pré-carregado. expected_sql, check_sql e padrões de plano nunca são enviados ao cliente. O worker é copiado para dist no build e precisa existir também em imagens de produção.

## 19. Labs DBA com PostgreSQL real e verificação por estado

**Decisão:** labs de administração usam `cyberquest/dba-workstation` para o aluno e a imagem oficial `postgres:16` como target. O manifesto declara `terminal.container`/`terminal.user`, `init_scripts`, `healthcheck.cmd` e `objectives[].verify` (`sql` ou `cmd`). Senhas vêm de `HMAC(LAB_FLAG_SECRET, 'dba-password:' + nonce)`, e `verify` e `flag_mode` são mutuamente exclusivos.

**Motivo:** praticar administração real exige servidor PostgreSQL e ferramentas de cliente, não um simulador. Verificar o estado real (`SELECT`, `test -s`, `exit_code`) evita flags artificiais em tarefas operacionais e mantém o gabarito no servidor.

**Consequência:** `psql` não interativo roda com `-X -w -At -P pager=off` e o `docker exec` usa `hijack: true` + `Tty: true`; sem isso o pager ou o prompt de senha travam a verificação. Objetivos `verify` não têm flag. O teste Docker real é opcional e é ignorado sem daemon ou sem a imagem `dba-workstation`. `postgres:16` é baixado sob demanda.

## 20. Volumes efêmeros compartilhados por caminho

**Decisão:** cada `ephemeral_volumes[]` gera um volume nomeado por sessão e `mountPath`, com labels `cyberquest.managed`, `cyberquest.session`, `cyberquest.user` e `cyberquest.name`. Containers que declaram o mesmo caminho recebem o mesmo volume. `stop`, expiração, rollback e `pnpm labs-clean` removem os volumes.

**Motivo:** PostgreSQL precisa de volume gravável para o `PGDATA`, e labs de backup precisam compartilhar `/home/student` entre workstation e container auxiliar. Volumes nomeados evitam `bind mount` no host e mantêm o isolamento por sessão.

**Consequência:** nada persiste entre sessões; reiniciar o lab recria o banco. Dois containers que declaram o mesmo `mountPath` compartilham dados intencionalmente. Limpezas futuras devem remover volumes junto com containers e redes para não deixar órfãos.

## 21. SQL no desafio diário e na revisão

**Decisão:** o desafio diário pode sortear `sql_query` apenas nos modos `result_match` e `plan_check`; a resposta usa `gradeSqlExercise`. A revisão espaçada continua usando `answerExercise`, que já escolhe o corretor SQL, e o teste de integração cobre listagem e resposta de uma consulta devida.

**Motivo:** SQL é parte central da trilha DBA e deve participar da prática diária sem depender de estado mutável. Modos `state_check` ficam fora do sorteio para evitar variações de dataset e efeitos colaterais.

**Consequência:** o cliente já renderiza SQL no desafio diário via `ExerciseRenderer`. O fallback do sorteio sem histórico continua restrito a exercícios não SQL para não escolher uma consulta de uma lição ainda bloqueada.

## 22. Dois PostgreSQL no mesmo volume com PGDATA separado

**Decisão:** no lab de replicação, primário e standby compartilham o volume efêmero em `/var/lib/postgresql/data`, mas cada um usa um subdiretório (`primary` e `standby`) como `PGDATA`. O script do standby limpa apenas o próprio diretório antes do `pg_basebackup -R -X stream`.

**Motivo:** volumes são compartilhados por `mountPath`, e usar o mesmo `PGDATA` faria o standby apagar o cluster do primário. Subdiretórios preservam a limpeza de um único volume por sessão sem alterar a regra de compartilhamento usada pelo lab de backup.

**Consequência:** os manifests que rodam dois bancos precisam declarar `PGDATA` distinto. O volume continua sendo removido no stop/expiração/`labs-clean`.

## 23. Profundidade dos módulos 7–9 da trilha DBA

**Decisão:** os módulos 7–9 mantêm uma lição completa por módulo e o lab final completo; as demais ficam `draft` com pelo menos 250 palavras e 2 exercícios. O teste `dba-content.test.ts` valida explicitamente quais lições devem estar completas e a profundidade mínima das demais.

**Motivo:** cumprir a regra de profundidade do plano de expansão sem fingir revisão editorial de todo o conteúdo avançado.

**Consequência:** transformar um `draft` em `complete` exige atualizar a lista esperada no teste. Lições `draft` continuam navegáveis e podem ser concluídas.

## 24. Credenciais fixas em cenários descartáveis

**Decisão:** os labs de replicação e plantão usam credenciais fixas (`replicator123` e `app_rw_local`) dentro da rede interna descartável. A senha do superusuário `postgres` continua sendo gerada por sessão e não aparece nos scripts.

**Motivo:** scripts de inicialização do PostgreSQL não passam pelo resolvedor de placeholders do orquestrador. As credenciais fixas são parte do cenário didático e não são reutilizáveis fora da sessão.

**Consequência:** nunca use esses valores em ambientes reais. Se o resolvedor de placeholders for estendido a `init_scripts`, essas senhas podem passar a ser geradas por sessão.
