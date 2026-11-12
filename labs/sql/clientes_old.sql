CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  criado_em TIMESTAMP NOT NULL
);

INSERT INTO clientes (id, nome, cidade, criado_em)
SELECT
  g,
  'Cliente ' || lpad(g::text, 2, '0'),
  (ARRAY['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Recife', 'Salvador', 'Fortaleza'])[((g - 1) % 8) + 1],
  TIMESTAMP '2024-01-01 09:00:00' + ((g - 1) % 30) * INTERVAL '1 day'
FROM generate_series(1, 40) AS g;
