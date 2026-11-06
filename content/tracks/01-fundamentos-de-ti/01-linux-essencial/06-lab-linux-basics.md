---
slug: "lab-linux-basics"
title: "Lab: Linux Basics"
kind: lab
difficulty: 2
est_minutes: 25
xp: 200
status: complete
prerequisites: ["pipes-redirecionamento-e-texto"]
lab_slug: "linux-basics"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Linux Basics”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Praticar navegação, permissões, processos e filtragem de texto num sistema real. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Permissões 777 em uma chave privada são uma boa prática para evitar erros de acesso."
    answer: false
    explanation: "Permissões excessivas expõem a chave. O correto é restringir a leitura ao dono."
---

# Lab: Linux Basics

> **Objetivo:** Praticar navegação, permissões, processos e filtragem de texto num sistema real.

O container `linux-basics` simula um servidor pequeno com logs, arquivos de configuração e um usuário de teste. Cada objetivo pede uma habilidade: achar um arquivo por nome, descobrir quem tem permissão de ler um arquivo sensível, identificar o processo que escuta numa porta e extrair um dado de um log.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Lab: Linux Basics**, dentro do módulo **Linux essencial**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **busca de arquivos (find), leitura de logs, permissões, pipes**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Linux Basics**.

## Resumo

Praticar navegação, permissões, processos e filtragem de texto num sistema real. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
