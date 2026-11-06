---
slug: "boss-seguranca-web"
title: "Boss: Segurança Web"
kind: boss
difficulty: 3
est_minutes: 15
xp: 100
status: complete
prerequisites: ["lab-web-xss-idor"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Segurança Web”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Revisar e aplicar os principais conceitos do módulo Prática em um desafio integrado."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Revisar e aplicar os principais conceitos do módulo Prática em um desafio integrado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Escapar a saída conforme o contexto é uma defesa importante contra XSS."
    answer: true
    explanation: "A codificação adequada impede que dados sejam interpretados como código no navegador."
---

# Boss: Segurança Web

> **Objetivo:** Revisar e aplicar os principais conceitos do módulo Prática em um desafio integrado.

8 exercícios: identificar o tipo de falha em trechos de código, escolher a correção certa, ligar categorias OWASP a exemplos e analisar uma requisição HTTP suspeita.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Boss: Segurança Web**, dentro do módulo **Prática**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **terminal, flags, ambiente isolado, documentação**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

## Erros comuns

- validar autorização apenas no cliente.
- confiar em filtros de entrada frágeis.
- corrigir um payload e não a causa.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **terminal, flags, ambiente isolado, documentação** com minhas próprias palavras.


### Aplique agora

1. Resuma **terminal, flags, ambiente isolado, documentação** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **terminal, flags, ambiente isolado, documentação** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Segurança Web**.

## Resumo

Revisar e aplicar os principais conceitos do módulo Prática em um desafio integrado. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
