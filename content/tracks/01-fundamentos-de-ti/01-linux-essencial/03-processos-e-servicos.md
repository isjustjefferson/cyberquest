---
slug: "processos-e-servicos"
title: "Processos e serviços"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: ["permissoes-e-donos"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Processos e serviços”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Listar, monitorar e encerrar processos; entender serviços."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Listar, monitorar e encerrar processos; entender serviços. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O comando ss -tulpn ajuda a identificar portas em escuta e os processos associados."
    answer: true
    explanation: "Ele mostra sockets TCP/UDP, portas e processos, útil para inventário e auditoria."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Processos e serviços”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "vírus, worm, trojan, ransomware, spyware, rootkit, botnet, keylogger"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "processo em segundo plano (&, jobs)"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: ps aux, top/htop, PID, kill, systemctl status, processo em segundo plano (&, jobs). Os outros itens pertencem a outras lições."
---

# Processos e serviços

> **Objetivo:** Listar, monitorar e encerrar processos; entender serviços.

Um programa em execução é um processo, com um PID. `ps aux` lista todos e `kill PID` pede o encerramento. Serviços são processos de longa duração (como um servidor web) gerenciados pelo `systemd`. Em segurança, olhar o que está rodando e **em quais portas** (`ss -tulpn`) é um dos primeiros passos de auditoria: serviço desnecessário aberto é superfície de ataque desnecessária.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Processos e serviços**, dentro do módulo **Linux essencial**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **ps aux, top/htop, PID, kill, systemctl status**
- **processo em segundo plano (&, jobs)**
- **serviços escutando portas (ss -tulpn)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **ps aux, top/htop, PID, kill, systemctl status** com minhas próprias palavras.
- [ ] Consigo explicar **processo em segundo plano (&, jobs)** com minhas próprias palavras.
- [ ] Consigo explicar **serviços escutando portas (ss -tulpn)** com minhas próprias palavras.


### Aplique agora

1. Resuma **ps aux, top/htop, PID, kill, systemctl status** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **processo em segundo plano (&, jobs)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Processos e serviços**.

## Resumo

Listar, monitorar e encerrar processos; entender serviços. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
