---
slug: "roles-e-privilegios"
title: "Roles e privilégios"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["psql-e-ferramentas-de-linha-de-comando"]
lab_slug: "roles-e-privilegios"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual atributo permite que um papel se autentique no servidor?"
    options:
      - "LOGIN"
      - "INHERIT"
      - "CREATEDB"
      - "BYPASSRLS"
    answerIndex: 0
    explanation: "LOGIN permite abrir sessão. Os demais atributos controlam capacidades, herança e bypass de políticas, mas não autenticação."
  - type: match
    xp: 12
    question: "Relacione o papel ao menor conjunto de privilégios típico."
    pairs:
      - ["app_ro", "SELECT nas tabelas de leitura"]
      - ["app_rw", "SELECT, INSERT, UPDATE e DELETE nas tabelas da aplicação"]
      - ["app_owner", "DDL e migrações do schema"]
      - ["relatorio", "SELECT em tabelas e views analíticas"]
    explanation: "Separar leitura, escrita e propriedade reduz o impacto de um erro ou comprometimento da aplicação."
  - type: true_false
    xp: 8
    statement: "A aplicação web deve conectar ao banco com o superusuário para evitar erros de permissão."
    answer: false
    explanation: "Superusuário ignora quase todas as barreiras. A aplicação deve usar um papel mínimo; erros de permissão são sinal de desenho, não motivo para escalar."
---

# Roles e privilégios

No PostgreSQL, usuários e grupos são o mesmo conceito: **roles**. Uma role pode ter `LOGIN` para autenticar, `SUPERUSER` para ignorar verificações, `CREATEDB`, `CREATEROLE` e `INHERIT` para herdar privilégios de outras roles. A boa prática é criar roles de grupo e roles de login específicas, concedendo capacidades por composição, em vez de acumular permissões em um único usuário.

Privilégios são concedidos em objetos: banco, schema, tabela, coluna, sequência e função. `GRANT SELECT ON produtos TO app_ro` libera leitura; `REVOKE` retira. Privilégios em schema controlam criação de objetos, enquanto privilégios em tabela controlam dados. O esquema `public` mudou a partir do PostgreSQL 15: por padrão, usuários comuns não criam objetos nele. Ainda assim, revise o `PUBLIC` implícito e remova acessos amplos.

`DEFAULT PRIVILEGES` resolve um problema operacional: permissões em tabelas futuras. Sem isso, toda nova tabela exige um `GRANT` novo. Configure o dono do schema para conceder automaticamente leitura a `app_ro` e escrita a `app_rw` nas tabelas que criar. Cuidado para não conceder escrita em tabelas sensíveis, como `clientes`, a quem só precisa ler.

O modelo mínimo da Padaria Byte separa `app_owner` (migrações), `app_rw` (aplicação) e `app_ro` (relatórios). Nenhum deles é superusuário. A aplicação nunca conecta como `postgres`. Se um ataque explorar SQL injection, o estrago fica limitado ao que o papel da aplicação pode fazer.

## Por que isso importa

Privilégio excessivo transforma um bug em incidente. Menor privilégio contém dano, simplifica auditoria e permite separar responsabilidades entre times.

## Conceitos-chave

- **Role:** usuário ou grupo.
- **LOGIN:** habilita autenticação.
- **GRANT/REVOKE:** concede e remove privilégios.
- **DEFAULT PRIVILEGES:** afeta objetos futuros.
- **Menor privilégio:** somente o necessário para a função.

## Erros comuns

Usar superusuário na aplicação. Conceder `ALL` em todos os schemas. Esquecer `DEFAULT PRIVILEGES` e quebrar novas tabelas. Deixar `PUBLIC` com privilégios amplos por inércia.

## Checklist de domínio

- [ ] Sei criar uma role com LOGIN.
- [ ] Sei conceder privilégios por objeto.
- [ ] Sei configurar DEFAULT PRIVILEGES.
- [ ] Sei explicar por que a aplicação não usa superusuário.

## Resumo

Roles unificam usuários e grupos. Privilégios devem ser explícitos, mínimos e preparados para objetos futuros. O laboratório testa o modelo completo de acesso da Padaria Byte.
