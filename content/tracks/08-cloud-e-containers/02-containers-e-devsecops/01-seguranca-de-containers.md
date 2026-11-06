---
slug: "seguranca-de-containers"
title: "Segurança de containers"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Segurança de containers”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Reduzir riscos em Docker e em orquestradores."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Reduzir riscos em Docker e em orquestradores. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Infraestrutura como código permite revisar e versionar configurações de segurança."
    answer: true
    explanation: "IaC traz rastreabilidade e automação de políticas."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Segurança de containers”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "imagens mínimas e confiáveis"
      - "não rodar como root"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: imagens mínimas e confiáveis, não rodar como root. Os outros itens pertencem a outras lições."
---

# Segurança de containers

> **Objetivo:** Reduzir riscos em Docker e em orquestradores.

Containers compartilham o kernel do host: um container privilegiado ou com acesso ao socket do Docker é quase um acesso root ao host. Boas práticas: imagens enxutas de fonte confiável, usuário não-root, `cap-drop`, sistema de arquivos somente leitura quando possível e nenhuma credencial dentro da imagem. (É exatamente assim que **os labs do CyberQuest são montados**: dá para olhar o código e aprender.)

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **Segurança de containers**, dentro do módulo **Containers e DevSecOps**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **imagens mínimas e confiáveis**
- **não rodar como root**
- **não usar --privileged nem montar o socket do Docker**
- **limites de recursos**
- **segredos fora da imagem**
- **varredura de imagens**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- usar credenciais de longa duração.
- rodar containers como root.
- guardar segredos na imagem.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **imagens mínimas e confiáveis** com minhas próprias palavras.
- [ ] Consigo explicar **não rodar como root** com minhas próprias palavras.
- [ ] Consigo explicar **não usar --privileged nem montar o socket do Docker** com minhas próprias palavras.


### Aplique agora

1. Resuma **imagens mínimas e confiáveis** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **não rodar como root** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Segurança de containers**.

## Resumo

Reduzir riscos em Docker e em orquestradores. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Pratique em ambiente controlado e documente o que aprendeu.
