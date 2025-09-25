INSERT INTO `services`
(`name`, `type`, `cost`, `selling_price`, `measure_unit_id`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Servicios que generan ingresos (venta de sopas)
('Servicio de sopa de pollo', 'income', 1.50, 3.50, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Servicio de sopa de verduras', 'income', 1.20, 3.00, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Servicio de sopa instantánea', 'income', 0.80, 2.50, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),

-- Servicios que generan gastos
('Limpieza de cocina', 'expense', 30.00, NULL, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Electricidad', 'expense', 100.00, NULL, 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
('Agua', 'expense', 20.00, NULL, 2, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);
