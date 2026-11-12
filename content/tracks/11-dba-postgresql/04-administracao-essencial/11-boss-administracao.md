---
slug: "boss-administracao"
title: "Boss: Administração"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: complete
prerequisites: ["roles-e-privilegios", "autenticacao-pg-hba-e-ssl", "row-level-security-e-seguranca-avancada"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 12
    question: "Uma regra host all all 0.0.0.0/0 trust aparece antes de uma regra específica com scram. O que acontece?"
    options:
      - "A regra específica vence porque é mais segura"
      - "A regra trust vence porque é a primeira que casa"
      - "O servidor recusa iniciar com regras conflitantes"
      - "As duas regras são combinadas em uma autenticação dupla"
    answerIndex: 1
    explanation: "A ordem define o resultado. A primeira regra compatível é aplicada, independentemente de existir uma regra mais específica depois."
  - type: match
    xp: 14
    question: "Relacione o contexto do parâmetro ao mecanismo de aplicação."
    pairs:
      - ["postmaster", "Reiniciar o servidor"]
      - ["sighup", "Recarregar a configuração"]
      - ["user", "Alterar na sessão atual"]
      - ["superuser", "Alterar por sessão com privilégio elevado"]
    explanation: "pg_settings.context informa o mecanismo. Confundir reload com restart é uma fonte comum de mudanças que não entram em vigor."
  - type: true_false
    xp: 10
    statement: "Uma política RLS com USING filtra leitura, mas não impede inserir uma linha de outro tenant se WITH CHECK estiver ausente."
    answer: true
    explanation: "USING controla linhas visíveis; WITH CHECK valida a escrita. Sem ele, a política de INSERT pode não restringir corretamente."
  - type: single_choice
    xp: 12
    question: "Qual é a forma correta de preparar permissões para tabelas futuras criadas por app_owner?"
    options:
      - "GRANT ALL ON ALL TABLES toda semana"
      - "ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA public GRANT SELECT ON TABLES TO app_ro"
      - "ALTER ROLE app_ro SUPERUSER"
      - "Criar um trigger que executa GRANT"
    answerIndex: 1
    explanation: "DEFAULT PRIVILEGES define o que será concedido automaticamente em objetos futuros criados por aquele papel."
  - type: order
    xp: 14
    question: "Ordene o procedimento para corrigir uma falha de conexão por pg_hba."
    items:
      - "Testar a conexão pela rede real"
      - "Ler o log e identificar usuário, banco e origem"
      - "Recarregar a configuração"
      - "Editar a regra com o método e o escopo corretos"
    correctOrder: [1, 3, 2, 0]
    explanation: "Primeiro colete evidência, depois corrija, aplique e valide. Sem teste real, a correção é apenas uma hipótese."
  - type: multi_choice
    xp: 14
    question: "Quais práticas reduzem o risco de um incidente de privilégio?"
    options:
      - "Aplicação com papel de menor privilégio"
      - "Superusuário compartilhado entre todos os serviços"
      - "DEFAULT PRIVILEGES revisadas"
      - "RLS com WITH CHECK nas tabelas multi-tenant"
      - "Trust aberto para facilitar o suporte"
    answerIndexes: [0, 2, 3]
    explanation: "Menor privilégio, permissões futuras controladas e RLS com validação de escrita reduzem impacto. Superusuário e trust amplo aumentam a superfície."
  - type: sql_query
    xp: 14
    dataset: padaria_byte
    setup: ""
    prompt: "Liste os nomes dos papéis que podem fazer login, em ordem alfabética."
    starter: "SELECT rolname AS papel\nFROM pg_roles\nWHERE \nORDER BY rolname;"
    grade:
      mode: result_match
      expected_sql: |
        SELECT rolname AS papel
        FROM pg_roles
        WHERE rolcanlogin
        ORDER BY rolname;
      ordered: true
      compare_column_names: true
    hints:
      - text: "A coluna rolcanlogin indica se o papel pode autenticar."
        cost_bits: 5
    explanation: "pg_roles expõe atributos como rolcanlogin, rolsuper e rolcreatedb. É a base de uma auditoria de acesso."
---

# Boss: Administração

Este boss fecha o módulo de administração. Ele cobra decisões que um DBA toma sob pressão: ordem de regras de autenticação, contexto de parâmetros, escopo de privilégios e validação de políticas. As respostas erradas mais comuns vêm de atalhos: liberar `trust`, usar superusuário e aumentar permissões em vez de corrigir o desenho.

Ao revisar, conecte cada tema ao ciclo **inspecionar, agir e verificar**. Na autenticação, inspecione o log e as regras, ajuste o escopo e teste pela rede real. Na configuração, descubra o contexto, aplique pelo mecanismo correto e confirme com `pg_settings`. Em privilégios, comece pelo papel mínimo, prepare objetos futuros e valide com consultas de catálogo.

O laboratório da Padaria Byte usa esses mesmos conceitos em um PostgreSQL real. A verificação automática não pergunta "o que você faria": ela consulta o estado do servidor. Isso força você a praticar o procedimento completo, não apenas a memorizar a sintaxe.

## Checklist de domínio

- [ ] Sei explicar a primeira regra que casa no pg_hba.
- [ ] Sei diferenciar reload de restart.
- [ ] Sei aplicar menor privilégio e DEFAULT PRIVILEGES.
- [ ] Sei validar RLS com USING e WITH CHECK.
- [ ] Sei consultar catálogos para confirmar uma mudança.

## Resumo

Administração é decisão informada e verificação. Ordene regras, respeite contextos, conceda o mínimo e comprove o resultado no servidor.
