# Guia de conteúdo

Este documento descreve como o currículo do CyberQuest é carregado, validado e exibido. A fonte editorial original fica em `curriculo/`; o conteúdo executável fica em `content/`.

## Princípios editoriais

- PT-BR claro, direto e técnico, sem sensacionalismo.
- Todo conteúdo ofensivo é limitado aos alvos descartáveis da plataforma.
- Cada técnica ofensiva deve vir acompanhada de impacto, correção e defesa.
- Slugs são imutáveis depois de publicados: progresso, conquistas e links dependem deles.
- Não publique gabaritos, flags ou respostas em endpoints de leitura. A correção é sempre server-side.

## Estrutura de arquivos

```text
content/
  achievements.yml
  tracks/
    00-boas-vindas/
      track.yml
      01-etica-e-lei/
        module.yml
        01-o-que-e-hacker-etico.md
        02-escopo-autorizacao-e-regras.md
```

- `track.yml` define a trilha.
- `module.yml` define o módulo.
- Lições são arquivos `.md` com frontmatter YAML e corpo Markdown.
- A ordem usa os prefixos numéricos dos diretórios e arquivos (`01-`, `02-`...). O campo `position` é opcional.
- `status` da trilha: `available` ou `coming_soon`.
- `status` da lição: `complete` ou `draft`. `draft` é um esqueleto real, navegável, mas ainda não revisado editorialmente.

## `track.yml`

```yaml
slug: "00-boas-vindas"
title: "Boas-vindas e Ética"
description: "Descrição curta da trilha."
icon: "🛡️"
color: "verde"
position: 0
status: available
```

Campos validados: `slug` (`[a-z0-9-]+`), `title`, `description`, `icon`, `color`, `position`, `status`.

## `module.yml`

```yaml
slug: "01-etica-e-lei"
title: "Ética e lei"
description: "O que é hacking ético, autorização e legislação."
position: 0
xp_reward: 30
```

`xp_reward` é concedido uma única vez quando todas as lições do módulo são concluídas.

## Frontmatter de lição

```yaml
---
slug: "o-que-e-hacker-etico"
title: "O que é hacking ético"
kind: lesson          # lesson | lab | boss
difficulty: 1         # 1..5
est_minutes: 10
xp: 30
status: complete      # complete | draft
prerequisites: []     # slugs de lições
lab_slug: null        # slug do lab, quando houver
exercises: []
---
```

Regras:

- `slug` é obrigatório e único.
- `kind: lab` deve apontar `lab_slug` para um manifest existente em `labs/manifests/`.
- `prerequisites` precisa referenciar slugs existentes; o loader valida o schema, mas a existência é verificada pela ordem e pelo seed.
- O desbloqueio é sequencial na ordem global do catálogo **e** exige todos os `prerequisites` concluídos.
- Lições `draft` ainda podem ser concluídas; o status editorial não bloqueia o aluno, mas sinaliza conteúdo incompleto.

## Tipos de exercício

Todos são corrigidos no servidor por `apps/api/src/modules/exercises/grader.ts`.

### `single_choice`

```yaml
- type: single_choice
  xp: 10
  question: "Pergunta"
  options: ["A", "B", "C"]
  answerIndex: 1
  explanation: "Por que B está correta."
```

### `multi_choice`

```yaml
- type: multi_choice
  question: "Selecione as corretas"
  options: ["A", "B", "C"]
  answerIndexes: [0, 2]
  explanation: "A e C."
```

A ordem enviada não importa.

### `true_false`

```yaml
- type: true_false
  statement: "Afirmação"
  answer: false
  explanation: "A afirmação é falsa porque..."
```

### `order`

```yaml
- type: order
  question: "Ordene o fluxo"
  items: ["Passo A", "Passo B", "Passo C"]
  correctOrder: [2, 0, 1]
  explanation: "A ordem correta é C, A, B."
```

### `match`

```yaml
- type: match
  question: "Associe"
  pairs:
    - ["Conceito", "Definição"]
    - ["Outro conceito", "Outra definição"]
  explanation: "Associação correta."
```

### `fill_command`

```yaml
- type: fill_command
  question: "Complete o comando"
  template: "ls ___"
  blanks: ["-la"]
  accepted:
    - ["-la", "-al"]
  explanation: "Use ls -la para listar tudo."
```

Aceita alternativas normalizadas (trim, minúsculas e espaços repetidos).

### `sim_terminal`

```yaml
- type: sim_terminal
  question: "Navegue até /var/log"
  goal: "Executar cd /var/log"
  scenario: "basico-terminal"
  allowedCommands: ["pwd", "ls", "cd"]
  checks:
    historyIncludes: ["cd /var/log"]
    fileExists: ["/var/log/syslog"]
    cwd: "/var/log"
  explanation: "Use cd /var/log."
```

### `code_review`

```yaml
- type: code_review
  question: "Marque as linhas vulneráveis"
  code: |
    const query = `SELECT * FROM users WHERE id = ${id}`;
  vulnerableLines: [1]
  explanation: "Concatenação direta permite injeção."
```

### `flag`

```yaml
- type: flag
  question: "Cole a flag encontrada"
  flagHash: "<sha256-hex>"
  explanation: "Como a flag foi obtida."
```

Use `flag` em exercícios de lição apenas quando a flag for estática e o hash não permitir engenharia reversa. Labs usam flags dinâmicas próprias.

## Conquistas

`content/achievements.yml`:

```yaml
achievements:
  - slug: "primeiro-passo"
    title: "Primeiro passo"
    description: "Conclua sua primeira lição."
    icon: "🚀"
    rarity: "comum"   # comum | rara | epica | lendaria
    criteria:
      type: lessons_completed
      count: 1
```

Critérios suportados estão em `apps/api/src/modules/gamification/service.ts`. O seed é idempotente e atualiza título/descrição/critério pelo `slug`.

## Status de profundidade atual

- Trilhas 0–3: conteúdo completo.
- Trilhas 4–9: primeiras duas lições de cada módulo em `complete`; demais em `draft`. Lições de lab/boss e marcadas com ⭐ permanecem `complete`.
- Trilha 10: `coming_soon`, com estrutura de módulos e sem lições.
- Exercícios foram gerados a partir do currículo por script de bootstrap. Há repetição de templates e explicações genéricas; a revisão editorial está no backlog.

## Fluxo para adicionar ou editar conteúdo

1. Edite `curriculo/` se a mudança for curricular; mantenha slugs.
2. Atualize/crie os arquivos em `content/`.
3. Rode `pnpm seed` para validar schemas e sincronizar o SQLite.
4. Rode `pnpm test` (o teste de integração valida contagens e carrega o catálogo).
5. Confira a lição no navegador e, se houver lab, siga `docs/LAB_GUIDE.md`.
6. Rode `pnpm build` e `pnpm lint` antes de concluir.

## Checklist de revisão de uma lição

- [ ] Objetivo explícito no começo.
- [ ] Explica o conceito antes de pedir prática.
- [ ] Exercícios cobrem o objetivo e não conceitos de outras lições.
- [ ] Explicações ensinam o porquê, não apenas a resposta.
- [ ] Há uma seção de defesa/correção quando o tema é ofensivo.
- [ ] Nenhum passo incentiva ataque a terceiros sem autorização.
- [ ] Slugs, links e `lab_slug` existem.
