---
slug: "responsabilidade-compartilhada"
title: "Modelo de responsabilidade compartilhada"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Modelo de responsabilidade compartilhada”?"
    options:
      - "Saber o que o provedor protege e o que é responsabilidade sua."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Saber o que o provedor protege e o que é responsabilidade sua. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Rodar containers como usuário sem privilégios reduz o impacto de uma falha na aplicação."
    answer: true
    explanation: "Menos privilégios limitam o que um processo comprometido pode fazer."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Modelo de responsabilidade compartilhada”?"
    options:
      - "IaaS, PaaS, SaaS"
      - "o provedor protege a infraestrutura da nuvem"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: IaaS, PaaS, SaaS, o provedor protege a infraestrutura da nuvem. Os outros itens pertencem a outras lições."
---

# Modelo de responsabilidade compartilhada

> **Objetivo:** Saber o que o provedor protege e o que é responsabilidade sua.

Pense em alugar um apartamento: o prédio cuida da estrutura, mas **você** tranca a porta. Na nuvem é igual: o provedor garante datacenters e hipervisores; você configura quem acessa o quê, quais portas ficam abertas e se os dados são cifrados. Quanto mais "gerenciado" o serviço (SaaS), menos coisas você configura, mas nunca zero.

## Por que isso importa

Na nuvem, identidade é o novo perímetro. Containers e infraestrutura como código ampliam velocidade, mas também amplificam erros de configuração e permissões excessivas. Nesta lição, o foco é **Modelo de responsabilidade compartilhada**, dentro do módulo **Nuvem**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **IaaS, PaaS, SaaS**
- **o provedor protege a infraestrutura da nuvem**
- **o cliente protege configuração, identidades, dados e aplicações**
- **erros de configuração como principal causa de incidentes**

Revise Dockerfiles, manifests e políticas de IAM como código. Prefira imagens mínimas, usuário sem privilégios, segredos fora da imagem e menor privilégio. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- usar credenciais de longa duração.
- rodar containers como root.
- guardar segredos na imagem.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **IaaS, PaaS, SaaS** com minhas próprias palavras.
- [ ] Consigo explicar **o provedor protege a infraestrutura da nuvem** com minhas próprias palavras.
- [ ] Consigo explicar **o cliente protege configuração, identidades, dados e aplicações** com minhas próprias palavras.


### Aplique agora

1. Resuma **IaaS, PaaS, SaaS** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **o provedor protege a infraestrutura da nuvem** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Modelo de responsabilidade compartilhada**.

## Resumo

Saber o que o provedor protege e o que é responsabilidade sua. Segurança em cloud é responsabilidade compartilhada na teoria e configuração concreta na prática: audite, automatize e monitore. Pratique em ambiente controlado e documente o que aprendeu.
