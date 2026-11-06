---
slug: "lab-recon-nmap"
title: "Lab: Reconhecimento com nmap"
kind: lab
difficulty: 3
est_minutes: 30
xp: 250
status: complete
prerequisites: []
lab_slug: "recon-nmap"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Reconhecimento com nmap”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Descobrir hosts, portas e serviços num ambiente fictício **autorizado**."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Descobrir hosts, portas e serviços num ambiente fictício **autorizado**. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "VPN cria um túnel cifrado, mas não corrige automaticamente permissões excessivas."
    answer: true
    explanation: "A VPN protege o transporte; autorização e segmentação continuam necessárias."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Reconhecimento com nmap”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "descoberta de hosts (-sn)"
      - "varredura de portas (-p, -sS/-sT)"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: descoberta de hosts (-sn), varredura de portas (-p, -sS/-sT). Os outros itens pertencem a outras lições."
---

# Lab: Reconhecimento com nmap

> **Objetivo:** Descobrir hosts, portas e serviços num ambiente fictício **autorizado**.

O nmap pergunta à rede "quem está aí e o que oferece?". Primeiro você descobre os hosts vivos; depois varre portas; depois identifica versões, que ajudam a ligar o que roda a vulnerabilidades conhecidas (CVEs). Cada flag tem um custo: mais barulho, mais tempo. Em testes reais, o escopo define *quais IPs e com que agressividade* você pode varrer. No lab, a rede é isolada e é sempre segura praticar.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Lab: Reconhecimento com nmap**, dentro do módulo **Reconhecimento prático**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **descoberta de hosts (-sn)**
- **varredura de portas (-p, -sS/-sT)**
- **detecção de versão (-sV)**
- **scripts padrão (-sC, conceito)**
- **interpretar saídas**
- **salvar resultados (-oN)**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **descoberta de hosts (-sn)** com minhas próprias palavras.
- [ ] Consigo explicar **varredura de portas (-p, -sS/-sT)** com minhas próprias palavras.
- [ ] Consigo explicar **detecção de versão (-sV)** com minhas próprias palavras.


### Aplique agora

1. Resuma **descoberta de hosts (-sn)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **varredura de portas (-p, -sS/-sT)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Reconhecimento com nmap**.

## Resumo

Descobrir hosts, portas e serviços num ambiente fictício **autorizado**. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Pratique em ambiente controlado e documente o que aprendeu.
