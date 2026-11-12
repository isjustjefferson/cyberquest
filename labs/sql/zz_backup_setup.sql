DROP TABLE clientes CASCADE;

INSERT INTO pedidos (id, cliente_id, criado_em, status)
SELECT
  1000 + g,
  ((g - 1) % 40) + 1,
  TIMESTAMP '2024-06-01 08:00:00' + ((g - 1) % 30) * INTERVAL '1 day',
  (ARRAY['pago', 'pendente', 'entregue', 'cancelado'])[((g - 1) % 4) + 1]
FROM generate_series(1, 500) AS g;
