---
slug: "portas-e-protocolos-comuns"
title: "Portas e protocolos comuns"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["enderecamento-ip-e-nat"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Portas e protocolos comuns”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Memorizar as portas mais comuns e entender TCP vs. UDP."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Memorizar as portas mais comuns e entender TCP vs. UDP. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Permissões 777 em uma chave privada são uma boa prática para evitar erros de acesso."
    answer: false
    explanation: "Permissões excessivas expõem a chave. O correto é restringir a leitura ao dono."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Portas e protocolos comuns”?"
    options:
      - "handshake TCP de 3 vias"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP, handshake TCP de 3 vias. Os outros itens pertencem a outras lições."
---

# Portas e protocolos comuns

> **Objetivo:** Memorizar as portas mais comuns e entender TCP vs. UDP.

Uma porta identifica um serviço dentro de um host (como o número de um apartamento em um prédio). O TCP estabelece conexão com um handshake (SYN, SYN-ACK, ACK) e garante entrega; o UDP é rápido e sem garantias (DNS, streaming). Quando alguém faz um scan, está perguntando "quais portas respondem?". Saber o que cada uma costuma ser ajuda a interpretar resultados e a priorizar riscos.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Portas e protocolos comuns**, dentro do módulo **Redes essenciais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP**
- **handshake TCP de 3 vias**
- **UDP sem conexão**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP** com minhas próprias palavras.
- [ ] Consigo explicar **handshake TCP de 3 vias** com minhas próprias palavras.
- [ ] Consigo explicar **UDP sem conexão** com minhas próprias palavras.


### Aplique agora

1. Resuma **20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **handshake TCP de 3 vias** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Portas e protocolos comuns**.

## Resumo

Memorizar as portas mais comuns e entender TCP vs. UDP. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
