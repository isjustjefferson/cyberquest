---
slug: "http-https-na-pratica"
title: "HTTP/HTTPS na prática"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["dns-em-profundidade"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “HTTP/HTTPS na prática”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Ler requisições/respostas HTTP e entender cookies e status."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Ler requisições/respostas HTTP e entender cookies e status. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O pipe | envia a saída de um comando como entrada de outro."
    answer: true
    explanation: "O pipe permite combinar comandos pequenos para filtrar e transformar dados."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “HTTP/HTTPS na prática”?"
    options:
      - "vírus, worm, trojan, ransomware, spyware, rootkit, botnet, keylogger"
      - "métodos (GET, POST, PUT, DELETE)"
      - "headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: métodos (GET, POST, PUT, DELETE), headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type). Os outros itens pertencem a outras lições."
---

# HTTP/HTTPS na prática

> **Objetivo:** Ler requisições/respostas HTTP e entender cookies e status.

HTTP é um diálogo de texto: o cliente envia método, caminho e headers; o servidor responde com status, headers e corpo. `curl -i http://alvo.lab/` mostra tudo. Cookies mantêm estado de sessão. Os atributos `HttpOnly`, `Secure` e `SameSite` reduzem riscos de roubo e uso indevido de cookies. HTTPS adiciona criptografia e autenticação do servidor; cuidado, HTTPS protege o **canal**, não torna a aplicação segura.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **HTTP/HTTPS na prática**, dentro do módulo **Redes essenciais**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **métodos (GET, POST, PUT, DELETE)**
- **headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type)**
- **status 2xx/3xx/4xx/5xx**
- **curl -i**
- **HTTPS e certificados**
- **cookies e flags (HttpOnly, Secure, SameSite)**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

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
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **HTTP/HTTPS na prática**.

## Resumo

Ler requisições/respostas HTTP e entender cookies e status. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
