---
slug: "vpn-e-tuneis"
title: "VPN e túneis"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: draft
prerequisites: ["ids-ips"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “VPN e túneis”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender para que servem VPNs e seus limites."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender para que servem VPNs e seus limites. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "VPN cria um túnel cifrado, mas não corrige automaticamente permissões excessivas."
    answer: true
    explanation: "A VPN protege o transporte; autorização e segmentação continuam necessárias."
---

# VPN e túneis

> **Objetivo:** Entender para que servem VPNs e seus limites.

Uma VPN cria um "tubo" criptografado entre dois pontos. Numa empresa, permite acesso seguro à rede interna. Em casa, uma VPN comercial só muda *em quem você confia* (o provedor em vez da rede local) e **não** protege contra malware ou phishing. Cuidado com o split tunneling: parte do tráfego fica fora do túnel.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **VPN e túneis**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **túnel criptografado**
- **site-to-site e acesso remoto**
- **WireGuard, IPsec, OpenVPN (visão geral)**
- **SSH tunneling (conceito)**
- **VPN comercial vs. corporativa**
- **split tunneling**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **túnel criptografado** com minhas próprias palavras.
- [ ] Consigo explicar **site-to-site e acesso remoto** com minhas próprias palavras.
- [ ] Consigo explicar **WireGuard, IPsec, OpenVPN (visão geral)** com minhas próprias palavras.


## Resumo

Entender para que servem VPNs e seus limites. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
