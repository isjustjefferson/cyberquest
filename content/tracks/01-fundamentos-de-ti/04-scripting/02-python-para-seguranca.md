---
slug: "python-para-seguranca"
title: "Python para segurança"
kind: lesson
difficulty: 3
est_minutes: 20
xp: 50
status: complete
prerequisites: ["bash-para-automacao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Python para segurança”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar Python para tarefas básicas: sockets, requests e hashing."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Usar Python para tarefas básicas: sockets, requests e hashing. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O comando ss -tulpn ajuda a identificar portas em escuta e os processos associados."
    answer: true
    explanation: "Ele mostra sockets TCP/UDP, portas e processos, útil para inventário e auditoria."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Python para segurança”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "hashlib"
      - "requests"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: hashlib, requests. Os outros itens pertencem a outras lições."
---

# Python para segurança

> **Objetivo:** Usar Python para tarefas básicas: sockets, requests e hashing.

Python é a língua franca de ferramentas de segurança. Com poucas linhas você calcula um hash, faz uma requisição HTTP ou verifica se uma porta está aberta num host **autorizado**. Exemplo conceitual: criar um socket, `connect_ex((host, porta))` e interpretar o resultado. Escreva ferramentas pequenas e legíveis; elas ensinam mais do que usar programas prontos sem entender.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Python para segurança**, dentro do módulo **Scripting**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **hashlib**
- **requests**
- **socket (conectar e ler banner)**
- **leitura de arquivos**
- **tratamento de erros**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **hashlib** com minhas próprias palavras.
- [ ] Consigo explicar **requests** com minhas próprias palavras.
- [ ] Consigo explicar **socket (conectar e ler banner)** com minhas próprias palavras.


### Aplique agora

1. Resuma **hashlib** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **requests** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Python para segurança**.

## Resumo

Usar Python para tarefas básicas: sockets, requests e hashing. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
