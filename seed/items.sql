INSERT INTO `items`
(`name`, `type`, `cost`, `selling_price`, `stock`, `min_stock`, `measure_unit_id`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Ingredientes para sopas (suministros)
('Pollo', 'supply', 5.50, NULL, 50.000, 5.000, 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Verduras mixtas', 'supply', 2.00, NULL, 30.000, 5.000, 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Fideos', 'supply', 1.20, NULL, 100.000, 10.000, 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Caldo de pollo', 'supply', 0.80, NULL, 200.000, 20.000, 2, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Sal', 'supply', 0.05, NULL, 50.000, 5.000, 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),

-- Productos terminados (sopas listas para venta)
('Sopa de pollo', 'product', 1.50, 3.50, 0.000, 0.000, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Sopa de verduras', 'product', 1.20, 3.00, 0.000, 0.000, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Sopa instantánea', 'product', 0.80, 2.50, 0.000, 0.000, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);
