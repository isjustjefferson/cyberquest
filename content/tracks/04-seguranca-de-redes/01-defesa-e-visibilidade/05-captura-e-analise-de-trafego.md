---
slug: "captura-e-analise-de-trafego"
title: "Captura e análise de tráfego"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["wifi-seguranca"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Captura e análise de tráfego”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Capturar e ler pacotes com tcpdump/Wireshark em tráfego do lab."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Capturar e ler pacotes com tcpdump/Wireshark em tráfego do lab. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Um IDS bloqueia automaticamente todo tráfego malicioso."
    answer: false
    explanation: "IDS detecta e alerta; IPS é a variante que pode bloquear, conforme configuração."
---

# Captura e análise de tráfego

> **Objetivo:** Capturar e ler pacotes com tcpdump/Wireshark em tráfego do lab.

Analisar pacotes é ver "o que realmente passa no fio". Com `tcpdump` você captura no terminal; com Wireshark, analisa visualmente. Em um protocolo sem criptografia (FTP, HTTP), a senha aparece em texto puro, o que mostra por que HTTPS e SSH existem. Só capture tráfego de redes que você administra ou tem autorização para analisar.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Captura e análise de tráfego**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **interfaces**
- **filtros de captura vs. exibição**
- **tcpdump -i eth0 port 80**
- **seguir fluxo TCP**
- **identificar credenciais em texto puro (no lab)**
- **arquivos .pcap**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **interfaces** com minhas próprias palavras.
- [ ] Consigo explicar **filtros de captura vs. exibição** com minhas próprias palavras.
- [ ] Consigo explicar **tcpdump -i eth0 port 80** com minhas próprias palavras.


## Resumo

Capturar e ler pacotes com tcpdump/Wireshark em tráfego do lab. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
