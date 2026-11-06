---
slug: "preparando-o-docker"
title: "Preparando o Docker (Windows + WSL2)"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: ["como-a-plataforma-funciona"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Preparando o Docker (Windows + WSL2)”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Ter o Docker funcionando no WSL2 para rodar os labs."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Ter o Docker funcionando no WSL2 para rodar os labs. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Encontrar uma falha fora do escopo autoriza você a continuar testando para confirmar o problema."
    answer: false
    explanation: "Ao encontrar algo fora do escopo, pare e comunique o contratante. Continuar pode caracterizar acesso não autorizado."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Preparando o Docker (Windows + WSL2)”?"
    options:
      - "Docker Desktop com integração WSL"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "WSL2"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: WSL2, Docker Desktop com integração WSL. Os outros itens pertencem a outras lições."
---

# Preparando o Docker (Windows + WSL2)

> **Objetivo:** Ter o Docker funcionando no WSL2 para rodar os labs.

Um container é um processo isolado com seu próprio sistema de arquivos e rede, mais leve que uma máquina virtual. Nossos labs usam containers para criar alvos descartáveis: você ataca, aprende, e tudo é apagado. No Windows, o Docker roda sobre o WSL2. Depois de instalar e ativar a integração com sua distro Ubuntu, `docker run hello-world` confirma que está tudo certo. Lembre: o acesso ao Docker é poderoso, por isso usamos apenas na sua máquina pessoal.

## Por que isso importa

Segurança começa com autorização, escopo e responsabilidade. Sem esse alicerce, conhecimento técnico vira risco jurídico e dano real para pessoas e organizações. Nesta lição, o foco é **Preparando o Docker (Windows + WSL2)**, dentro do módulo **Seu laboratório**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **WSL2**
- **Docker Desktop com integração WSL**
- **docker run hello-world**
- **containers vs. máquinas virtuais**
- **por que labs são isolados**

Antes de tocar em qualquer ferramenta, leia o escopo, confirme quem autorizou o teste e registre o que será feito. Ética não é um capítulo inicial: é uma decisão repetida em cada comando. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- achar que boa intenção substitui autorização.
- testar algo fora do escopo por curiosidade.
- publicar detalhes antes da correção.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **WSL2** com minhas próprias palavras.
- [ ] Consigo explicar **Docker Desktop com integração WSL** com minhas próprias palavras.
- [ ] Consigo explicar **docker run hello-world** com minhas próprias palavras.


### Aplique agora

1. Resuma **WSL2** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **Docker Desktop com integração WSL** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Preparando o Docker (Windows + WSL2)**.

## Resumo

Ter o Docker funcionando no WSL2 para rodar os labs. Leve estas regras para todas as trilhas seguintes: autorização por escrito, escopo explícito e divulgação responsável. Pratique em ambiente controlado e documente o que aprendeu.
