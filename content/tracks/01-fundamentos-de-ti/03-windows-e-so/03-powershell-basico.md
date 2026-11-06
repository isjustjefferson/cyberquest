---
slug: "powershell-basico"
title: "PowerShell básico"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["usuarios-e-privilegios-windows"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “PowerShell básico”?"
    options:
      - "Executar cmdlets simples e entender sua importância em defesa e ataque."
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
    answerIndex: 0
    explanation: "O objetivo desta lição é: Executar cmdlets simples e entender sua importância em defesa e ataque. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O diretório /tmp é o local recomendado para guardar configurações permanentes do sistema."
    answer: false
    explanation: "Configurações do sistema ficam normalmente em /etc. /tmp é para arquivos temporários."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “PowerShell básico”?"
    options:
      - "Get-Process, Get-Service, Get-ChildItem"
      - "pipeline de objetos"
      - "ps aux, top/htop, PID, kill, systemctl status"
      - "métodos (GET, POST, PUT, DELETE)"
    answerIndexes:
      - 0
      - 1
    explanation: "Os conceitos corretos são: Get-Process, Get-Service, Get-ChildItem, pipeline de objetos. Os outros itens pertencem a outras lições."
---

# PowerShell básico

> **Objetivo:** Executar cmdlets simples e entender sua importância em defesa e ataque.

O PowerShell passa **objetos**, não texto, pelo pipeline, o que facilita filtrar: `Get-Process | Where-Object CPU -gt 100`. É ferramenta de administração poderosa, e por isso também muito monitorada em defesa, pois é usada em ataques "sem arquivo".

## Por que isso importa

Ferramentas de segurança só fazem sentido quando você entende o sistema por baixo: arquivos, permissões, processos, rede e código. Essa base reduz o uso de comandos decorados e aumenta o diagnóstico. Nesta lição, o foco é **PowerShell básico**, dentro do módulo **Windows e conceitos de SO**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **Get-Process, Get-Service, Get-ChildItem**
- **pipeline de objetos**
- **Get-EventLog/Get-WinEvent**
- **política de execução**

Pratique em uma máquina virtual ou container descartável. Observe a saída de cada comando, leia mensagens de erro e confirme o efeito antes de seguir para o próximo passo. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- decorar comandos sem entender a saída.
- usar a conta root para tudo.
- ignorar mensagens de erro e permissões.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **Get-Process, Get-Service, Get-ChildItem** com minhas próprias palavras.
- [ ] Consigo explicar **pipeline de objetos** com minhas próprias palavras.
- [ ] Consigo explicar **Get-EventLog/Get-WinEvent** com minhas próprias palavras.


### Aplique agora

1. Resuma **Get-Process, Get-Service, Get-ChildItem** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **pipeline de objetos** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **PowerShell básico**.

## Resumo

Executar cmdlets simples e entender sua importância em defesa e ataque. Fundamentos sólidos tornam o aprendizado ofensivo e defensivo mais rápido, porque você entende o que a ferramenta está realmente fazendo. Pratique em ambiente controlado e documente o que aprendeu.
