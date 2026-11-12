DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

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

CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco NUMERIC(10, 2) NOT NULL,
  estoque INTEGER NOT NULL
);

INSERT INTO produtos (id, nome, categoria, preco, estoque) VALUES
  (1, 'Pão Francês', 'Pães', 0.75, 120),
  (2, 'Pão de Forma', 'Pães', 8.90, 35),
  (3, 'Pão Integral', 'Pães', 11.50, 28),
  (4, 'Pão de Queijo', 'Pães', 4.50, 80),
  (5, 'Croissant', 'Pães', 7.25, 42),
  (6, 'Bolo de Cenoura', 'Doces', 14.90, 18),
  (7, 'Brigadeiro', 'Doces', 3.50, 90),
  (8, 'Cookie de Chocolate', 'Doces', 5.75, 60),
  (9, 'Torta de Limão', 'Doces', 18.00, 12),
  (10, 'Sonho de Creme', 'Doces', 6.40, 25),
  (11, 'Café Coado', 'Bebidas', 4.00, 200),
  (12, 'Café com Leite', 'Bebidas', 6.50, 150),
  (13, 'Suco de Laranja', 'Bebidas', 7.00, 80),
  (14, 'Água Mineral', 'Bebidas', 3.00, 240),
  (15, 'Refrigerante', 'Bebidas', 5.50, 120),
  (16, 'Coxinha', 'Salgados', 6.00, 55),
  (17, 'Empada de Frango', 'Salgados', 6.50, 48),
  (18, 'Esfiha de Carne', 'Salgados', 7.00, 40),
  (19, 'Pastel de Queijo', 'Salgados', 6.75, 52),
  (20, 'Quibe', 'Salgados', 5.25, 36),
  (21, 'Leite Integral', 'Laticínios', 5.20, 70),
  (22, 'Queijo Minas', 'Laticínios', 32.00, 15),
  (23, 'Requeijão', 'Laticínios', 9.80, 44),
  (24, 'Manteiga', 'Laticínios', 12.40, 33),
  (25, 'Iogurte Natural', 'Laticínios', 4.90, 64);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  criado_em TIMESTAMP NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO pedidos (id, cliente_id, criado_em, status)
SELECT
  g,
  ((g - 1) % 40) + 1,
  TIMESTAMP '2024-02-01 08:00:00'
    + ((g - 1) % 60) * INTERVAL '1 day'
    + ((g * 37) % 600) * INTERVAL '1 minute',
  (ARRAY['pago', 'pendente', 'entregue', 'cancelado'])[((g - 1) % 4) + 1]
FROM generate_series(1, 300) AS g;

CREATE TABLE itens_pedido (
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unit NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (pedido_id, produto_id)
);

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unit)
SELECT
  ((g - 1) / 3) + 1,
  ((g - 1) % 25) + 1,
  ((g - 1) % 5) + 1,
  p.preco
FROM generate_series(1, 800) AS g
JOIN produtos p ON p.id = ((g - 1) % 25) + 1;
