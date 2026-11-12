---
slug: "automacao-com-scripts-e-iac"
title: "Automação: scripts, IaC e containers"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["rotinas-de-manutencao"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual é uma vantagem de IaC para bancos?"
    options:
      - "Ambientes reproduzíveis e revisáveis como código"
      - "Elimina a necessidade de backup"
      - "Dispensa monitoramento"
      - "Garante consultas rápidas automaticamente"
    answerIndex: 0
    explanation: "IaC descreve infraestrutura de forma versionada e revisável, reduzindo diferenças manuais entre ambientes."
  - type: true_false
    xp: 10
    statement: "Segredos do banco podem ficar no repositório se ele for privado."
    answer: false
    explanation: "Repositórios privados também vazam por credenciais, backups e acessos indevidos. Use cofre de segredos e injeção em tempo de execução."
---

# Automação: scripts, IaC e containers

Tudo o que você faz duas vezes à mão deve virar script. O que precisa existir em vários servidores deve virar código de infraestrutura. Bash e Python automatizam backup, verificação e restauração; Docker e Compose criam ambientes reproduzíveis; Ansible, Terraform e operadores de Kubernetes descrevem e reconciliam infraestrutura.

Um exercício valioso: toda semana, restaurar o último backup em um container e rodar verificações. Se falhar, você descobre antes do desastre. Pipelines de migração mantêm versões de esquema consistentes e revisáveis.

Segredos ficam fora do código. Use cofres, variáveis injetadas e permissões mínimas. Ambientes de teste criados a partir de backup precisam de dados mascarados quando houver informação pessoal.

Scripts operacionais devem ser idempotentes sempre que possível: executá-los novamente não deve duplicar objetos nem causar dano. Registre código de saída, duração e contexto, e encerre com erro se uma etapa crítica falhar. Em pipelines, revise migrações como código, aplique em cópia representativa e defina como voltar. Containers ajudam a reproduzir versões de cliente e servidor, mas não dispensam limites de recursos nem proteção das credenciais.

## Por que isso importa

Automação reduz erro humano e libera tempo. IaC e ambientes reproduzíveis tornam testes e recuperação parte da rotina.

## Conceitos-chave

- **script de rotina**
- **Docker/Compose**
- **IaC**
- **operador de Kubernetes**
- **segredos fora do código**
- **restauração periódica**

## Erros comuns

Automatizar sem tratar erro. Guardar segredo no repositório. Testar só em produção. Ignorar mascaramento de dados.

## Checklist de domínio

- [ ] Sei transformar rotina em script.
- [ ] Sei usar containers para teste.
- [ ] Sei proteger segredos.
- [ ] Sei planejar restauração automatizada.

## Resumo

Automação e IaC tornam a operação repetível. Scripts, containers e cofres de segredos sustentam testes e recuperação.
