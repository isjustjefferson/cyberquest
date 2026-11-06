---
slug: "permissoes-e-donos"
title: "Permissões e donos"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["sistema-de-arquivos-e-navegacao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Permissões e donos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Ler e alterar permissões; entender por que permissões mal configuradas são um risco."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Ler e alterar permissões; entender por que permissões mal configuradas são um risco. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Permissões 777 em uma chave privada são uma boa prática para evitar erros de acesso."
    answer: false
    explanation: "Permissões excessivas expõem a chave. O correto é restringir a leitura ao dono."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Permissões e donos”?"
    options:
      - "notação octal (640, 755)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "rwx para dono/grupo/outros"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: rwx para dono/grupo/outros, notação octal (640, 755). Os outros itens pertencem a outras lições."
---

# Permissões e donos

> **Objetivo:** Ler e alterar permissões; entender por que permissões mal configuradas são um risco.

Cada arquivo tem dono, grupo e três conjuntos de permissões: leitura (r=4), escrita (w=2) e execução (x=1). `chmod 640 arquivo` dá leitura/escrita ao dono, leitura ao grupo e nada aos outros (6=4+2, 4, 0). Uma chave privada SSH com permissão `777` é como deixar a chave da casa debaixo do tapete. Permissões frouxas em arquivos de configuração e scripts são achados clássicos em auditorias. O bit **SUID** faz um programa rodar com os privilégios do dono, útil e perigoso se mal usado; aqui só o conceito.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Permissões e donos**, dentro do módulo **Linux essencial**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **rwx para dono/grupo/outros**
- **notação octal (640, 755)**
- **chmod, chown**
- **diretórios vs. arquivos**
- **conceito de SUID (apenas conceito)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **rwx para dono/grupo/outros** com minhas próprias palavras.
- [ ] Consigo explicar **notação octal (640, 755)** com minhas próprias palavras.
- [ ] Consigo explicar **chmod, chown** com minhas próprias palavras.


### Aplique agora

1. Resuma **rwx para dono/grupo/outros** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **notação octal (640, 755)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Permissões e donos**.

## Resumo

Ler e alterar permissões; entender por que permissões mal configuradas são um risco. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
