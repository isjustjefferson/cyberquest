---
slug: "lab-web-sqli-login"
title: "Lab: Bypass de login com SQL Injection"
kind: lab
difficulty: 2
est_minutes: 30
xp: 250
status: complete
prerequisites: []
lab_slug: "web-sqli-login"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Bypass de login com SQL Injection”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Reproduzir uma SQLi num alvo fictício e depois ler o código corrigido."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Reproduzir uma SQLi num alvo fictício e depois ler o código corrigido. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "HTTPS garante que a aplicação não tem falhas de lógica ou autorização."
    answer: false
    explanation: "HTTPS protege o canal, não a lógica da aplicação."
---

# Lab: Bypass de login com SQL Injection

> **Objetivo:** Reproduzir uma SQLi num alvo fictício e depois ler o código corrigido.

O alvo é o painel da "Padaria Byte", com um login vulnerável. Primeiro você faz reconhecimento (diretórios, formulário), depois testa a entrada e comprova que o código concatena dados. Ao concluir, o writeup mostra a **versão corrigida** com consulta parametrizada.

## Por que isso importa

Aplicações web concentram dados e lógica de negócio, por isso são alvo constante. Entender falhas clássicas permite corrigir a causa no código, não apenas bloquear um payload específico. Nesta lição, o foco é **Lab: Bypass de login com SQL Injection**, dentro do módulo **Prática**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Bypass de login com SQL Injection**.

## Resumo

Reproduzir uma SQLi num alvo fictício e depois ler o código corrigido. Entrada nunca é confiável, autorização deve ser verificada no servidor e toda correção precisa de teste de regressão. Pratique em ambiente controlado e documente o que aprendeu.
