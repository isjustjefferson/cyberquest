---
slug: "row-level-security-e-seguranca-avancada"
title: "Row-Level Security e segurança avançada"
kind: lesson
difficulty: 4
est_minutes: 15
xp: 60
status: complete
prerequisites: ["roles-e-privilegios"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual cláusula de uma política RLS valida linhas novas ou alteradas?"
    options:
      - "USING"
      - "WITH CHECK"
      - "FORCE"
      - "POLICY GRANT"
    answerIndex: 1
    explanation: "USING filtra linhas visíveis; WITH CHECK valida o que será inserido ou o resultado de um update."
  - type: true_false
    xp: 8
    statement: "RLS dispensa a necessidade de menor privilégio."
    answer: false
    explanation: "RLS é uma camada adicional. Ela não corrige GRANT amplo, não protege operações fora das políticas e pode ser ignorada pelo dono sem FORCE."
  - type: match
    xp: 12
    question: "Relacione o recurso à sua função."
    pairs:
      - ["ENABLE ROW LEVEL SECURITY", "Ativa políticas na tabela"]
      - ["FORCE ROW LEVEL SECURITY", "Aplica políticas também ao dono"]
      - ["pgcrypto", "Hash e criptografia em colunas"]
      - ["pgaudit", "Registro detalhado de atividades"]
    explanation: "RLS controla linhas; FORCE fecha a brecha do proprietário; pgcrypto e pgaudit cobrem dados sensíveis e auditoria."
---

# Row-Level Security e segurança avançada

Row-Level Security permite que o banco filtre linhas conforme o usuário da sessão. Em vez de confiar que toda consulta da aplicação inclua `WHERE vendedor_id = ...`, você define uma política na tabela e o PostgreSQL aplica a condição automaticamente. Isso é valioso em sistemas multi-tenant, onde um cliente não pode enxergar dados de outro.

O primeiro passo é `ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;`. Depois, `CREATE POLICY` define o comportamento. `USING` controla quais linhas podem ser lidas, atualizadas ou apagadas. `WITH CHECK` valida linhas inseridas ou o resultado de uma alteração. A política pode consultar `current_user`, `current_setting('app.tenant_id', true)` ou outras funções. A aplicação precisa definir essas variáveis de sessão de forma segura.

O dono da tabela e superusuários normalmente ignoram políticas. Para incluir o proprietário, use `ALTER TABLE ... FORCE ROW LEVEL SECURITY;`. Ainda assim, superusuário continua com poderes amplos. RLS não substitui privilégios mínimos: ela reduz o escopo dentro de uma tabela, enquanto `GRANT` decide se a tabela pode ser acessada.

Camadas complementares incluem `pgcrypto` para hash e criptografia de colunas, criptografia em repouso no disco ou volume, auditoria com `pgaudit` e controles do sistema operacional como SELinux. Nenhuma camada sozinha resolve segurança; a combinação dificulta acesso indevido e aumenta a rastreabilidade.

## Por que isso importa

Um `WHERE` esquecido pode vazar dados entre clientes. RLS transforma a regra de negócio em garantia no banco, reduzindo o impacto de erros na aplicação.

## Conceitos-chave

- **Política:** regra de visibilidade e escrita por tabela.
- **USING:** filtro de leitura e de linhas existentes.
- **WITH CHECK:** validação de escrita.
- **FORCE:** aplica ao dono.
- **Multi-tenant:** isolamento lógico por cliente.

## Erros comuns

Habilitar RLS sem criar política e bloquear todo acesso. Esquecer WITH CHECK e permitir mover dados para outro tenant. Achar que RLS protege contra superusuário. Não definir a variável de sessão usada pela política.

## Checklist de domínio

- [ ] Sei habilitar RLS e criar uma política.
- [ ] Sei diferenciar USING e WITH CHECK.
- [ ] Sei explicar o efeito de FORCE.
- [ ] Sei citar camadas complementares de proteção.

## Resumo

RLS aplica isolamento linha a linha no banco. USING lê, WITH CHECK valida escrita, FORCE fecha a brecha do dono. Menor privilégio e auditoria continuam necessários.
