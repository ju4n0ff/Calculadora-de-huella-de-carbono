-- Seed data for PostgreSQL (Supabase)
-- Se ejecuta automáticamente al iniciar la app cuando las tablas están vacías.
-- Usa ON CONFLICT para ser seguro en reinicios.

-- 1. TARIFAS (referenciadas por cliente)
INSERT INTO tarifas (id_tarifa, nombre, precio_kwh, descripcion) VALUES
(1, 'BT5B - Residencial',   0.65, 'Tarifa básica residencial'),
(2, 'BT5C - Residencial',   0.72, 'Tarifa media residencial'),
(3, 'BT5D - Residencial',   0.80, 'Tarifa alta residencial')
ON CONFLICT (id_tarifa) DO NOTHING;
SELECT setval(pg_get_serial_sequence('tarifas', 'id_tarifa'), 3, true)
WHERE NOT EXISTS (SELECT 1 FROM tarifas WHERE id_tarifa > 3);

-- 2. CLIENTES
INSERT INTO cliente (id_cliente, nombre, dni, direccion, id_tarifa) VALUES
(41206, 'Vilma Angelica Diaz Diaz',    '12345678', 'Av. Las Flores 456', 3),
(41207, 'Juan Perez Gomez',            '23456789', 'Jr. Ica 123',        1),
(41208, 'Maria Lopez Huaman',          '34567890', 'Calle Los Olivos 789', 2),
(41209, 'Carlos Mendoza Rios',         '45678901', 'Av. Primavera 321',  3),
(41210, 'Lucia Fernandez Torres',      '56789012', 'Jr. Las Palmas 654', 1)
ON CONFLICT (id_cliente) DO NOTHING;
SELECT setval(pg_get_serial_sequence('cliente', 'id_cliente'), 41210, true)
WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE id_cliente > 41210);

-- 3. ADMINISTRADORES
INSERT INTO administrador (id_administrador, usuario, clave, nombre) VALUES
(1, 'admin',    'admin123', 'Administrador Principal'),
(2, 'ecoAdmin', 'eco2024',  'Gestor EcoSistemas')
ON CONFLICT (id_administrador) DO NOTHING;
SELECT setval(pg_get_serial_sequence('administrador', 'id_administrador'), 2, true)
WHERE NOT EXISTS (SELECT 1 FROM administrador WHERE id_administrador > 2);

-- 4. USUARIOS (para login con email)
INSERT INTO usuarios (id, nombre, email, rol, activo) VALUES
(1, 'Vilma Angelica Diaz Diaz',   'vilma.diaz@email.com',   'CLIENTE',       true),
(2, 'Juan Perez Gomez',           'juan.perez@email.com',   'CLIENTE',       true),
(3, 'Maria Lopez Huaman',         'maria.lopez@email.com',  'CLIENTE',       true),
(4, 'Carlos Mendoza Rios',        'carlos.mendoza@email.com', 'CLIENTE',    true),
(5, 'Lucia Fernandez Torres',     'lucia.fernandez@email.com', 'CLIENTE',   true),
(6, 'Administrador Principal',    'admin@ecoglow.com',      'ADMINISTRADOR', true)
ON CONFLICT (id) DO NOTHING;
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), 6, true)
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id > 6);

-- 5. SUMINISTROS
INSERT INTO suministros (id_suministro, codigo_medidor, tipo_conexion, fuente_energia, estado, id_cliente) VALUES
(1, 'MED-MONO-9912', 'Monofásico',          'Red Tradicional',         'Activo',    41206),
(2, 'MED-TRIF-5541', 'Trifásico',           'Red Tradicional',         'Activo',    41206),
(3, 'MED-MONO-3321', 'Monofásico',          'Energía Solar',           'Activo',    41207),
(4, 'MED-TRIF-7766', 'Trifásico',           'Red Tradicional',         'Pendiente', 41208),
(5, 'MED-MONO-1122', 'Monofásico',          'Red Tradicional',         'Activo',    41209),
(6, 'MED-BID-4455',  'Bidireccional',       'Energía Solar + Red',     'Activo',    41210)
ON CONFLICT (id_suministro) DO NOTHING;
SELECT setval(pg_get_serial_sequence('suministros', 'id_suministro'), 6, true)
WHERE NOT EXISTS (SELECT 1 FROM suministros WHERE id_suministro > 6);

