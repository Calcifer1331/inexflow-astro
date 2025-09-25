INSERT INTO `recipes`
(`output_type`, `output_id`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Receta de productos
('item', 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sopa de pollo
('item', 2, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sopa de verduras
('item', 3, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sopa instantánea

-- Receta de servicios (opcional: por ejemplo, sopa servida con atención)
('service', 1, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6); -- Servicio de sopa de pollo


INSERT INTO `recipe_components`
(`recipe_id`, `input_type`, `input_id`, `quantity`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Sopa de pollo (item_id = 1)
(1, 'item', 1, 0.200, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Pollo 0.2 kg
(1, 'item', 2, 0.150, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Verduras 0.15 kg
(1, 'item', 3, 0.050, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Fideos 0.05 kg
(1, 'item', 4, 0.250, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Caldo 0.25 L
(1, 'item', 5, 0.005, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sal 0.005 kg
(2, 'item', 2, 0.200, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Verduras 0.2 kg
(2, 'item', 3, 0.050, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Fideos 0.05 kg
(2, 'item', 4, 0.200, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Caldo 0.2 L
(2, 'item', 5, 0.005, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sal 0.005 kg
(3, 'item', 3, 0.030, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Fideos 0.03 kg
(3, 'item', 5, 0.002, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Sal 0.002 kg
(4, 'item', 1, 0.200, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6), -- Pollo 0.2 kg
(4, 'item', 2, 0.150, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(4, 'item', 3, 0.050, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(4, 'item', 4, 0.250, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(4, 'item', 5, 0.005, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

