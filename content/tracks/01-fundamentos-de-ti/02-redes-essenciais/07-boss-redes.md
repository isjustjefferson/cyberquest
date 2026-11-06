---
slug: "boss-redes"
title: "Boss: Redes"
kind: boss
difficulty: 3
est_minutes: 10
xp: 100
status: complete
prerequisites: ["lab-explorando-a-rede"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Boss: Redes”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Revisar e aplicar os principais conceitos do módulo Redes essenciais em um desafio integrado."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 1
    explanation: "O objetivo desta lição é: Revisar e aplicar os principais conceitos do módulo Redes essenciais em um desafio integrado. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "Permissões 777 em uma chave privada são uma boa prática para evitar erros de acesso."
    answer: false
    explanation: "Permissões excessivas expõem a chave. O correto é restringir a leitura ao dono."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Boss: Redes”?"
    options:
      - "headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "vírus, worm, trojan, ransomware, spyware, rootkit, botnet, keylogger"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 3
    explanation: "Os conceitos corretos são: métodos (GET, POST, PUT, DELETE), headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type). Os outros itens pertencem a outras lições."
---

# Boss: Redes

> **Objetivo:** Revisar e aplicar os principais conceitos do módulo Redes essenciais em um desafio integrado.

7 exercícios cronometrados: camadas OSI, CIDR, portas, registros DNS e status HTTP.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Boss: Redes**, dentro do módulo **Redes essenciais**. O desafio integra o que você viu no módulo e revela lacunas antes de seguir adiante.

## Conceitos-chave

- **métodos (GET, POST, PUT, DELETE)**
- **headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)**
- **status 2xx/3xx/4xx/5xx**
- **curl -i**
- **HTTPS e certificados**
- **cookies e flags (HttpOnly, Secure, SameSite)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Este é um desafio de revisão. Responda às questões sem consultar o gabarito e use os erros para identificar o que precisa ser revisto no módulo.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Boss: Redes**.

## Resumo

Revisar e aplicar os principais conceitos do módulo Redes essenciais em um desafio integrado. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
