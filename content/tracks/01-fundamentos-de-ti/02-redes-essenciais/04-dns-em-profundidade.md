---
slug: "dns-em-profundidade"
title: "DNS em profundidade"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["portas-e-protocolos-comuns"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “DNS em profundidade”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Entender resolução de nomes e registros comuns."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 2
    explanation: "O objetivo desta lição é: Entender resolução de nomes e registros comuns. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O comando ss -tulpn ajuda a identificar portas em escuta e os processos associados."
    answer: true
    explanation: "Ele mostra sockets TCP/UDP, portas e processos, útil para inventário e auditoria."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “DNS em profundidade”?"
    options:
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
      - "resolvedor recursivo, raiz/TLD/autoritativo"
      - "registros A, AAAA, CNAME, MX, TXT, NS"
    answerIndexes:
      - 2
      - 3
    explanation: "Os conceitos corretos são: resolvedor recursivo, raiz/TLD/autoritativo, registros A, AAAA, CNAME, MX, TXT, NS. Os outros itens pertencem a outras lições."
---

# DNS em profundidade

> **Objetivo:** Entender resolução de nomes e registros comuns.

O DNS é a "lista telefônica" da internet. Quando você digita um site, seu resolvedor pergunta à raiz, depois ao TLD (.br) e então ao servidor autoritativo do domínio. Registros TXT são muito usados em verificações e SPF; MX define os servidores de e-mail. Em segurança, o DNS revela muita coisa sobre uma organização (subdomínios, e-mail, provedores) e também é alvo/meio de ataques.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **DNS em profundidade**, dentro do módulo **Redes essenciais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **resolvedor recursivo, raiz/TLD/autoritativo**
- **registros A, AAAA, CNAME, MX, TXT, NS**
- **TTL**
- **dig/nslookup**
- **riscos (cache poisoning, DNS spoofing, tunelamento) em nível conceitual**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **resolvedor recursivo, raiz/TLD/autoritativo** com minhas próprias palavras.
- [ ] Consigo explicar **registros A, AAAA, CNAME, MX, TXT, NS** com minhas próprias palavras.
- [ ] Consigo explicar **TTL** com minhas próprias palavras.


### Aplique agora

1. Resuma **resolvedor recursivo, raiz/TLD/autoritativo** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **registros A, AAAA, CNAME, MX, TXT, NS** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **DNS em profundidade**.

## Resumo

Entender resolução de nomes e registros comuns. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
