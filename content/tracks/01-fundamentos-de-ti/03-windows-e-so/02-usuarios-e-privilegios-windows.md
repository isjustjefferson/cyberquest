---
slug: "usuarios-e-privilegios-windows"
title: "Usuários e privilégios no Windows"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["estrutura-do-windows"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Usuários e privilégios no Windows”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender contas, grupos, UAC e visão geral de Active Directory."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender contas, grupos, UAC e visão geral de Active Directory. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O pipe | envia a saída de um comando como entrada de outro."
    answer: true
    explanation: "O pipe permite combinar comandos pequenos para filtrar e transformar dados."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Usuários e privilégios no Windows”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "contas locais vs. de domínio"
      - "grupo Administradores"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: contas locais vs. de domínio, grupo Administradores. Os outros itens pertencem a outras lições."
---

# Usuários e privilégios no Windows

> **Objetivo:** Entender contas, grupos, UAC e visão geral de Active Directory.

O Windows identifica contas por SIDs. O **UAC** pede confirmação antes de ações administrativas. Em empresas, o **Active Directory** centraliza usuários e políticas: um domínio comprometido é um cenário crítico, por isso privilégios devem ser mínimos e contas administrativas separadas das do dia a dia.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Usuários e privilégios no Windows**, dentro do módulo **Windows e conceitos de SO**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **contas locais vs. de domínio**
- **grupo Administradores**
- **UAC**
- **SID**
- **Active Directory (domínio, controlador de domínio, Kerberos em nível conceitual)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **contas locais vs. de domínio** com minhas próprias palavras.
- [ ] Consigo explicar **grupo Administradores** com minhas próprias palavras.
- [ ] Consigo explicar **UAC** com minhas próprias palavras.


### Aplique agora

1. Resuma **contas locais vs. de domínio** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **grupo Administradores** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Usuários e privilégios no Windows**.

## Resumo

Entender contas, grupos, UAC e visão geral de Active Directory. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
