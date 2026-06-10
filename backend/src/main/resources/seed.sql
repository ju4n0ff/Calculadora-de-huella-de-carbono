-- ============================================================
-- SEED: Limpia y repuebla la base de datos luz_sur_simulador
-- ============================================================
-- Formas de ejecutar:
--   mysql -u root -p < seed.sql
--   (el USE ya está incluido abajo)
-- ============================================================

USE luz_sur_simulador;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM simulaciones_consumo;
DELETE FROM reclamos;
DELETE FROM consumos;
DELETE FROM suministros;
DELETE FROM cliente;
DELETE FROM tarifas;
DELETE FROM artefactos;
DELETE FROM administrador;
DELETE FROM usuarios;

ALTER TABLE simulaciones_consumo AUTO_INCREMENT = 1;
ALTER TABLE reclamos AUTO_INCREMENT = 1;
ALTER TABLE consumos AUTO_INCREMENT = 1;
ALTER TABLE suministros AUTO_INCREMENT = 1;
ALTER TABLE cliente AUTO_INCREMENT = 1;
ALTER TABLE tarifas AUTO_INCREMENT = 1;
ALTER TABLE artefactos AUTO_INCREMENT = 1;
ALTER TABLE administrador AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. TARIFAS
-- ============================================================
INSERT INTO tarifas (id_tarifa, nombre, precio_kwh, descripcion) VALUES
(1, 'BT2',   0.68, 'Baja Tensión 2 – uso general doméstico'),
(2, 'BT5B',  0.75, 'Baja Tensión 5B – comercial liviano'),
(3, 'UTP',   0.62, 'Tensión Uniforme – residencial popular'),
(4, 'MT2',   0.58, 'Media Tensión 2 – pequeña industria');

-- ============================================================
-- 2. CLIENTES
-- ============================================================
INSERT INTO cliente (id_cliente, nombre, dni, direccion, id_tarifa) VALUES
(41206, 'Vilma Angelica Diaz Diaz',    '12345678', 'Av. Las Flores 456', 1),
(41207, 'Juan Perez Gomez',           '87654321', 'Jr. Ica 123',        2),
(41208, 'Maria Fernanda Lopez Ruiz',  '11122333', 'Calle Los Olivos 789', 1),
(41209, 'Carlos Alberto Torres Vega', '44455666', 'Av. Primavera 321',   3),
(41210, 'Lucia Milagros Castillo Poma','77788999', 'Pasaje Sol 555',      2);

-- ============================================================
-- 3. ADMINISTRADORES
-- (contraseñas en texto plano – DataInitializer las hashea al arrancar)
-- ============================================================
INSERT INTO administrador (id_administrador, usuario, clave, nombre) VALUES
(1, 'admin',   'admin123',   'Administrador Principal'),
(2, 'soporte', 'soporte2024','Soporte Técnico');

-- ============================================================
-- 4. SUMINISTROS
-- ============================================================
INSERT INTO suministros (id_suministro, codigo_medidor, tipo_conexion, fuente_energia, estado, id_cliente) VALUES
(1, 'MED-001-A', 'Monofásico', 'Red Pública',  'activo',    41206),
(2, 'MED-002-B', 'Trifásico',  'Red Pública',  'activo',    41207),
(3, 'MED-003-C', 'Monofásico', 'Red Pública',  'pendiente', 41208),
(4, 'MED-004-D', 'Trifásico',  'Red Pública',  'activo',    41209),
(5, 'MED-005-E', 'Monofásico', 'Red Pública',  'rechazado', 41210);

-- ============================================================
-- 5. CONSUMOS (con artefactos en JSON)
-- ============================================================
INSERT INTO consumos (id_consumo, id_cliente, id_suministro, horas_uso, dias, total_kwh, costo_total, huella_carbono, fecha, detalles) VALUES
(1, 41206, 1, 4, 30, 84.00,  57.12, 17.64, '2026-05-01', '[]'),
(2, 41207, 2, 6, 30, 225.00, 168.75, 47.25, '2026-05-10',
 '{"artefactos":[{"id":1,"nombre":"Refrigeradora","watts":300},{"id":2,"nombre":"Televisor","watts":120},{"id":3,"nombre":"Laptop","watts":65}]}'),
