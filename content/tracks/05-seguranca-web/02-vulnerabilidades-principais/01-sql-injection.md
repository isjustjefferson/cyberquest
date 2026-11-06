---
slug: "sql-injection"
title: "SQL Injection"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “SQL Injection”?"
    options:
      - "Entender a causa raiz, o impacto e a correção da injeção SQL."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Entender a causa raiz, o impacto e a correção da injeção SQL. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Consultas parametrizadas previnem SQL Injection porque separam código de dados."
    answer: true
    explanation: "Parâmetros não são interpretados como SQL, evitando a injeção."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “SQL Injection”?"
    options:
      - "concatenação de entrada em consultas"
      - "autenticação burlada (' OR '1'='1) **como conceito e no lab**"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: concatenação de entrada em consultas, autenticação burlada (' OR '1'='1) **como conceito e no lab**. Os outros itens pertencem a outras lições."
---

# SQL Injection

> **Objetivo:** Entender a causa raiz, o impacto e a correção da injeção SQL.

Imagine um formulário que monta a consulta assim: `SELECT * FROM users WHERE name='` + entrada + `' AND pass='...'`. Se a entrada for algo que "fecha" a aspa e acrescenta lógica, o banco passa a obedecer ao *atacante* e não ao programador, porque dado e código se misturaram. A correção não é "filtrar aspas": é **separar código de dados** com consultas parametrizadas, de modo que a entrada nunca seja interpretada como SQL. Complementos: usuário do banco com poucos privilégios, mensagens de erro genéricas e testes automatizados.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **SQL Injection**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **concatenação de entrada em consultas**
- **autenticação burlada (' OR '1'='1) **como conceito e no lab****
- **tipos (in-band, blind) em visão geral**
- **impacto (leitura/alteração de dados)**
- **defesa: **consultas parametrizadas (prepared statements)**, ORM com cuidado, privilégios mínimos do usuário do banco, validação e tratamento de erros**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **concatenação de entrada em consultas** com minhas próprias palavras.
- [ ] Consigo explicar **autenticação burlada (' OR '1'='1) **como conceito e no lab**** com minhas próprias palavras.
- [ ] Consigo explicar **tipos (in-band, blind) em visão geral** com minhas próprias palavras.


### Aplique agora

1. Resuma **concatenação de entrada em consultas** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **autenticação burlada (' OR '1'='1) **como conceito e no lab**** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **SQL Injection**.

## Resumo

Entender a causa raiz, o impacto e a correção da injeção SQL. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
