---
slug: "busca-textual"
title: "Busca textual"
kind: lesson
difficulty: 3
est_minutes: 15
xp: 50
status: draft
prerequisites: ["plpgsql-funcoes-e-procedures"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual índice costuma acelerar consultas com tsvector?"
    options:
      - "GIN"
      - "B-tree em boolean"
      - "BRIN em text"
      - "Hash em timestamp"
    answerIndex: 0
    explanation: "GIN indexa os lexemas do tsvector e acelera o operador @@. GiST também é possível, com outras características."
  - type: fill_command
    xp: 10
    question: "Complete o operador que testa correspondência entre tsvector e tsquery."
    template: "to_tsvector('portuguese', descricao) ___ to_tsquery('portuguese', 'chocolate')"
    blanks: ["@@"]
    accepted: [["@@"]]
    explanation: "O operador @@ verifica se o tsvector satisfaz a tsquery. A configuração de idioma precisa ser a mesma nos dois lados."
---

# Busca textual

`tsvector` representa o texto normalizado em lexemas; `tsquery` representa a consulta. `to_tsvector('portuguese', texto)` remove palavras comuns e aplica stemming. O operador `@@` testa a correspondência, e `ts_rank` ordena por relevância.

Para acelerar, crie índice GIN sobre a expressão `to_tsvector(...)` ou sobre uma coluna gerada. Colunas geradas mantêm o vetor atualizado automaticamente e simplificam consultas. Lembre de usar a mesma configuração de idioma na indexação e na busca.

Busca textual no PostgreSQL atende bem muitas aplicações e evita um serviço externo. Para requisitos avançados de relevância, sinônimos e escala, motores dedicados ainda podem ser necessários.

`plainto_tsquery` converte texto de usuário em termos conectados por AND, enquanto `websearch_to_tsquery` aceita operadores familiares como aspas e OR com uma sintaxe controlada. Isso é mais seguro e simples do que construir uma `tsquery` manualmente a partir de entrada arbitrária. Ao adicionar uma coluna gerada, escolha se ela será `STORED` e valide a configuração de idioma com dados reais. Refaça estatísticas após cargas grandes e use `EXPLAIN` para comprovar que o índice GIN está sendo escolhido.

## Por que isso importa

Buscar texto de forma ingênua com `LIKE '%termo%'` não escala. tsvector e GIN trazem relevância e desempenho sem sair do banco.

## Conceitos-chave

- **tsvector**
- **tsquery**
- **@@**
- **to_tsvector**
- **ts_rank**
- **GIN**
- **coluna gerada**

## Erros comuns

Misturar configurações de idioma. Indexar coluna em vez da expressão. Ignorar atualização do vetor. Comparar com LIKE sem medir.

## Checklist de domínio

- [ ] Sei montar tsvector e tsquery.
- [ ] Sei criar índice GIN.
- [ ] Sei ranquear resultados.

## Resumo

Busca textual normaliza, indexa e ranqueia. GIN sobre tsvector entrega desempenho; a configuração de idioma deve ser consistente.
