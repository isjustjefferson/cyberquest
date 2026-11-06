---
slug: "boss-linux"
title: "Boss: Linux"
kind: boss
difficulty: 2
est_minutes: 10
xp: 100
status: complete
prerequisites: ["lab-linux-basics"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Linux”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Consolidar o módulo."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Consolidar o módulo. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O comando ss -tulpn ajuda a identificar portas em escuta e os processos associados."
    answer: true
    explanation: "Ele mostra sockets TCP/UDP, portas e processos, útil para inventário e auditoria."
---

# Boss: Linux

> **Objetivo:** Consolidar o módulo.

6 exercícios cronometrados (10 min) misturando navegação, permissões, processos e pipes.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Boss: Linux**, dentro do módulo **Linux essencial**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **busca de arquivos (find), leitura de logs, permissões, pipes**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **busca de arquivos (find), leitura de logs, permissões, pipes** com minhas próprias palavras.


### Aplique agora

1. Resuma **busca de arquivos (find), leitura de logs, permissões, pipes** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **busca de arquivos (find), leitura de logs, permissões, pipes** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Linux**.

## Resumo

Consolidar o módulo. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
