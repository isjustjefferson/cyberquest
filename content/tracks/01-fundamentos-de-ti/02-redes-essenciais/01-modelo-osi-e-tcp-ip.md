---
slug: "modelo-osi-e-tcp-ip"
title: "Modelo OSI e TCP/IP"
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
    question: "Qual alternativa descreve o foco principal da lição “Modelo OSI e TCP/IP”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender as camadas e onde cada protocolo vive."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender as camadas e onde cada protocolo vive. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O pipe | envia a saída de um comando como entrada de outro."
    answer: true
    explanation: "O pipe permite combinar comandos pequenos para filtrar e transformar dados."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Modelo OSI e TCP/IP”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "7 camadas OSI"
      - "4 camadas TCP/IP"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: 7 camadas OSI, 4 camadas TCP/IP. Os outros itens pertencem a outras lições."
---

# Modelo OSI e TCP/IP

> **Objetivo:** Entender as camadas e onde cada protocolo vive.

Pense numa carta: o conteúdo (aplicação) vai num envelope (TCP), dentro de outro envelope com endereço da cidade (IP), que vai num caminhão com placa (Ethernet). Cada camada adiciona seu cabeçalho: isso é o **encapsulamento**. Saber a camada ajuda a diagnosticar e a escolher a defesa: um firewall de rede atua nas camadas 3/4, um WAF na 7. Camadas OSI: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Modelo OSI e TCP/IP**, dentro do módulo **Redes essenciais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **7 camadas OSI**
- **4 camadas TCP/IP**
- **encapsulamento**
- **exemplos por camada (Ethernet, IP, TCP/UDP, HTTP)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **7 camadas OSI** com minhas próprias palavras.
- [ ] Consigo explicar **4 camadas TCP/IP** com minhas próprias palavras.
- [ ] Consigo explicar **encapsulamento** com minhas próprias palavras.


### Aplique agora

1. Resuma **7 camadas OSI** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **4 camadas TCP/IP** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Modelo OSI e TCP/IP**.

## Resumo

Entender as camadas e onde cada protocolo vive. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
