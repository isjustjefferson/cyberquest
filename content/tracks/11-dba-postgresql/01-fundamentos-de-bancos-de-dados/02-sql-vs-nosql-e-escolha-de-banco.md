---
slug: "sql-vs-nosql-e-escolha-de-banco"
title: "SQL vs. NoSQL e a escolha do banco"
kind: lesson
difficulty: 1
est_minutes: 10
xp: 30
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: match
    xp: 10
    question: "Relacione o caso de uso à família de banco mais natural."
    pairs:
      - ["Pagamentos com regras entre contas", "Relacional"]
      - ["Cache de sessão com expiração", "Chave-valor"]
      - ["Catálogo com documentos de formato variável", "Documento"]
      - ["Rede de relacionamentos entre pessoas", "Grafo"]
    explanation: "Transações entre entidades relacionadas pedem relacional; cache pede chave-valor; documentos variáveis pedem documento; travessia de relações pede grafo."
  - type: single_choice
    xp: 10
    question: "Qual exigência favorece fortemente um banco relacional?"
    options:
      - "Transações consistentes sobre dados relacionados"
      - "Guardar arquivos binários grandes em qualquer formato"
      - "Ter a maior taxa de escrita possível sem esquema"
      - "Evitar qualquer planejamento de modelagem"
    answerIndex: 0
    explanation: "O modelo relacional foi desenhado para relações e transações com garantias fortes. Outras famílias podem ser melhores para cache, documentos ou grafos."
  - type: true_false
    xp: 10
    statement: "NoSQL é sempre mais rápido que SQL."
    answer: false
    explanation: "O desempenho depende do padrão de acesso. Um banco relacional com índices adequados pode ser muito rápido; um banco de documentos pode ser lento em consultas relacionais complexas."
---

# SQL vs. NoSQL e a escolha do banco

A Padaria Byte tem pedidos, clientes, produtos e itens de pedido. Esses dados se relacionam: um pedido pertence a um cliente e contém produtos. A equipe também quer guardar preferências de interface, que mudam de formato com frequência, e um cache de sessões. Seria um erro tentar resolver os três problemas com a mesma ferramenta apenas por familiaridade. A escolha do banco é uma decisão de engenharia baseada no padrão de acesso, nas garantias necessárias e no custo de errar.

Bancos **relacionais** representam dados em tabelas com esquema e usam SQL para consultas. São fortes quando as relações importam, quando várias operações precisam acontecer juntas e quando a consistência é uma exigência de negócio. Um pedido não pode apontar para um cliente inexistente; uma baixa de estoque precisa ser atômica. PostgreSQL, MySQL, SQL Server e Oracle estão nessa família.

Bancos de **documento**, como MongoDB, guardam estruturas semelhantes a JSON. São convenientes quando cada registro tem formato próprio e o aplicativo lê o documento inteiro. Bancos **chave-valor**, como Redis, associam uma chave a um valor e brilham em cache, sessões e filas simples. Bancos de **coluna** otimizam leituras analíticas sobre grandes volumes. Bancos de **grafo** tornam naturais as travessias de relacionamentos. Cada família tem um centro de gravidade, não uma coroa universal.

O PostgreSQL ocupa um espaço interessante porque também oferece JSONB, arrays, busca textual e extensões. Isso permite começar com um modelo relacional e usar documentos em partes específicas do sistema. A Padaria Byte pode manter pedidos relacionais e guardar preferências em JSONB na mesma base. “Poliglotismo” — usar bancos diferentes para necessidades diferentes — também é válido, desde que a equipe aceite o custo operacional de manter mais sistemas.

## Por que isso importa

Escolher por moda produz dois erros opostos. O primeiro é forçar dados relacionais em um banco sem transações e depois reconstruir integridade na aplicação. O segundo é usar um banco relacional para um cache de alta frequência e transformar cada leitura em uma consulta complexa. Nenhum dos dois é necessariamente fatal, mas ambos aumentam custo e superfície de falha.

A pergunta útil é: **qual problema eu tenho e quanto custa errar?** Se a resposta envolve dinheiro, estoque, permissões ou relações que precisam permanecer válidas, comece pelo relacional. Se envolve dados efêmeros, formato variável e acesso por chave, avalie alternativas. Se o volume analítico é gigantesco, avalie um modelo colunar. E sempre meça: benchmarks genéricos não substituem uma carga realista.

## Conceitos-chave

- **Relacional:** tabelas, esquema, SQL, transações e integridade referencial.
- **Documento:** registros flexíveis, geralmente JSON, lidos como unidade.
- **Chave-valor:** acesso direto por chave, comum em cache e sessão.
- **Colunar:** armazenamento por coluna, útil em análise.
- **Grafo:** vértices e arestas, útil para relacionamentos profundos.
- **Consistência:** garantia de que leituras veem um estado válido.
- **Escalabilidade:** capacidade de crescer sem degradar de forma inaceitável.

## Erros comuns

Trocar tudo para NoSQL “porque escala” sem medir é um clássico. Outro erro é usar JSONB para evitar qualquer modelagem relacional, criando um banco de documentos disfarçado e perdendo constraints. Também é comum ignorar o custo de consistência eventual em fluxos de pagamento. Por fim, não confunda flexibilidade de esquema com ausência de regras: alguém precisará validar os documentos.

## Checklist de domínio

- [ ] Consigo explicar uma vantagem e uma limitação de cada família.
- [ ] Consigo justificar a escolha de um banco para um caso simples.
- [ ] Consigo identificar quando JSONB é adequado e quando é fuga de modelagem.
- [ ] Consigo citar o custo de manter mais de um banco em produção.

## Resumo

Não existe banco universal. O relacional é a escolha natural quando relações, transações e integridade dominam. Outras famílias atendem cache, documentos, análise e grafos com centros de gravidade diferentes. O PostgreSQL cobre muito terreno, mas a decisão deve nascer do problema e do custo de errar, não da moda.
