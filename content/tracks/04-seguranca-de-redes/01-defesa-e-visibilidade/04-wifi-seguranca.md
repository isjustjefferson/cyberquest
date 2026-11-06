---
slug: "wifi-seguranca"
title: "Segurança de Wi-Fi"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: draft
prerequisites: ["vpn-e-tuneis"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Segurança de Wi-Fi”?"
    options:
      - "Conhecer protocolos e riscos de redes sem fio, em nível defensivo."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Conhecer protocolos e riscos de redes sem fio, em nível defensivo. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Segmentar a rede limita o movimento lateral após o comprometimento de um host."
    answer: true
    explanation: "A segmentação cria barreiras e reduz o alcance de um invasor."
---

# Segurança de Wi-Fi

> **Objetivo:** Conhecer protocolos e riscos de redes sem fio, em nível defensivo.

WEP é inseguro; hoje se usa WPA2 com senha forte ou WPA3. Em empresas, o modo Enterprise autentica cada usuário. Redes abertas permitem que terceiros observem tráfego não cifrado, e um "gêmeo maligno" imita uma rede legítima para enganar. Desative WPS, use senha longa, atualize o firmware e separe uma rede de convidados.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Segurança de Wi-Fi**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **WEP (quebrado), WPA2, WPA3**
- **PSK vs. Enterprise (802.1X)**
- **WPS**
- **"evil twin" (conceito)**
- **redes públicas**
- **boas configurações do roteador**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **WEP (quebrado), WPA2, WPA3** com minhas próprias palavras.
- [ ] Consigo explicar **PSK vs. Enterprise (802.1X)** com minhas próprias palavras.
- [ ] Consigo explicar **WPS** com minhas próprias palavras.


## Resumo

Conhecer protocolos e riscos de redes sem fio, em nível defensivo. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
