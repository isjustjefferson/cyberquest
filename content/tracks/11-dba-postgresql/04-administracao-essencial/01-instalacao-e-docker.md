---
slug: "instalacao-e-docker"
title: "Instalação e ambientes (pacotes e Docker)"
kind: lesson
difficulty: 2
est_minutes: 15
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Onde devem ficar os dados de um container PostgreSQL que precisa sobreviver a reinicializações?"
    options:
      - "Na camada gravável do container, desde que ele não seja removido"
      - "Num volume montado em /var/lib/postgresql/data"
      - "Dentro da imagem, com commit após cada escrita"
      - "Em /tmp, porque o PostgreSQL sincroniza tudo no desligamento"
    answerIndex: 1
    explanation: "O diretório de dados precisa viver fora da camada descartável do container. Um volume montado em /var/lib/postgresql/data preserva o cluster quando o container é recriado."
  - type: fill_command
    xp: 10
    question: "Complete o comando que inicia um PostgreSQL oficial com senha inicial e porta publicada."
    template: "docker run -e POSTGRES_PASSWORD=segredo -p 5432:5432 ___"
    blanks: ["postgres:16"]
    accepted:
      - ["postgres:16"]
      - ["postgres:17"]
      - ["postgres"]
    explanation: "A imagem oficial executa initdb no primeiro start. Fixe a versão major para não receber uma atualização inesperada."
  - type: order
    xp: 10
    question: "Ordene o ciclo de vida de uma instalação PostgreSQL via pacote."
    items:
      - "Iniciar o serviço com systemctl ou pg_ctl"
      - "Instalar o pacote do repositório PGDG"
      - "Conectar com psql"
      - "Criar o cluster de dados com initdb"
    correctOrder: [1, 3, 0, 2]
    explanation: "O pacote instala os binários; initdb cria o cluster; o serviço inicia o postmaster; por último o cliente conecta."
---

# Instalação e ambientes (pacotes e Docker)

Instalar PostgreSQL é uma decisão de operação, não apenas um clique. Existem três caminhos comuns: pacote do sistema, imagem de container e serviço gerenciado. Em todos eles, o conceito central é o **cluster**: um diretório de dados inicializado por `initdb`, contendo os bancos `template0`, `template1` e `postgres`, além de configurações e o WAL.

Nos pacotes Debian/Ubuntu, o repositório oficial PGDG entrega versões atuais e permite escolher a major. Em Red Hat e derivados, o equivalente são os RPMs. O pacote normalmente cria um cluster padrão e registra um serviço. Você inicia com `systemctl start postgresql` ou, de forma mais direta, com `pg_ctl -D "$PGDATA" start`. O cliente `psql` conecta na porta 5432 do host.

No Docker, a imagem oficial faz o `initdb` no primeiro start. As variáveis `POSTGRES_PASSWORD`, `POSTGRES_DB` e `POSTGRES_USER` configuram a senha e o banco inicial. Scripts montados em `/docker-entrypoint-initdb.d` rodam **apenas quando o diretório de dados está vazio**. Por isso, um volume em `/var/lib/postgresql/data` é obrigatório para persistência: sem ele, recriar o container apaga o banco.

Fixar a versão major evita surpresas. `postgres:16` e `postgres:17` têm formatos de dados diferentes e não sobem sobre o mesmo `PGDATA`. Atualizações menores dentro da mesma major são seguras e recomendadas; mudanças de major exigem dump/restore, `pg_upgrade` ou replicação lógica. O ambiente de laboratório da Padaria Byte usa `postgres:16`, alinhado ao `.env.example`.

## Por que isso importa

Um DBA precisa reproduzir ambientes, explicar onde os dados vivem e evitar perda por container descartável. Saber iniciar, parar e inspecionar o cluster é pré-requisito para backup, tuning e recuperação.

## Conceitos-chave

- **Cluster:** diretório `PGDATA` inicializado por `initdb`.
- **Imagem oficial:** executa `initdb` e lê scripts de inicialização.
- **Volume:** persistência fora do ciclo de vida do container.
- **Versão major:** mudanças incompatíveis exigem procedimento próprio.
- **Porta 5432:** padrão do protocolo PostgreSQL.

## Erros comuns

Subir container sem volume e perder dados ao recriar. Rodar scripts de inicialização esperando que executem de novo em um volume já populado. Publicar a porta na internet sem TLS e regras de acesso. Misturar versões de cliente e servidor sem conferir compatibilidade.

## Checklist de domínio

- [ ] Sei explicar o que o `initdb` cria.
- [ ] Sei subir um PostgreSQL com Docker e volume.
- [ ] Sei diferenciar atualização menor de mudança de major.
- [ ] Sei iniciar e parar o serviço com segurança.

## Resumo

Instalação escolhe binários, cluster e ciclo de vida. Pacotes servem ao host; containers pedem volume; gerenciado transfere parte da operação. Fixar a versão e preservar o `PGDATA` são regras universais.
