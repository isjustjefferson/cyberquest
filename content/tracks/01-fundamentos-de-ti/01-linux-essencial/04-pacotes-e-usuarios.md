---
slug: "pacotes-e-usuarios"
title: "Pacotes e usuários"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: ["processos-e-servicos"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Pacotes e usuários”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Gerenciar pacotes e entender usuários, grupos e `sudo`."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Gerenciar pacotes e entender usuários, grupos e `sudo`. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O pipe | envia a saída de um comando como entrada de outro."
    answer: true
    explanation: "O pipe permite combinar comandos pequenos para filtrar e transformar dados."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Pacotes e usuários”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "apt update/upgrade/install"
      - "/etc/passwd e /etc/shadow"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: apt update/upgrade/install, /etc/passwd e /etc/shadow. Os outros itens pertencem a outras lições."
---

# Pacotes e usuários

> **Objetivo:** Gerenciar pacotes e entender usuários, grupos e `sudo`.

Distribuições Debian/Ubuntu usam o `apt`. Manter pacotes atualizados é a defesa mais simples contra vulnerabilidades conhecidas. As contas ficam em `/etc/passwd` (legível por todos) e os hashes das senhas em `/etc/shadow` (restrito ao root). `sudo` permite executar comandos como administrador sem usar a conta root diretamente, registrando quem fez o quê. O princípio do menor privilégio recomenda dar a cada usuário apenas o que ele precisa.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Pacotes e usuários**, dentro do módulo **Linux essencial**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **apt update/upgrade/install**
- **/etc/passwd e /etc/shadow**
- **useradd, usermod, grupos**
- **sudo e menor privilégio**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **apt update/upgrade/install** com minhas próprias palavras.
- [ ] Consigo explicar **/etc/passwd e /etc/shadow** com minhas próprias palavras.
- [ ] Consigo explicar **useradd, usermod, grupos** com minhas próprias palavras.


### Aplique agora

1. Resuma **apt update/upgrade/install** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **/etc/passwd e /etc/shadow** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Pacotes e usuários**.

## Resumo

Gerenciar pacotes e entender usuários, grupos e `sudo`. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
