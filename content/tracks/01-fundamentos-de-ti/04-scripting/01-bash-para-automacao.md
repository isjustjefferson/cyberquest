---
slug: "bash-para-automacao"
title: "Bash para automação"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Bash para automação”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Escrever scripts simples com variáveis, condicionais e laços."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Escrever scripts simples com variáveis, condicionais e laços. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Permissões 777 em uma chave privada são uma boa prática para evitar erros de acesso."
    answer: false
    explanation: "Permissões excessivas expõem a chave. O correto é restringir a leitura ao dono."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Bash para automação”?"
    options:
      - "variáveis"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "shebang"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: shebang, variáveis. Os outros itens pertencem a outras lições."
---

# Bash para automação

> **Objetivo:** Escrever scripts simples com variáveis, condicionais e laços.

Um script bash é uma lista de comandos reutilizável. Exemplo: um laço que testa se vários hosts respondem a ping. Automatizar tarefas repetitivas (coleta de informações, checagens) é o que separa o iniciante do profissional.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Bash para automação**, dentro do módulo **Scripting**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **shebang**
- **variáveis**
- **for**
- **argumentos $1**
- **códigos de saída**
- **chmod +x**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **shebang** com minhas próprias palavras.
- [ ] Consigo explicar **variáveis** com minhas próprias palavras.
- [ ] Consigo explicar **for** com minhas próprias palavras.


### Aplique agora

1. Resuma **shebang** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **variáveis** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Bash para automação**.

## Resumo

Escrever scripts simples com variáveis, condicionais e laços. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
