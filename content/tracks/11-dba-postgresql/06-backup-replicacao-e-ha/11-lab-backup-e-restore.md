---
slug: "lab-backup-e-restore"
title: "Lab: Backup e restauração"
kind: lab
difficulty: 3
est_minutes: 30
xp: 300
status: complete
prerequisites: ["pg-dump-e-pg-restore"]
lab_slug: "backup-e-restore"
exercises:
  - type: single_choice
    xp: 10
    question: "Você precisa restaurar apenas a tabela clientes de um dump custom. Qual ferramenta permite selecionar objetos?"
    options:
      - "pg_restore -l e -L"
      - "pg_dump --only-table"
      - "VACUUM FULL"
      - "pg_basebackup -t"
    answerIndex: 0
    explanation: "pg_restore -l lista os itens; -L aplica uma seleção. O dump custom preserva a estrutura necessária para restauração parcial."
  - type: true_false
    xp: 10
    statement: "Antes de restaurar uma tabela, é prudente fazer um backup do estado atual do banco."
    answer: true
    explanation: "O backup atual preserva os pedidos novos e serve de rede de segurança caso a restauração parcial falhe."
  - type: fill_command
    xp: 10
    question: "Complete o comando que cria um dump custom do banco padaria."
    template: "pg_dump -Fc -f antes.dump ___"
    blanks: ["padaria"]
    accepted: [["padaria"]]
    explanation: "O destino vem com -f e o banco de origem é o último argumento. O formato custom permite listar e selecionar itens."
---

# Lab: Backup e restauração

Na Padaria Byte, alguém apagou a tabela `clientes`. Existe um dump antigo no servidor de backup, mas os pedidos mais novos não podem ser perdidos. O laboratório pede um backup do estado atual, a restauração seletiva de `clientes` e a comprovação de que os pedidos continuam presentes.

O primeiro objetivo é criar um dump custom antes de mexer em qualquer coisa: `pg_dump -Fc -f ~/antes.dump padaria`. Esse arquivo é sua rede de segurança. Em seguida, inspecione o dump antigo com `pg_restore -l` e identifique os itens da tabela `clientes`. A restauração deve ser seletiva, sem recriar o banco inteiro e sem sobrescrever pedidos.

A ordem importa. Se a tabela ainda existir vazia ou parcial, você pode precisar remover apenas ela antes de restaurar. Se o dump contiver dados e estrutura, use `pg_restore -L` com uma lista editada. Depois, valide a contagem de clientes e a contagem de pedidos. O objetivo automático consulta o banco real.

Por fim, reflita sobre o procedimento: onde o dump estava, como foi validado e o que faltaria em um desastre real. Um restore seletivo é útil, mas a recuperação completa exige roles, extensões e um plano testado.

## Por que isso importa

Restaurar demais pode apagar dados novos; restaurar de menos deixa o sistema inconsistente. O lab pratica a seleção e a validação.

## Conceitos-chave

- **Dump custom:** comprimido e selecionável.
- **pg_restore -l/-L:** listar e escolher.
- **Backup de segurança:** antes da intervenção.
- **Validação:** contagens e integridade.
- **Restore parcial:** mínimo necessário.

## Erros comuns

Restaurar sem backup atual. Recriar o banco inteiro. Ignorar pedidos novos. Não validar contagens. Esquecer dependências.

## Checklist de domínio

- [ ] Sei criar um dump custom.
- [ ] Sei listar e selecionar objetos.
- [ ] Sei preservar dados novos.
- [ ] Sei validar a restauração.

## Resumo

O lab combina backup de segurança, restore seletivo e validação. Preserve o presente, recupere o necessário e comprove o estado. O painel valida cada objetivo.
