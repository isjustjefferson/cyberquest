---
slug: "estrategias-de-backup"
title: "Estratégias de backup"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: ["estrutura-de-diretorios-e-catalogos"]
lab_slug: null
exercises:
  - type: match
    xp: 12
    question: "Relacione a sigla ao significado."
    pairs:
      - ["RPO", "Quanto de dados posso perder"]
      - ["RTO", "Em quanto tempo preciso voltar a operar"]
      - ["3-2-1", "Três cópias, dois meios, uma fora do site"]
      - ["Restauração", "Prova de que o backup funciona"]
    explanation: "RPO e RTO vêm do negócio. A estratégia técnica precisa atendê-los, e só a restauração comprova o resultado."
  - type: single_choice
    xp: 10
    question: "Qual é a única prova real de que um backup serve?"
    options:
      - "O arquivo existir no servidor"
      - "O backup ter sido concluído sem erro"
      - "Restaurá-lo com sucesso em um ambiente de teste"
      - "O arquivo estar compactado"
    answerIndex: 2
    explanation: "Backup não testado é esperança. Restaurar em ambiente controlado revela dependências, credenciais, tempo e integridade."
  - type: multi_choice
    xp: 12
    question: "Quais são boas práticas de backup?"
    options:
      - "Cifrar os arquivos"
      - "Manter cópias em locais diferentes"
      - "Testar restaurações periodicamente"
      - "Guardar a única cópia no mesmo disco do banco"
      - "Registrar o procedimento de recuperação"
    answerIndexes: [0, 1, 2, 4]
    explanation: "Criptografia, redundância geográfica, testes e documentação reduzem risco. Uma única cópia no mesmo disco não protege contra falha do disco."
---

# Estratégias de backup

Antes de escolher ferramenta, pergunte ao negócio: se o servidor sumir agora, quanto trabalho pode ser perdido e em quanto tempo precisamos voltar? As respostas são **RPO** (Recovery Point Objective) e **RTO** (Recovery Time Objective). RPO define a frequência mínima de cópia ou o uso de WAL contínuo. RTO define se um dump lento é aceitável ou se é preciso um standby pronto para promoção.

Backup lógico exporta objetos e dados, normalmente com `pg_dump`. É portátil, permite restaurar partes e atravessa versões com mais facilidade, mas fica lento em bases grandes. Backup físico copia arquivos do cluster com `pg_basebackup` ou snapshot, é rápido de restaurar e serve de base para PITR e réplicas. Backup contínuo arquiva WAL e permite recuperar até um instante específico.

A regra 3-2-1 continua válida: três cópias, em dois meios diferentes, com uma fora do site. Cifre os arquivos, restrinja acesso e proteja as chaves separadamente. Ransomware procura backups acessíveis; um backup montado com escrita pelo servidor comprometido pode ser apagado junto. Considere cópias imutáveis ou offline.

Documente o procedimento e ensaie. Inclua criação do banco, roles, extensões, restore de dados, validação de contagens e liberação para uso. Meça o tempo real de restauração. Um backup que leva 12 horas pode atender ao RPO e falhar no RTO.

## Por que isso importa

Backup é a última linha de defesa contra erro humano, falha de disco, corrupção e ataque. A estratégia precisa nascer dos objetivos do negócio, não do gosto técnico.

## Conceitos-chave

- **RPO:** perda máxima aceitável.
- **RTO:** tempo máximo de recuperação.
- **Backup lógico:** objetos e dados.
- **Backup físico:** arquivos do cluster.
- **WAL contínuo:** recuperação point-in-time.
- **3-2-1:** redundância de cópias.

## Erros comuns

Nunca testar a restauração. Manter backup no mesmo disco. Esquecer roles e extensões. Não documentar dependências. Cifrar e perder a chave.

## Checklist de domínio

- [ ] Sei explicar RPO e RTO.
- [ ] Sei diferenciar backup lógico e físico.
- [ ] Sei aplicar a regra 3-2-1.
- [ ] Sei planejar um teste de restauração.

## Resumo

Backup começa nos objetivos do negócio. Lógico e físico resolvem problemas diferentes; WAL fecha a lacuna de tempo. Só a restauração testada prova que existe recuperação.
