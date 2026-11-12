---
slug: "boss-programacao"
title: "Boss: Programação"
kind: boss
difficulty: 3
est_minutes: 12
xp: 100
status: draft
prerequisites: ["plpgsql-funcoes-e-procedures", "triggers", "extensoes", "busca-textual"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 12
    question: "Uma função só lê o banco e não altera dados. Qual volatilidade mínima é adequada?"
    options:
      - "STABLE"
      - "VOLATILE"
      - "IMMUTABLE"
      - "SECURITY DEFINER"
    answerIndex: 0
    explanation: "STABLE permite leitura com snapshot fixo e não promete imutabilidade entre chamadas. IMMUTABLE seria uma promessa mais forte do que o necessário."
  - type: single_choice
    xp: 12
    question: "Qual extensão ajuda a buscar produtos por trecho de nome?"
    options:
      - "pg_trgm"
      - "pg_cron"
      - "file_fdw"
      - "pgcrypto"
    answerIndex: 0
    explanation: "pg_trgm indexa trigramas e acelera similaridade e buscas com LIKE '%termo%'."
  - type: match
    xp: 12
    question: "Relacione o recurso ao cenário."
    pairs:
      - ["Trigger", "Auditar mudança de preço"]
      - ["Procedure", "Reajustar preços com CALL"]
      - ["FDW", "Consultar outro banco"]
      - ["tsvector", "Buscar descrição com relevância"]
    explanation: "Cada recurso resolve um tipo de necessidade. Misturar responsabilidades aumenta a complexidade."
  - type: true_false
    xp: 10
    statement: "Uma função IMMUTABLE pode depender de uma configuração de sessão."
    answer: false
    explanation: "Se o resultado muda com a sessão, a função não é imutável. Marcar assim gera cache e índices incorretos."
  - type: order
    xp: 12
    question: "Ordene a criação de uma busca textual indexada."
    items:
      - "Criar índice GIN sobre a expressão"
      - "Escolher a configuração de idioma"
      - "Montar a consulta com @@ e ts_rank"
      - "Validar plano e resultados"
    correctOrder: [1, 0, 2, 3]
    explanation: "Defina o idioma, indexe a mesma expressão, consulte e valide. Idiomas diferentes quebram a correspondência."
  - type: single_choice
    xp: 10
    question: "Qual é a melhor proteção ao criar uma função SECURITY DEFINER?"
    options:
      - "Fixar search_path e revisar os objetos acessados"
      - "Conceder superusuário ao dono"
      - "Desabilitar logs"
      - "Usar VOLATILE por padrão"
    answerIndex: 0
    explanation: "Fixar search_path evita sequestro de nomes; revisar objetos limita o que a função pode alcançar."
---

# Boss: Programação

Programação no banco combina poder e responsabilidade. Funções e procedures encapsulam operações; triggers garantem reações automáticas; extensões ampliam recursos; FDW integra fontes; busca textual resolve relevância.

A escolha depende da invariante e do custo. Lógica crítica que precisa valer para qualquer cliente pode morar no banco. Regras de aplicação complexas costumam ser mais fáceis de evoluir fora dele. Triggers exigem documentação; SECURITY DEFINER exige search_path fixo; IMMUTABLE exige honestidade.

Uma boa revisão começa pelo contexto: quem chama a rotina, com quais permissões, qual volume e como será depurada. Antes de adicionar uma extensão, verifique origem e suporte; antes de criar um FDW, meça a rede e o volume transferido; antes de indexar texto, mantenha idioma e expressão consistentes. Os exercícios reúnem essas decisões e pedem o recurso mais simples que resolve o caso, sem transformar o servidor em uma caixa de lógica impossível de observar.

Depois de cada mudança, valide o plano, o resultado e o efeito para usuários que não são administradores. Registre dependências e um caminho para reverter.

Ao final, você deve conseguir escolher o recurso certo e reconhecer os riscos. Simplicidade e clareza valem mais que esperteza.

## Checklist de domínio

- [ ] Sei escolher entre função, procedure e trigger.
- [ ] Sei avaliar volatilidade.
- [ ] Sei proteger SECURITY DEFINER.
- [ ] Sei associar extensões a necessidades.
- [ ] Sei indexar busca textual.

## Resumo

O banco programa perto dos dados. Use os recursos com critério, documente o que é implícito e proteja os privilégios elevados.
