---
slug: "protocolos-inseguros"
title: "Protocolos inseguros e alternativas"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: draft
prerequisites: ["captura-e-analise-de-trafego"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Protocolos inseguros e alternativas”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Reconhecer protocolos legados e substituí-los."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Reconhecer protocolos legados e substituí-los. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Varreduras de portas em redes de terceiros são legais quando usam pouca banda."
    answer: false
    explanation: "O impacto técnico não substitui autorização. Varredura não autorizada pode ser ilegal."
---

# Protocolos inseguros e alternativas

> **Objetivo:** Reconhecer protocolos legados e substituí-los.

Muitos protocolos antigos foram criados quando a rede era "de confiança" e não cifram nada. A maioria das migrações é simples: trocar o protocolo por seu sucessor seguro e desativar o legado. Em auditorias, achar Telnet ou SMBv1 expostos é um achado clássico.

## Por que isso importa

A rede é o caminho entre atacante e alvo. Segmentação, visibilidade e configuração correta reduzem movimento lateral e dão tempo para detectar atividade suspeita. Nesta lição, o foco é **Protocolos inseguros e alternativas**, dentro do módulo **Defesa e visibilidade**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **Telnet → SSH**
- **FTP → SFTP/FTPS**
- **HTTP → HTTPS**
- **SMBv1 → SMBv3**
- **SNMPv1/2 → v3**
- **POP3/IMAP sem TLS**

Mapeie portas e serviços apenas em alvos autorizados. Compare o que está exposto com o que deveria estar exposto e registre evidências antes de propor mudanças. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- expor serviços sem necessidade.
- confiar apenas no firewall de borda.
- não revisar regras antigas.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **Telnet → SSH** com minhas próprias palavras.
- [ ] Consigo explicar **FTP → SFTP/FTPS** com minhas próprias palavras.
- [ ] Consigo explicar **HTTP → HTTPS** com minhas próprias palavras.


## Resumo

Reconhecer protocolos legados e substituí-los. Defesa de rede combina inventário, segmentação, regras mínimas e monitoramento contínuo; nenhum controle isolado resolve tudo. Este conteúdo está em rascunho e pode receber aprofundamento nas próximas revisões.
