---
slug: "acid-e-transacoes-em-uma-pagina"
title: "ACID e transações em uma página"
kind: lesson
difficulty: 2
est_minutes: 12
xp: 40
status: complete
prerequisites: []
lab_slug: null
exercises:
  - type: match
    xp: 10
    question: "Relacione cada letra do ACID à garantia correspondente."
    pairs:
      - ["Atomicidade", "Tudo acontece ou nada acontece"]
      - ["Consistência", "As regras do banco continuam válidas ao final"]
      - ["Isolamento", "Transações concorrentes não produzem efeitos indevidos"]
      - ["Durabilidade", "O que foi confirmado sobrevive a uma queda"]
    explanation: "ACID descreve quatro garantias complementares. Elas não dizem que o sistema nunca falha, mas definem o que o banco promete mesmo quando algo dá errado."
  - type: single_choice
    xp: 10
    question: "Qual propriedade garante que uma transferência falhe por inteiro ou tenha sucesso por inteiro?"
    options:
      - "Atomicidade"
      - "Durabilidade"
      - "Isolamento"
      - "Compressão"
    answerIndex: 0
    explanation: "Atomicidade trata a transação como uma unidade indivisível: se uma parte falhar, as alterações anteriores são desfeitas."
  - type: order
    xp: 10
    question: "Ordene o ciclo básico de uma transação bem-sucedida."
    items:
      - "Iniciar a transação"
      - "Executar as operações"
      - "Confirmar com COMMIT"
      - "Persistir o resultado durável"
    correctOrder: [0, 1, 2, 3]
    explanation: "BEGIN abre a unidade; as operações são executadas; COMMIT confirma; o WAL e a persistência garantem a durabilidade."
---

# ACID e transações em uma página

Imagine que a Padaria Byte recebeu um pagamento e precisa debitar o saldo de uma conta e creditar outra. Se o sistema debitar e cair antes de creditar, o dinheiro some. Se creditar duas vezes por causa de uma repetição de rede, o dinheiro aparece do nada. A transação existe para transformar um conjunto de operações em uma unidade confiável. ACID é o nome das quatro garantias que tornam isso possível.

**Atomicidade** significa “tudo ou nada”. Uma transação que altera duas tabelas não pode deixar uma alteração aplicada e a outra perdida. Se qualquer comando falhar, o banco desfaz o que já foi feito dentro da transação. Na prática, o `ROLLBACK` explícito e o rollback automático em caso de erro usam essa garantia. É por isso que conseguimos corrigir um pedido e seus itens sem medo de deixar o banco pela metade.

**Consistência** significa que as regras declaradas continuam válidas ao final. Chaves primárias não se repetem, chaves estrangeiras apontam para linhas existentes, restrições de `CHECK` são respeitadas e tipos são compatíveis. O banco não impede toda lógica de negócio errada — ele não sabe que um desconto de 90% pode ser fraude —, mas impede violações estruturais. A aplicação e o banco trabalham juntos nesse contrato.

**Isolamento** trata da concorrência. Duas transações ao mesmo tempo não devem enxergar estados intermediários incoerentes nem sobrescrever o trabalho uma da outra de forma imprevisível. O PostgreSQL usa MVCC para que uma leitura veja uma versão consistente dos dados sem bloquear escritores desnecessariamente. O nível de isolamento escolhido define quais anomalias são aceitáveis. Quanto maior o isolamento, maior o custo de concorrência.

**Durabilidade** significa que uma transação confirmada não desaparece por causa de uma queda de energia. O PostgreSQL registra alterações no **WAL** (Write-Ahead Log) antes de considerar o `COMMIT` concluído. Se o servidor reiniciar, ele recupera o estado a partir do log. Durabilidade não é backup: ela protege contra falha do processo ou da máquina, mas não contra um `DELETE` equivocado nem contra perda do disco.

## Por que isso importa

Sem transações, a aplicação precisaria implementar compensações manuais para cada falha possível. Isso é caro e fácil de errar. Com transações, o programador declara a unidade de trabalho e deixa o banco cuidar da atomicidade e da recuperação. A Padaria Byte pode confirmar um pedido, baixar estoque e registrar o pagamento em uma única operação lógica.

Transações também têm custo. Uma transação longa segura recursos, atrasa a limpeza de versões antigas e aumenta o impacto de locks. O DBA precisa equilibrar unidades curtas e coerentes com a necessidade de consistência. Uma transação que espera a resposta de um usuário por minutos é um problema operacional.

## Conceitos-chave

- **Transação:** unidade de trabalho confirmada ou desfeita por inteiro.
- **BEGIN / COMMIT / ROLLBACK:** início, confirmação e desfazer.
- **Atomicidade:** sem estados parciais.
- **Consistência:** restrições válidas ao final.
- **Isolamento:** controle dos efeitos da concorrência.
- **Durabilidade:** confirmação sobrevive a falhas.
- **WAL:** registro prévio das alterações usado na recuperação.

## Erros comuns

Deixar uma transação aberta enquanto o usuário pensa é um erro clássico. Ignorar o custo de um `COMMIT` em lote gigantesco também: lotes enormes aumentam locks, WAL e tempo de recuperação. Outro erro é acreditar que durabilidade substitui backup. Por fim, não confunda consistência do banco com validação completa de negócio; regras que dependem de contexto precisam ser implementadas e testadas.

## Checklist de domínio

- [ ] Consigo explicar as quatro letras do ACID com exemplos.
- [ ] Consigo diferenciar rollback de falha de disco.
- [ ] Consigo descrever por que transações longas são perigosas.
- [ ] Consigo explicar por que durabilidade não é backup.

## Resumo

ACID define o contrato de confiabilidade de uma transação: tudo ou nada, regras válidas, concorrência controlada e persistência após falhas. O PostgreSQL implementa essas garantias com MVCC e WAL. Entender o contrato evita tanto o medo excessivo de transações quanto o uso irresponsável de unidades longas.
