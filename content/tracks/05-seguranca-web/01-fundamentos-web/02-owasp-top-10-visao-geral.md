---
slug: "owasp-top-10-visao-geral"
title: "OWASP Top 10: visão geral"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["como-a-web-funciona-por-dentro"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “OWASP Top 10: visão geral”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Conhecer as categorias de risco mais comuns em aplicações web."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Conhecer as categorias de risco mais comuns em aplicações web. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Verificar permissões apenas escondendo botões na interface é suficiente."
    answer: false
    explanation: "A autorização deve ser verificada no servidor; o cliente pode ser manipulado."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “OWASP Top 10: visão geral”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "o que é a OWASP"
      - "Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: o que é a OWASP, Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF). Os outros itens pertencem a outras lições."
---

# OWASP Top 10: visão geral

> **Objetivo:** Conhecer as categorias de risco mais comuns em aplicações web.

O OWASP Top 10 é um documento de consenso sobre os riscos mais críticos para aplicações web. Ele não é uma lista de ataques, e sim de *categorias de falhas*: controle de acesso quebrado, por exemplo, abrange IDOR, escalação de privilégios e acesso a rotas administrativas. Use-o como mapa de estudo e como checklist de revisão em projetos.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **OWASP Top 10: visão geral**, dentro do módulo **Fundamentos web**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **o que é a OWASP**
- **Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF)**
- **a lista é atualizada periodicamente, então **consultar a versão vigente** em owasp.org**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **o que é a OWASP** com minhas próprias palavras.
- [ ] Consigo explicar **Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF)** com minhas próprias palavras.
- [ ] Consigo explicar **a lista é atualizada periodicamente, então **consultar a versão vigente** em owasp.org** com minhas próprias palavras.


### Aplique agora

1. Resuma **o que é a OWASP** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **OWASP Top 10: visão geral**.

## Resumo

Conhecer as categorias de risco mais comuns em aplicações web. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
