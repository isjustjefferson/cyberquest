---
slug: "lab-roles-e-privilegios"
title: "Lab: Roles e privilégios"
kind: lab
difficulty: 3
est_minutes: 25
xp: 250
status: complete
prerequisites: ["roles-e-privilegios"]
lab_slug: "roles-e-privilegios"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual é o menor conjunto de privilégios para um papel de relatórios?"
    options:
      - "SUPERUSER"
      - "SELECT nas tabelas e views necessárias"
      - "ALL PRIVILEGES no banco"
      - "CREATEDB e CREATEROLE"
    answerIndex: 1
    explanation: "Relatórios leem. Conceder apenas SELECT nas relações necessárias segue o menor privilégio."
  - type: true_false
    xp: 10
    statement: "DEFAULT PRIVILEGES garante que tabelas futuras já nasçam com as permissões configuradas para um papel."
    answer: true
    explanation: "Sem DEFAULT PRIVILEGES, cada nova tabela exigiria um GRANT manual. A configuração é feita pelo dono ou por quem cria os objetos."
  - type: fill_command
    xp: 10
    question: "Complete o comando que remove o acesso padrão de PUBLIC ao schema public."
    template: "REVOKE ALL ON SCHEMA public FROM ___;"
    blanks: ["PUBLIC"]
    accepted: [["PUBLIC"], ["public"]]
    explanation: "PUBLIC é o pseudo-papel implícito. Revogar reduz a superfície de acesso, mas confira antes se alguma aplicação depende desse acesso."
---

# Lab: Roles e privilégios

Na Padaria Byte, a aplicação ainda conecta como superusuário e qualquer pessoa consegue ler todas as tabelas. O objetivo do laboratório é montar um modelo de acesso realista: um papel de leitura, um de leitura e escrita sem exclusão de clientes, permissões padrão para tabelas futuras e remoção de acessos implícitos desnecessários.

O laboratório pode ser resolvido inteiramente por SQL. Comece inventariando os papéis existentes com `\du` ou `SELECT rolname FROM pg_roles`. Crie `app_ro` com `LOGIN` e senha forte, conceda `USAGE` no schema `public` e `SELECT` nas tabelas e views. Para `app_rw`, conceda leitura e escrita, mas evite `DELETE` em `clientes`. Verifique cada passo com consultas em `information_schema.role_table_grants`.

A parte mais fácil de esquecer é o futuro. Tabelas criadas amanhã não herdam `GRANT` de hoje. Configure `ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA public GRANT SELECT ON TABLES TO app_ro;` e a concessão equivalente para escrita em `app_rw`. O dono precisa ser o mesmo que cria as tabelas; caso contrário, a regra não se aplica.

Por fim, revise o `PUBLIC` implícito. Em versões recentes, o schema `public` já é mais restrito, mas o banco e objetos antigos podem manter privilégios herdados. Revogar exige cuidado: teste a aplicação depois. O sucesso não é "negar tudo", e sim permitir exatamente o necessário.

## Por que isso importa

Um modelo de acesso bem feito limita o impacto de SQL injection, facilita auditoria e permite rotacionar credenciais sem interromper relatórios.

## Conceitos-chave

- **app_ro:** leitura.
- **app_rw:** leitura e escrita controlada.
- **app_owner:** dono das migrações.
- **DEFAULT PRIVILEGES:** objetos futuros.
- **PUBLIC:** pseudo-papel implícito.

## Erros comuns

Conceder ALL. Usar superusuário na aplicação. Esquecer DEFAULT PRIVILEGES. Revogar PUBLIC sem testar as conexões existentes.

## Checklist de domínio

- [ ] Sei criar e testar app_ro e app_rw.
- [ ] Sei impedir exclusão em tabelas sensíveis.
- [ ] Sei configurar permissões futuras.
- [ ] Sei justificar a remoção de acessos implícitos.

## Resumo

O laboratório transforma privilégios em um modelo operacional. Separe papéis, conceda o mínimo, prepare o futuro e valide o acesso real. O terminal e os objetivos automáticos estão descritos no painel do lab.
