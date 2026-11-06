---
slug: "boss-seguranca-de-redes"
title: "Boss: Segurança de Redes"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: complete
prerequisites: ["lab-recon-nmap"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Segurança de Redes”?"
    options:
      - "Revisar e aplicar os principais conceitos do módulo Reconhecimento prático em um desafio integrado."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Revisar e aplicar os principais conceitos do módulo Reconhecimento prático em um desafio integrado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Segmentar a rede limita o movimento lateral após o comprometimento de um host."
    answer: true
    explanation: "A segmentação cria barreiras e reduz o alcance de um invasor."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Boss: Segurança de Redes”?"
    options:
      - "descoberta de hosts (-sn)"
      - "varredura de portas (-p, -sS/-sT)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: descoberta de hosts (-sn), varredura de portas (-p, -sS/-sT). Os outros itens pertencem a outras lições."
---

# Boss: Segurança de Redes

> **Objetivo:** Revisar e aplicar os principais conceitos do módulo Reconhecimento prático em um desafio integrado.

7 exercícios: ler regras de firewall e decidir se um pacote passa, interpretar uma saída de nmap, identificar protocolos inseguros e escolher IDS vs. IPS.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Boss: Segurança de Redes**, dentro do módulo **Reconhecimento prático**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **descoberta de hosts (-sn)**
- **varredura de portas (-p, -sS/-sT)**
- **detecção de versão (-sV)**
- **scripts padrão (-sC, conceito)**
- **interpretar saídas**
- **salvar resultados (-oN)**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Segurança de Redes**.

## Resumo

Revisar e aplicar os principais conceitos do módulo Reconhecimento prático em um desafio integrado. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Pratique em ambiente controlado e documente o que aprendeu.
