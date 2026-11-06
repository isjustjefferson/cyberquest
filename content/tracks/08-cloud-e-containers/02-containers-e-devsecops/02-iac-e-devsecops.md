---
slug: "iac-e-devsecops"
title: "IaC e DevSecOps"
kind: lesson
difficulty: 3
est_minutes: 12
xp: 50
status: complete
prerequisites: ["seguranca-de-containers"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “IaC e DevSecOps”?"
    options:
      - "Integrar segurança ao ciclo de desenvolvimento e à infraestrutura como código."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Integrar segurança ao ciclo de desenvolvimento e à infraestrutura como código. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Rodar containers como usuário sem privilégios reduz o impacto de uma falha na aplicação."
    answer: true
    explanation: "Menos privilégios limitam o que um processo comprometido pode fazer."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “IaC e DevSecOps”?"
    options:
      - "IaC (Terraform/CloudFormation — conceito)"
      - "revisão de código"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: IaC (Terraform/CloudFormation — conceito), revisão de código. Os outros itens pertencem a outras lições."
---

# IaC e DevSecOps

> **Objetivo:** Integrar segurança ao ciclo de desenvolvimento e à infraestrutura como código.

Quando a infraestrutura é código, erros de segurança também são código e podem ser detectados **antes** do deploy. Pipelines com verificações automáticas (dependências vulneráveis, segredos, configurações perigosas) impedem que falhas conhecidas cheguem à produção. A segurança passa a ser responsabilidade compartilhada entre dev, ops e segurança.

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **IaC e DevSecOps**, dentro do módulo **Containers e DevSecOps**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **IaC (Terraform/CloudFormation — conceito)**
- **revisão de código**
- **análise estática (SAST), de dependências (SCA), de imagens e de IaC no pipeline**
- **segredos em CI**
- **assinatura de artefatos**
- **"shift left"**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **IaC e DevSecOps**.

## Resumo

Integrar segurança ao ciclo de desenvolvimento e à infraestrutura como código. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Pratique em ambiente controlado e documente o que aprendeu.
