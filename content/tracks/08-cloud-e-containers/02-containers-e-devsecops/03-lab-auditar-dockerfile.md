---
slug: "lab-auditar-dockerfile"
title: "Lab: Auditar um Dockerfile e um docker-compose inseguros"
kind: lab
difficulty: 3
est_minutes: 25
xp: 250
status: complete
prerequisites: ["iac-e-devsecops"]
lab_slug: "auditar-dockerfile"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Auditar um Dockerfile e um docker-compose inseguros”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Encontrar más práticas em arquivos fornecidos e propor correções."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Encontrar más práticas em arquivos fornecidos e propor correções. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Guardar segredos em variáveis de ambiente da imagem é a prática mais segura."
    answer: false
    explanation: "Segredos na imagem podem vazar. Prefira cofres e injeção em tempo de execução."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Auditar um Dockerfile e um docker-compose inseguros”?"
    options:
      - "revisão de código"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "IaC (Terraform/CloudFormation — conceito)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: IaC (Terraform/CloudFormation — conceito), revisão de código. Os outros itens pertencem a outras lições."
---

# Lab: Auditar um Dockerfile e um docker-compose inseguros

> **Objetivo:** Encontrar más práticas em arquivos fornecidos e propor correções.

Aqui o "alvo" são **arquivos**, não containers vulneráveis: você recebe um `Dockerfile` e um `docker-compose.yml` com 6 problemas (usuário root, segredo hardcoded, imagem `latest`, `privileged: true`, porta de banco exposta publicamente, volume com o socket do Docker). Marque as linhas e escolha a correção para cada uma.

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **Lab: Auditar um Dockerfile e um docker-compose inseguros**, dentro do módulo **Containers e DevSecOps**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **IaC (Terraform/CloudFormation — conceito)**
- **revisão de código**
- **análise estática (SAST), de dependências (SCA), de imagens e de IaC no pipeline**
- **segredos em CI**
- **assinatura de artefatos**
- **"shift left"**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

## Erros comuns

- usar credenciais de longa duração.
- rodar containers como root.
- guardar segredos na imagem.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **IaC (Terraform/CloudFormation — conceito)** com minhas próprias palavras.
- [ ] Consigo explicar **revisão de código** com minhas próprias palavras.
- [ ] Consigo explicar **análise estática (SAST), de dependências (SCA), de imagens e de IaC no pipeline** com minhas próprias palavras.


### Aplique agora

1. Resuma **IaC (Terraform/CloudFormation — conceito)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **revisão de código** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Auditar um Dockerfile e um docker-compose inseguros**.

## Resumo

Encontrar más práticas em arquivos fornecidos e propor correções. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Pratique em ambiente controlado e documente o que aprendeu.
