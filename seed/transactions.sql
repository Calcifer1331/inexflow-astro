-- Poblar tabla transactions, transaction_details y payments
-- Empresa: Venta de sopas 🥣

-- ========================================
-- 1. Compra de insumos
-- ========================================
INSERT INTO transactions
(number, contact_id, payment_status, description, type, due_date, total, created_at, updated_at, business_id)
VALUES
('C-0001', 1, 'paid', 'Compra de insumos para sopa de pollo', 'purchase_supply', '2025-09-25', 35.50, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO transaction_details
(transaction_id, name, entity_type, entity_id, measure_unit_symbol, quantity, unit_price, total, created_at, updated_at, business_id)
VALUES
(1, 'pechuga de pollo', 'item', 1, 'kg', 5.00, 4.50, 22.50, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(1, 'zanahoria', 'item', 2, 'kg', 3.00, 2.00, 6.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(1, 'caldo concentrado', 'item', 3, 'kg', 2.00, 3.50, 7.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO payments
(transaction_id, payment_method, amount, created_at, updated_at, business_id)
VALUES
(1, 'cash', 35.50, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

-- ========================================
-- 2. Compra de servicio
-- ========================================
INSERT INTO transactions
(number, contact_id, payment_status, description, type, due_date, total, created_at, updated_at, business_id)
VALUES
('C-0002', 1, 'paid', 'Servicio de limpieza de cocina', 'purchase_service', '2025-09-26', 15.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO transaction_details
(transaction_id, name, entity_type, entity_id, measure_unit_symbol, quantity, unit_price, total, created_at, updated_at, business_id)
VALUES
(2, 'limpieza profunda de cocina', 'service', 1, 'servicio', 1.00, 15.00, 15.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO payments
(transaction_id, payment_method, amount, created_at, updated_at, business_id)
VALUES
(2, 'transfer', 15.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

-- ========================================
-- 3. Venta de productos
-- ========================================
INSERT INTO transactions
(number, contact_id, payment_status, description, type, due_date, total, created_at, updated_at, business_id)
VALUES
('V-0001', 2, 'paid', 'Venta de sopas al restaurante El Sabor', 'sale_product', '2025-09-26', 48.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO transaction_details
(transaction_id, name, entity_type, entity_id, measure_unit_symbol, quantity, unit_price, total, created_at, updated_at, business_id)
VALUES
(3, 'sopa de pollo grande', 'item', 5, 'tazon', 20.00, 2.00, 40.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6),
(3, 'sopa de res mediana', 'item', 6, 'tazon', 8.00, 1.00, 8.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);

INSERT INTO payments
(transaction_id, payment_method, amount, created_at, updated_at, business_id)
VALUES
(3, 'cash', 48.00, NOW(), NOW(), 0x9311744C3746350284C9D06E8B5EA2D6);
