---
slug: "pipes-redirecionamento-e-texto"
title: "Pipes, redirecionamento e texto"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: ["pacotes-e-usuarios"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Pipes, redirecionamento e texto”?"
    options:
      - "Combinar comandos para filtrar e analisar texto (a \"superpotência\" da linha de comando)."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Combinar comandos para filtrar e analisar texto (a \"superpotência\" da linha de comando). As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O diretório /tmp é o local recomendado para guardar configurações permanentes do sistema."
    answer: false
    explanation: "Configurações do sistema ficam normalmente em /etc. /tmp é para arquivos temporários."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Pipes, redirecionamento e texto”?"
    options:
      - "|, >, >>, <"
      - "grep, cut, sort, uniq -c, head/tail, wc"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: |, >, >>, <, grep, cut, sort, uniq -c, head/tail, wc. Os outros itens pertencem a outras lições."
---

# Pipes, redirecionamento e texto

> **Objetivo:** Combinar comandos para filtrar e analisar texto (a "superpotência" da linha de comando).

Cada comando faz uma coisa bem; o pipe `|` liga a saída de um à entrada do outro. Exemplo: `cat access.log | grep "404" | cut -d' ' -f1 | sort | uniq -c | sort -nr | head` mostra os 10 IPs que mais geraram erro 404. Redirecionamento `>` sobrescreve um arquivo e `>>` acrescenta. Esse tipo de análise é rotina em investigação de logs e em pós-processamento de resultados de ferramentas.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Pipes, redirecionamento e texto**, dentro do módulo **Linux essencial**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **|, >, >>, <**
- **grep, cut, sort, uniq -c, head/tail, wc**
- **introdução ao awk**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **|, >, >>, <** com minhas próprias palavras.
- [ ] Consigo explicar **grep, cut, sort, uniq -c, head/tail, wc** com minhas próprias palavras.
- [ ] Consigo explicar **introdução ao awk** com minhas próprias palavras.


### Aplique agora

1. Resuma **|, >, >>, <** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **grep, cut, sort, uniq -c, head/tail, wc** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Pipes, redirecionamento e texto**.

## Resumo

Combinar comandos para filtrar e analisar texto (a "superpotência" da linha de comando). Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
