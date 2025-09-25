INSERT INTO `measure_units` 
(`name`, `symbol`, `type`, `created_at`, `updated_at`, `business_id`)
VALUES
-- Unidades de peso
('Kilogramo', 'kg', 'weight', NOW(), NOW(), NULL),
('Gramo', 'g', 'weight', NOW(), NOW(), NULL),
('Tonelada', 't', 'weight', NOW(), NOW(), NULL),

-- Unidades de volumen
('Litro', 'L', 'volume', NOW(), NOW(), NULL),
('Mililitro', 'mL', 'volume', NOW(), NOW(), NULL),
('Metro cúbico', 'm³', 'volume', NOW(), NOW(), NULL),

-- Unidades de longitud
('Metro', 'm', 'length', NOW(), NOW(), NULL),
('Centímetro', 'cm', 'length', NOW(), NOW(), NULL),
('Milímetro', 'mm', 'length', NOW(), NOW(), NULL),

-- Unidades de área
('Metro cuadrado', 'm²', 'area', NOW(), NOW(), NULL),
('Hectárea', 'ha', 'area', NOW(), NOW(), NULL),

-- Unidades de tiempo
('Hora', 'h', 'time', NOW(), NOW(), NULL),
('Minuto', 'min', 'time', NOW(), NOW(), NULL),
('Segundo', 's', 'time', NOW(), NOW(), NULL),

-- Unidades por conteo
('Unidad', 'ud', 'unit', NOW(), NOW(), NULL),
('Docena', 'dz', 'unit', NOW(), NOW(), NULL),

-- Unidades de moneda
('Dólar estadounidense', 'USD', 'currency', NOW(), NOW(), NULL),
('Euro', 'EUR', 'currency', NOW(), NOW(), NULL),
('Peso mexicano', 'MXN', 'currency', NOW(), NOW(), NULL);