-- 6. ARTEFACTOS (electrodomésticos)
INSERT INTO artefactos (id, nombre, watts_base, categoria, horas_promedio_uso) VALUES
(1,  'Foco LED',              10,   'Iluminación',      6),
(2,  'Televisor',             120,  'Entretenimiento',  5),
(3,  'Refrigeradora',         300,  'Linea Blanca',     24),
(4,  'Laptop',                65,   'Cómputo',          8),
(5,  'Microondas',            1000, 'Linea Blanca',     0.5),
(6,  'Lavadora',              500,  'Linea Blanca',     1),
(7,  'Plancha',               1200, 'Linea Blanca',     0.5),
(8,  'Secadora',              1800, 'Linea Blanca',     0.5),
(9,  'Ducha eléctrica',       4500, 'Baño',             0.5),
(10, 'Ventilador',            80,   'Climatización',    8),
(11, 'Aire acondicionado',    1500, 'Climatización',    6),
(12, 'Horno eléctrico',       2000, 'Cocina',           1),
(13, 'Cafetera',              900,  'Cocina',           0.3),
(14, 'Licuadora',             350,  'Cocina',           0.2),
(15, 'Router',                30,   'Redes',            24),
(16, 'Consola de videojuegos', 160, 'Entretenimiento',  3),
(17, 'Aspiradora',            1400, 'Limpieza',         0.5),
(18, 'Bomba de agua',         750,  'Hogar',            2),
(19, 'Cargador celular',      10,   'Cómputo',          4),
(20, 'PC de escritorio',      250,  'Cómputo',          8)
ON CONFLICT (id) DO NOTHING;
SELECT setval(pg_get_serial_sequence('artefactos', 'id'), 20, true)
WHERE NOT EXISTS (SELECT 1 FROM artefactos WHERE id > 20);

-- 7. CONSUMOS REGISTRADOS
INSERT INTO consumos (id_consumo, id_cliente, id_suministro, horas_uso, dias, total_kwh, costo_total, huella_carbono, fecha) VALUES
(1, 41206, 1, 4, 30, 120.50, 81.94,  25.30,  '2026-06-01'),
(2, 41206, 2, 6, 30, 245.80, 167.14, 51.62,  '2026-06-15'),
(3, 41207, 3, 5, 30, 180.00, 122.40, 37.80,  '2026-06-05'),
(4, 41208, 4, 3, 30, 90.20,  61.34,  18.94,  '2026-06-10'),
(5, 41209, 5, 8, 30, 310.20, 210.93, 65.14,  '2026-06-03'),
(6, 41210, 6, 4, 30, 145.00, 98.60,  30.45,  '2026-06-12'),
(7, 41206, 1, 4, 30, 132.80, 90.30,  27.89,  '2026-07-01'),
(8, 41207, 3, 5, 30, 195.50, 132.94, 41.06,  '2026-07-05'),
(9, 41209, 5, 8, 30, 330.40, 224.67, 69.38,  '2026-07-03')
ON CONFLICT (id_consumo) DO NOTHING;
SELECT setval(pg_get_serial_sequence('consumos', 'id_consumo'), 9, true)
WHERE NOT EXISTS (SELECT 1 FROM consumos WHERE id_consumo > 9);

-- 8. SIMULACIONES DE CONSUMO
INSERT INTO simulaciones_consumo (id, usuario_id, tipo_persona, tipo_medidor, carga_kw, energia_kwh, costo_soles, co2_kg, fecha_registro) VALUES
(1, 1, 'CLIENTE',  'Monofásico',   1.5,  120.00, 81.60,  25.20,  '2026-06-02 10:30:00'),
(2, 2, 'CLIENTE',  'Monofásico',   2.0,  180.00, 122.40, 37.80,  '2026-06-06 14:15:00'),
(3, 3, 'CLIENTE',  'Trifásico',    1.2,  90.00,  61.20,  18.90,  '2026-06-11 09:00:00'),
(4, 4, 'CLIENTE',  'Monofásico',   3.5,  310.00, 210.80, 65.10,  '2026-06-04 16:45:00'),
(5, 5, 'CLIENTE',  'Bidireccional', 1.8, 145.00, 98.60,  30.45,  '2026-06-13 11:20:00')
ON CONFLICT (id) DO NOTHING;
SELECT setval(pg_get_serial_sequence('simulaciones_consumo', 'id'), 5, true)
WHERE NOT EXISTS (SELECT 1 FROM simulaciones_consumo WHERE id > 5);
