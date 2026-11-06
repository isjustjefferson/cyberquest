---
slug: "firewalls-e-segmentacao"
title: "Firewalls e segmentação"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Firewalls e segmentação”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Entender como filtrar tráfego e dividir a rede em zonas."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Entender como filtrar tráfego e dividir a rede em zonas. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um IDS bloqueia automaticamente todo tráfego malicioso."
    answer: false
    explanation: "IDS detecta e alerta; IPS é a variante que pode bloquear, conforme configuração."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Firewalls e segmentação”?"
    options:
      - "regras allow/deny"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "filtro de pacotes vs. stateful vs. next-gen"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: filtro de pacotes vs. stateful vs. next-gen, regras allow/deny. Os outros itens pertencem a outras lições."
---

# Firewalls e segmentação

> **Objetivo:** Entender como filtrar tráfego e dividir a rede em zonas.

Um firewall é um porteiro com uma lista de regras: de onde para onde, em qual porta e protocolo. A boa prática é **negar por padrão** e liberar só o necessário. A segmentação divide a rede em zonas (usuários, servidores, DMZ para serviços públicos); assim, se um computador for comprometido, o atacante não alcança tudo facilmente. A ordem das regras importa: a primeira que casa vence.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Firewalls e segmentação**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **filtro de pacotes vs. stateful vs. next-gen**
- **regras allow/deny**
- **política padrão "negar tudo"**
- **DMZ**
- **VLANs**
- **segmentação e movimento lateral**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **filtro de pacotes vs. stateful vs. next-gen** com minhas próprias palavras.
- [ ] Consigo explicar **regras allow/deny** com minhas próprias palavras.
- [ ] Consigo explicar **política padrão "negar tudo"** com minhas próprias palavras.


### Aplique agora

1. Resuma **filtro de pacotes vs. stateful vs. next-gen** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **regras allow/deny** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Firewalls e segmentação**.

## Resumo

Entender como filtrar tráfego e dividir a rede em zonas. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Pratique em ambiente controlado e documente o que aprendeu.
