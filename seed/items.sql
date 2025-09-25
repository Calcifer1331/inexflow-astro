INSERT INTO `items`
(`name`, `type`, `cost`, `selling_price`, `stock`, `min_stock`, `measure_unit_id`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Ingredientes para sopas (suministros)
('Pollo', 'supply', 5.50, NULL, 50.000, 5.000, 1, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Verduras mixtas', 'supply', 2.00, NULL, 30.000, 5.000, 1, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Fideos', 'supply', 1.20, NULL, 100.000, 10.000, 1, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Caldo de pollo', 'supply', 0.80, NULL, 200.000, 20.000, 2, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Sal', 'supply', 0.05, NULL, 50.000, 5.000, 1, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),

-- Productos terminados (sopas listas para venta)
('Sopa de pollo', 'product', 1.50, 3.50, 0.000, 0.000, 3, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Sopa de verduras', 'product', 1.20, 3.00, 0.000, 0.000, 3, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-',''))),
('Sopa instantánea', 'product', 0.80, 2.50, 0.000, 0.000, 3, NOW(), NOW(), UNHEX(REPLACE(UUID(),'-','')));
