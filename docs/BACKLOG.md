# Backlog e riscos conhecidos

Itens fora do MVP ou que ainda impedem considerar o projeto "pronto para produção". Ordenados por prioridade prática.

## Antes de produção

- [ ] **Manter a auditoria no CI.** `pnpm audit` está limpo após os upgrades, mas novas advisories exigem verificação contínua.
  - Rodar `pnpm audit` em CI e revisar upgrades de patch/minor periodicamente.
  - Repetir `pnpm test`, `pnpm build`, `pnpm lint` e smoke tests de auth/labs após cada rodada.
- [ ] **Trocar segredos e revisar deploy.** `JWT_SECRET` e `LAB_FLAG_SECRET` fortes, TLS, cookie `Secure`, `WEB_ORIGIN` explícito e backups do SQLite.
- [ ] **Reverse proxy autenticado para alvos web.** O proxy publica em `127.0.0.1`; acesso remoto exige autenticação e proteção contra SSRF/port scanning.
- [ ] **Isolamento de produção dos labs.** Host dedicado ou runtime mais forte (gVisor/Firecracker), cotas por usuário e política de retenção de logs.
- [ ] **Performance do bundle inicial.** O JS principal tem ~1,2 MB (360 kB gzip) e a performance ficou em 75–88 no Lighthouse; avaliar code-splitting por rota e importação dinâmica.
- [ ] **Testes E2E de navegador.** O fluxo atual é validado por supertest, não por Playwright/Cypress.

## Qualidade de testes

- [ ] Teste de integração Docker opcional, ignorado automaticamente quando Docker não estiver disponível.
- [ ] Testes de conquistas por critério e do serviço de avaliação.
- [ ] Testes de rate limit, CSRF, cookies e expiração de sessão.
- [ ] Teste de seed que valide explicitamente pré-requisitos existentes, slugs únicos e imagens referenciadas.
- [ ] Cobertura de `hint`, `writeup`, `extend` e `DELETE` de sessão de lab.
- [ ] Testes de componentes React e do `ExerciseRenderer`/`SimTerminal`.

## Conteúdo

- [ ] **Revisão editorial dos exercícios gerados.** O bootstrap produziu quizzes genéricos e repetitivos, com alternativas de outras lições e alguns `true_false` pouco contextualizados.
- [ ] Revisar as Trilhas 4–9 para transformar `draft` em `complete` com profundidade real.
- [ ] Produzir a Trilha 10 (avançado) ou manter `coming_soon` com comunicação clara.
- [ ] Adicionar exercícios `fill_command`, `order`, `match`, `code_review` e `flag` onde fizer sentido; hoje o conteúdo usa principalmente múltipla escolha, múltipla resposta e verdadeiro/falso.
- [ ] Revisar links, referências e precisão técnica de cada lição.
- [ ] Criar um teste editorial de “sem gabarito no corpo da lição” para flags estáticas.

## Labs

- [ ] Teste manual documentado para cada um dos 10 labs após mudanças em `server.py`.
- [ ] Ampliar cenários do alvo único sem criar regressão entre labs.
- [ ] Adicionar healthcheck TCP real para o banner na porta 2222, além do HTTP.
- [ ] Melhorar mensagens de erro quando o proxy ou o alvo não sobem.
- [ ] Avaliar limites de rede/egress e política de DNS nos containers.
- [ ] Revisar se `NET_RAW` no attacker é suficiente e necessário para todos os cenários.
- [ ] Confirmar limpeza de containers/rede após crash da API e reinício do host.

## Produto e experiência

- [ ] Ligas competitivas multiusuário.
- [ ] Modo equipe/CTF ao vivo.
- [ ] Certificados em PDF.
- [ ] Editor de conteúdo via UI.
- [ ] App mobile/PWA e modo offline para lições teóricas.
- [ ] Integração com TryHackMe/HackTheBox/CTFd.
- [ ] Perfis públicos e compartilhamento de conquistas.
- [ ] Fórum/comentários e moderação.
- [ ] Eventos sazonais e modo Red vs Blue.
- [ ] Trilha avançada: malware, engenharia reversa e mobile.
- [ ] Geração de novos labs a partir de templates.
- [ ] Deploy público com autenticação, observabilidade e política de privacidade.

## Dívida técnica

- [ ] `content-meta.json` foi removido; se um gerador for reintroduzido, colocá-lo em `scripts/` e documentar que ele sobrescreve conteúdo.
- [ ] Revisar uso de `as` e tipos duplicados entre loader, seed e serviços.
- [ ] Adicionar validação de `prerequisites` contra o catálogo no loader (hoje a ordem global também bloqueia).
- [ ] Avaliar se o cron de sync diário deve rodar em produção ou apenas no deploy.
- [ ] Documentar e testar migração de banco em versões futuras.
- [ ] Revisar logs para garantir que flags, senhas e tokens nunca sejam registrados.

## Riscos conhecidos

- **Docker Desktop no Windows/WSL:** builds podem falhar por credential helper ausente. Workaround documentado no README; não é correção definitiva.
- **SQLite single-node:** não suporta escala horizontal nem múltiplas instâncias escrevendo no mesmo arquivo.
- **Conteúdo gerado:** a qualidade pedagógica é desigual; não trate o catálogo como editorialmente final.
- **Cadeia de suprimentos:** a auditoria está limpa hoje (zod 4, react-router 7, Vite 7, Vitest 4, dockerode 5 e node-cron 4), mas novas advisories podem surgir; mantenha a revisão contínua.
- **Labs em produção:** isolar containers Docker de usuários exige mais do que o MVP atual oferece.
