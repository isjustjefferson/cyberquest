---
slug: "enderecamento-ip-e-nat"
title: "Endereçamento IP e NAT"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["modelo-osi-e-tcp-ip"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Endereçamento IP e NAT”?"
    options:
      - "Ler endereços IPv4, máscaras CIDR e entender NAT."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Ler endereços IPv4, máscaras CIDR e entender NAT. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O diretório /tmp é o local recomendado para guardar configurações permanentes do sistema."
    answer: false
    explanation: "Configurações do sistema ficam normalmente em /etc. /tmp é para arquivos temporários."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Endereçamento IP e NAT”?"
    options:
      - "IPv4 e IPv6"
      - "CIDR (/24)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: IPv4 e IPv6, CIDR (/24). Os outros itens pertencem a outras lições."
---

# Endereçamento IP e NAT

> **Objetivo:** Ler endereços IPv4, máscaras CIDR e entender NAT.

Um IP identifica um dispositivo na rede. A máscara (`/24` = 255.255.255.0) diz quantos bits formam a rede: `192.168.1.0/24` tem 254 hosts utilizáveis. Endereços privados não são roteados na internet; o **NAT** do roteador traduz seus endereços privados para um público. Em segurança, conhecer sub-redes é essencial para definir escopo e entender o que um scan está alcançando.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Endereçamento IP e NAT**, dentro do módulo **Redes essenciais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **IPv4 e IPv6**
- **CIDR (/24)**
- **faixas privadas (10/8, 172.16/12, 192.168/16)**
- **gateway**
- **NAT**
- **DHCP**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **IPv4 e IPv6** com minhas próprias palavras.
- [ ] Consigo explicar **CIDR (/24)** com minhas próprias palavras.
- [ ] Consigo explicar **faixas privadas (10/8, 172.16/12, 192.168/16)** com minhas próprias palavras.


### Aplique agora

1. Resuma **IPv4 e IPv6** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **CIDR (/24)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Endereçamento IP e NAT**.

## Resumo

Ler endereços IPv4, máscaras CIDR e entender NAT. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
