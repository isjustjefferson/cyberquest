---
slug: "proxy-de-interceptacao"
title: "Proxy de interceptação (Burp/ZAP)"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["owasp-top-10-visao-geral"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Proxy de interceptação (Burp/ZAP)”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender como inspecionar e modificar requisições em testes autorizados."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender como inspecionar e modificar requisições em testes autorizados. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "HTTPS garante que a aplicação não tem falhas de lógica ou autorização."
    answer: false
    explanation: "HTTPS protege o canal, não a lógica da aplicação."
---

# Proxy de interceptação (Burp/ZAP)

> **Objetivo:** Entender como inspecionar e modificar requisições em testes autorizados.

Um proxy de interceptação fica entre seu navegador e o alvo e permite *pausar* uma requisição, alterar um parâmetro e reenviar. É assim que testadores verificam se o servidor realmente valida o que recebe. Configure o escopo para que apenas o alvo autorizado seja capturado. No lab, usamos `curl` e scripts para simular o mesmo fluxo sem depender de interface gráfica.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Proxy de interceptação (Burp/ZAP)**, dentro do módulo **Fundamentos web**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **proxy entre navegador e servidor**
- **interceptar, repetir (repeater) e comparar requisições**
- **certificado do proxy**
- **escopo**
- **ZAP como alternativa gratuita e de código aberto**
- **no lab, uso via curl ou proxy no attacker**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **proxy entre navegador e servidor** com minhas próprias palavras.
- [ ] Consigo explicar **interceptar, repetir (repeater) e comparar requisições** com minhas próprias palavras.
- [ ] Consigo explicar **certificado do proxy** com minhas próprias palavras.


## Resumo

Entender como inspecionar e modificar requisições em testes autorizados. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
