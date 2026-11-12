---
slug: "backup-fisico-pg-basebackup"
title: "Backup físico com pg_basebackup"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: complete
prerequisites: ["pg-dump-e-pg-restore"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual atributo o papel precisa para executar pg_basebackup?"
    options:
      - "REPLICATION"
      - "CREATEDB"
      - "BYPASSRLS"
      - "LOGIN apenas"
    answerIndex: 0
    explanation: "O backup físico usa o protocolo de replicação. O papel precisa de REPLICATION e de uma regra compatível no pg_hba.conf."
  - type: true_false
    xp: 8
    statement: "Um backup físico pode ser restaurado em uma versão major diferente do PostgreSQL."
    answer: false
    explanation: "O formato interno e o catálogo mudam entre majors. Backup físico exige mesma versão major e arquitetura compatível."
  - type: match
    xp: 12
    question: "Relacione a opção do pg_basebackup à função."
    pairs:
      - ["-D", "Diretório de destino"]
      - ["-Ft", "Formato tar"]
      - ["-z", "Compressão gzip no formato tar"]
      - ["-X stream", "Inclui o WAL necessário no stream"]
      - ["-P", "Mostra progresso"]
    explanation: "O backup base precisa de WAL para ficar consistente. -X stream inclui esse WAL; sem ele, é preciso arquivá-lo separadamente."
---

# Backup físico com pg_basebackup

Enquanto o backup lógico exporta objetos, o **backup físico** copia os arquivos do cluster. `pg_basebackup` faz isso de forma consistente, sem parar o servidor, e inclui o WAL necessário para que a cópia seja recuperável. Ele é a base para PITR e para criar réplicas em streaming.

O papel usado precisa do atributo `REPLICATION` e de uma entrada no `pg_hba.conf` que permita a conexão de replicação. Comandos típicos usam `-D` para destino, `-X stream` para incluir WAL, `-P` para progresso e `-Ft -z` para gerar tar comprimido. Em bases grandes, ferramentas como pgBackRest e Barman adicionam retenção, verificação e restauração incremental.

O backup físico não é portátil entre versões major. A mesma restrição vale para arquitetura e configuração de pages. Para migrar de 16 para 17, use dump/restore, `pg_upgrade` ou replicação lógica. O backup físico serve para recuperar a mesma major com fidelidade.

Guarde o backup em local seguro, cifrado e fora do servidor de origem. Teste a restauração em uma instância separada. Meça o tempo de cópia e de recuperação, porque ambos afetam RPO e RTO. Um backup base sem WAL arquivado limita a recuperação ao momento da cópia.

## Por que isso importa

Backup físico é a espinha dorsal de recuperação de desastre e réplicas. Entender suas exigências evita descobrir tarde demais que o arquivo não sobe na versão ou arquitetura errada.

## Conceitos-chave

- **Backup base:** cópia física consistente.
- **REPLICATION:** atributo necessário.
- **-X stream:** WAL incluído no backup.
- **Mesma major:** requisito de restauração.
- **pgBackRest/Barman:** gestão profissional.

## Erros comuns

Esquecer WAL. Tentar restaurar em outra major. Não testar. Deixar o backup acessível ao mesmo usuário comprometido. Ignorar o tempo de cópia.

## Checklist de domínio

- [ ] Sei criar um backup base.
- [ ] Sei explicar o papel do WAL.
- [ ] Sei citar as limitações de versão.
- [ ] Sei planejar um teste de restauração.

## Resumo

pg_basebackup copia o cluster de forma consistente e alimenta PITR e réplicas. Exige REPLICATION, WAL e mesma major. A cópia só vale depois de restaurada e testada.
