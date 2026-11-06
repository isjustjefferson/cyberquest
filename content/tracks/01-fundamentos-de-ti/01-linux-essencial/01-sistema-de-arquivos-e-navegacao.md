---
slug: "sistema-de-arquivos-e-navegacao"
title: "Sistema de arquivos e navegação"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Sistema de arquivos e navegação”?"
    options:
      - "Navegar no terminal e entender a estrutura de diretórios."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Navegar no terminal e entender a estrutura de diretórios. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O diretório /tmp é o local recomendado para guardar configurações permanentes do sistema."
    answer: false
    explanation: "Configurações do sistema ficam normalmente em /etc. /tmp é para arquivos temporários."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Sistema de arquivos e navegação”?"
    options:
      - "pwd, ls -la, cd, caminhos absoluto/relativo"
      - "/etc, /var, /home, /tmp, /bin"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: pwd, ls -la, cd, caminhos absoluto/relativo, /etc, /var, /home, /tmp, /bin. Os outros itens pertencem a outras lições."
---

# Sistema de arquivos e navegação

> **Objetivo:** Navegar no terminal e entender a estrutura de diretórios.

No Linux, tudo parte da raiz `/`. Configurações moram em `/etc`, logs em `/var/log`, arquivos dos usuários em `/home`, e `/tmp` guarda temporários. `pwd` mostra onde você está, `ls -la` lista inclusive ocultos (começam com ponto) e `cd` muda de pasta. Um caminho **absoluto** começa em `/`; um **relativo** parte de onde você está. Para um profissional de segurança, saber onde ficam logs e configurações é meio caminho para investigar ou auditar.

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **Sistema de arquivos e navegação**, dentro do módulo **Linux essencial**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **pwd, ls -la, cd, caminhos absoluto/relativo**
- **/etc, /var, /home, /tmp, /bin**
- **arquivos ocultos**
- **man**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **pwd, ls -la, cd, caminhos absoluto/relativo** com minhas próprias palavras.
- [ ] Consigo explicar **/etc, /var, /home, /tmp, /bin** com minhas próprias palavras.
- [ ] Consigo explicar **arquivos ocultos** com minhas próprias palavras.


### Aplique agora

1. Resuma **pwd, ls -la, cd, caminhos absoluto/relativo** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **/etc, /var, /home, /tmp, /bin** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Sistema de arquivos e navegação**.

## Resumo

Navegar no terminal e entender a estrutura de diretórios. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