(3, 41209, 4, 5, 30, 150.00, 93.00,  31.50, '2026-05-15',
 '{"artefactos":[{"id":1,"nombre":"Refrigeradora","watts":300},{"id":4,"nombre":"Lavadora","watts":500}]}'),
(4, 41206, 1, 8, 30, 520.00, 353.60, 109.20, '2026-05-20',
 '{"artefactos":[{"id":5,"nombre":"Ducha eléctrica","watts":4500},{"id":6,"nombre":"Microondas","watts":1000},{"id":7,"nombre":"Foco LED","watts":10}]}'),
(5, 41207, 2, 3, 30, 48.00,  36.00,  10.08, '2026-06-01',
 '{"artefactos":[{"id":3,"nombre":"Laptop","watts":65}]}');

-- ============================================================
-- 6. ARTEFACTOS (catálogo de referencia)
-- ============================================================
INSERT INTO artefactos (id, nombre, watts_base, categoria, horas_promedio_uso) VALUES
(1,  'Foco LED',           10,   'Iluminación',     6),
(2,  'Televisor',          120,  'Entretenimiento',  5),
(3,  'Refrigeradora',      300,  'Línea Blanca',     24),
(4,  'Laptop',             65,   'Cómputo',          8),
(5,  'Microondas',         1000, 'Línea Blanca',     0.5),
(6,  'Lavadora',           500,  'Línea Blanca',     1),
(7,  'Plancha',            1200, 'Línea Blanca',     0.5),
(8,  'Secadora',           1800, 'Línea Blanca',     0.5),
(9,  'Ducha eléctrica',    4500, 'Línea Blanca',     0.5),
(10, 'Ventilador',         80,   'Climatización',    6),
(11, 'Aire acondicionado', 1500, 'Climatización',    6),
(12, 'Horno eléctrico',    2000, 'Línea Blanca',     1),
(13, 'Cafetera',           900,  'Línea Blanca',     0.3),
(14, 'Licuadora',          350,  'Línea Blanca',     0.2),
(15, 'Router',             30,   'Cómputo',          24),
(16, 'Consola',            160,  'Entretenimiento',  3),
(17, 'Aspiradora',         1400, 'Línea Blanca',     0.5),
(18, 'Bomba de agua',      750,  'Línea Blanca',     2),
(19, 'Cargador celular',   10,   'Cómputo',          4),
(20, 'PC de escritorio',   250,  'Cómputo',          8);

-- ============================================================
-- 7. RECLAMOS
-- ============================================================
INSERT INTO reclamos (id_reclamo, id_cliente, id_suministro, descripcion, fecha, estado, respuesta_admin, id_administrador) VALUES
(1, 41206, 1, 'El recibo llegó con un cobro de S/. 120 pero mi consumo real fue menor.', '2026-05-05', 'resuelto',  'Se revisó el medidor y se ajustó el cobro. Nuevo monto: S/. 85.00.', 1),
(2, 41207, 2, 'Desde hace dos semanas el suministro presenta cortes intermitentes.',    '2026-05-12', 'en_proceso', 'Técnico asignado para revisión en 48 horas.', 1),
(3, 41208, 3, 'Solicito la instalación de un medidor bifásico.',                         '2026-06-01', 'pendiente',  NULL, NULL);

-- ============================================================
-- 8. USUARIOS
-- ============================================================
INSERT INTO usuarios (id, nombre, email, rol, activo) VALUES
(1, 'Vilma Diaz',    'vilma.diaz@email.com', 'CLIENTE',       1),
(2, 'Juan Perez',    'juan.perez@email.com', 'CLIENTE',       1),
(3, 'Admin PowerCalc','admin@powercalc.com',  'ADMINISTRADOR', 1);

-- ============================================================
-- 9. SIMULACIONES
-- ============================================================
INSERT INTO simulaciones_consumo (id, usuario_id, tipo_persona, tipo_medidor, carga_kw, energia_kwh, costo_soles, co2_kg, fecha_registro) VALUES
(1, 1, 'Natural',   'Bifásico',  2.5, 180.0, 122.40, 37.80, '2026-05-02 10:30:00'),
(2, 2, 'Jurídica',  'Trifásico', 5.5, 396.0, 297.00, 83.16, '2026-05-11 14:00:00');

-- ============================================================
-- FIN
-- ============================================================
