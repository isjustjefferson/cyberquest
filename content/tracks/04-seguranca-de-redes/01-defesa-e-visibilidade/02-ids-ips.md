---
slug: "ids-ips"
title: "IDS e IPS"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: ["firewalls-e-segmentacao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “IDS e IPS”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Diferenciar detecção e prevenção de intrusão."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Diferenciar detecção e prevenção de intrusão. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Varreduras de portas em redes de terceiros são legais quando usam pouca banda."
    answer: false
    explanation: "O impacto técnico não substitui autorização. Varredura não autorizada pode ser ilegal."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “IDS e IPS”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "IDS vs. IPS"
      - "baseado em assinatura vs. anomalia"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: IDS vs. IPS, baseado em assinatura vs. anomalia. Os outros itens pertencem a outras lições."
---

# IDS e IPS

> **Objetivo:** Diferenciar detecção e prevenção de intrusão.

O **IDS** observa e alerta; o **IPS** fica em linha e bloqueia. Detecção por assinatura reconhece padrões conhecidos (rápida, mas cega a novidades); por anomalia detecta desvios do normal (pega o novo, mas gera mais alarmes falsos). Alertas sem triagem viram ruído, então ajuste e contexto são essenciais.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **IDS e IPS**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **IDS vs. IPS**
- **baseado em assinatura vs. anomalia**
- **NIDS vs. HIDS**
- **falsos positivos/negativos**
- **exemplos (Snort, Suricata, Wazuh — conceito)**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **IDS vs. IPS** com minhas próprias palavras.
- [ ] Consigo explicar **baseado em assinatura vs. anomalia** com minhas próprias palavras.
- [ ] Consigo explicar **NIDS vs. HIDS** com minhas próprias palavras.


### Aplique agora

1. Resuma **IDS vs. IPS** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **baseado em assinatura vs. anomalia** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **IDS e IPS**.

## Resumo

Diferenciar detecção e prevenção de intrusão. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Pratique em ambiente controlado e documente o que aprendeu.
