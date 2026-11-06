---
slug: "lab-web-xss-idor"
title: "Lab: XSS e IDOR"
kind: lab
difficulty: 3
est_minutes: 35
xp: 300
status: complete
prerequisites: ["lab-web-sqli-login"]
lab_slug: "web-xss-idor"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: XSS e IDOR”?"
    options:
      - "Identificar um XSS armazenado e um IDOR no mesmo alvo."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Identificar um XSS armazenado e um IDOR no mesmo alvo. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Consultas parametrizadas previnem SQL Injection porque separam código de dados."
    answer: true
    explanation: "Parâmetros não são interpretados como SQL, evitando a injeção."
---

# Lab: XSS e IDOR

> **Objetivo:** Identificar um XSS armazenado e um IDOR no mesmo alvo.

Um mural de recados vulnerável permite que a entrada seja renderizada sem escape, e uma página de pedidos expõe dados de outros usuários por ID sequencial. Você prova cada falha e, no fim, compara com o código corrigido (escape de saída + checagem de dono).

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Lab: XSS e IDOR**, dentro do módulo **Prática**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **terminal, flags, ambiente isolado, documentação**

Use um proxy para observar requisições e respostas, reproduza a falha no laboratório e confirme o impacto. Depois implemente a correção e teste novamente com o mesmo caso. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: XSS e IDOR**.

## Resumo

Identificar um XSS armazenado e um IDOR no mesmo alvo. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
