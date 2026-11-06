---
slug: "iam-e-menor-privilegio"
title: "IAM e menor privilégio"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["responsabilidade-compartilhada"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “IAM e menor privilégio”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender identidades, papéis e políticas."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender identidades, papéis e políticas. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Guardar segredos em variáveis de ambiente da imagem é a prática mais segura."
    answer: false
    explanation: "Segredos na imagem podem vazar. Prefira cofres e injeção em tempo de execução."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “IAM e menor privilégio”?"
    options:
      - "permissões * como risco"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "usuários, grupos, papéis (roles) e políticas"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: usuários, grupos, papéis (roles) e políticas, permissões * como risco. Os outros itens pertencem a outras lições."
---

# IAM e menor privilégio

> **Objetivo:** Entender identidades, papéis e políticas.

Na nuvem, **identidade é o novo perímetro**. Uma política que concede `*` em todos os recursos é um convite ao desastre. Prefira papéis com credenciais temporárias, separe contas administrativas, ative MFA e revise acessos regularmente. Chaves de acesso não devem ir para repositórios de código.

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **IAM e menor privilégio**, dentro do módulo **Nuvem**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **usuários, grupos, papéis (roles) e políticas**
- **permissões * como risco**
- **credenciais temporárias**
- **MFA em contas privilegiadas**
- **chaves de acesso de longa duração**
- **revisão periódica**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- usar credenciais de longa duração.
- rodar containers como root.
- guardar segredos na imagem.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **usuários, grupos, papéis (roles) e políticas** com minhas próprias palavras.
- [ ] Consigo explicar **permissões * como risco** com minhas próprias palavras.
- [ ] Consigo explicar **credenciais temporárias** com minhas próprias palavras.


### Aplique agora

1. Resuma **usuários, grupos, papéis (roles) e políticas** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **permissões * como risco** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **IAM e menor privilégio**.

## Resumo

Entender identidades, papéis e políticas. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Pratique em ambiente controlado e documente o que aprendeu.
