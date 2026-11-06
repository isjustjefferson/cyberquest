---
slug: "lab-explorando-a-rede"
title: "Lab: Explorando a rede"
kind: lab
difficulty: 2
est_minutes: 25
xp: 200
status: complete
prerequisites: ["http-https-na-pratica"]
lab_slug: "explorando-a-rede"
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Lab: Explorando a rede”?"
    options:
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O diretório /tmp é o local recomendado para guardar configurações permanentes do sistema."
    answer: false
    explanation: "Configurações do sistema ficam normalmente em /etc. /tmp é para arquivos temporários."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Lab: Explorando a rede”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "vírus, worm, trojan, ransomware, spyware, rootkit, botnet, keylogger"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: métodos (GET, POST, PUT, DELETE), headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type). Os outros itens pertencem a outras lições."
---

# Lab: Explorando a rede

> **Objetivo:** Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab.

Você recebe um alvo com DNS interno, um serviço web e um serviço TCP simples. Deve resolver nomes, inspecionar cabeçalhos HTTP e conversar com um serviço via `nc`.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Lab: Explorando a rede**, dentro do módulo **Redes essenciais**. O laboratório transforma conceitos em prática controlada e permite errar sem consequências para sistemas reais.

## Conceitos-chave

- **métodos (GET, POST, PUT, DELETE)**
- **headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)**
- **status 2xx/3xx/4xx/5xx**
- **curl -i**
- **HTTPS e certificados**
- **cookies e flags (HttpOnly, Secure, SameSite)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Esta é uma lição de laboratório: abra a sessão somente depois de ler o termo, execute os passos no alvo descartável e submeta as flags dos objetivos. O ambiente é isolado e expira automaticamente.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **métodos (GET, POST, PUT, DELETE)** com minhas próprias palavras.
- [ ] Consigo explicar **headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)** com minhas próprias palavras.
- [ ] Consigo explicar **status 2xx/3xx/4xx/5xx** com minhas próprias palavras.


### Aplique agora

1. Resuma **métodos (GET, POST, PUT, DELETE)** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Lab: Explorando a rede**.

## Resumo

Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
