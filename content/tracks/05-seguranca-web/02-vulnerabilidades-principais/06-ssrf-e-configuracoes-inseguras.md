---
slug: "ssrf-e-configuracoes-inseguras"
title: "SSRF e configurações inseguras"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["autenticacao-e-sessao-quebradas"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “SSRF e configurações inseguras”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender requisições do lado do servidor e erros de configuração."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender requisições do lado do servidor e erros de configuração. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Escapar a saída conforme o contexto é uma defesa importante contra XSS."
    answer: true
    explanation: "A codificação adequada impede que dados sejam interpretados como código no navegador."
---

# SSRF e configurações inseguras

> **Objetivo:** Entender requisições do lado do servidor e erros de configuração.

Se uma aplicação busca uma URL informada pelo usuário (para gerar uma prévia, por exemplo), um atacante pode apontá-la para serviços *internos* que ele não alcançaria diretamente. A defesa é validar destinos com **lista de permissão**, bloquear redes internas e isolar o serviço. Na categoria de configurações inseguras entram painéis com senha padrão, mensagens de erro detalhadas e arquivos de backup acessíveis.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **SSRF e configurações inseguras**, dentro do módulo **Vulnerabilidades principais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **SSRF (servidor induzido a fazer requisições, inclusive internas)**
- **metadados de nuvem como alvo clássico (conceito)**
- **listas de permissão de destinos**
- **cabeçalhos de segurança**
- **modo debug em produção**
- **credenciais padrão**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **SSRF (servidor induzido a fazer requisições, inclusive internas)** com minhas próprias palavras.
- [ ] Consigo explicar **metadados de nuvem como alvo clássico (conceito)** com minhas próprias palavras.
- [ ] Consigo explicar **listas de permissão de destinos** com minhas próprias palavras.


## Resumo

Entender requisições do lado do servidor e erros de configuração. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
