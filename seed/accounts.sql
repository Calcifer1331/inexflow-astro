-- Subtipos de cuentas globales
INSERT INTO account_subtype (id, name, code, account_type, business_id, created_at, updated_at)
VALUES
-- Activos
(101, 'Activo Corriente', 1, 'ASSETS', NULL, NOW(), NOW()),
(102, 'Inventario', 2, 'ASSETS', NULL, NOW(), NOW()),
(103, 'Cuentas por Cobrar', 3, 'ASSETS', NULL, NOW(), NOW()),

-- Pasivos
(201, 'Pasivo Corriente', 1, 'LIABILITIES', NULL, NOW(), NOW()),
(202, 'Cuentas por Pagar', 2, 'LIABILITIES', NULL, NOW(), NOW()),

-- Patrimonio
(301, 'Capital Social', 1, 'EQUITY', NULL, NOW(), NOW()),

-- Ingresos
(401, 'Ventas de Productos', 1, 'INCOME', NULL, NOW(), NOW()),
(402, 'Ventas de Servicios', 2, 'INCOME', NULL, NOW(), NOW()),

-- Gastos
(501, 'Gastos Operativos', 1, 'EXPENSE', NULL, NOW(), NOW()),
(502, 'Gastos Administrativos', 2, 'EXPENSE', NULL, NOW(), NOW()),

-- Costos
(601, 'Costo de Ventas', 1, 'COST', NULL, NOW(), NOW());

-- Cuentas globales
INSERT INTO account (id, name, code, account_subtype, business_id, created_at, updated_at)
VALUES
-- Activos Corrientes
(1001, 'Caja General', 1, 101, NULL, NOW(), NOW()),
(1002, 'Caja Menuda', 2, 101, NULL, NOW(), NOW()),
(1003, 'Banco', 3, 101, NULL, NOW(), NOW()),

-- Inventario
(1101, 'Inventario de Alimentos', 1, 102, NULL, NOW(), NOW()),
(1102, 'Inventario de Insumos', 2, 102, NULL, NOW(), NOW()),

-- Cuentas por Cobrar
(1201, 'Clientes', 1, 103, NULL, NOW(), NOW()),

-- Pasivo Corriente
(2101, 'Proveedores', 1, 202, NULL, NOW(), NOW()),

-- Capital
(3101, 'Capital Social', 1, 301, NULL, NOW(), NOW()),

-- Ingresos
(4101, 'Ventas de Productos', 1, 401, NULL, NOW(), NOW()),
(4102, 'Ventas de Servicios', 2, 402, NULL, NOW(), NOW()),

-- Gastos
(5101, 'Sueldos y Salarios', 1, 502, NULL, NOW(), NOW()),
(5102, 'Luz y Agua', 2, 501, NULL, NOW(), NOW()),
(5103, 'Servicios de Internet', 3, 501, NULL, NOW(), NOW()),

-- Costos
(6101, 'Costo de Ventas de Productos', 1, 601, NULL, NOW(), NOW());
