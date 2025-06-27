
-- Insertar usuarios demo y datos de prueba

-- Primero, insertamos los usuarios demo directamente en user_profiles
-- (Los usuarios de auth ya existen, solo necesitamos los perfiles)

-- Usuario Admin Demo
INSERT INTO public.user_profiles (user_id, email, name, role, active, phone, company_name)
VALUES (
  'b86c580e-2507-46a7-918a-12cae536446a', -- ID del usuario admin que ya existe
  'admin@gruas.com',
  'Administrador Sistema',
  'admin',
  true,
  '+56912345678',
  'TMS Grúas Ltda.'
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  active = EXCLUDED.active,
  phone = EXCLUDED.phone,
  company_name = EXCLUDED.company_name;

-- Crear usuarios demo adicionales para cliente y operador
-- Estos se crearán a través del registro normal de la aplicación

-- Insertar datos maestros de ejemplo
INSERT INTO public.clients (name, rut, email, phone, address, contact_person, active) VALUES
('Empresa Demo S.A.', '12345678-9', 'cliente@empresa.com', '+56987654321', 'Av. Principal 123, Santiago', 'Juan Pérez', true),
('Constructora ABC Ltda.', '98765432-1', 'contacto@abc.cl', '+56912345678', 'Los Leones 456, Las Condes', 'María González', true),
('Transportes Norte', '11223344-5', 'info@transportesnorte.cl', '+56998877665', 'Ruta 5 Norte Km 50', 'Carlos Silva', true)
ON CONFLICT (rut) DO NOTHING;

INSERT INTO public.operators (name, rut, email, phone, license_number, license_expiry, pin, active) VALUES
('Pedro Martínez', '55443322-1', 'operador@gruas.com', '+56944556677', 'A1-12345678', '2025-12-31', '1234', true),
('Ana Torres', '66554433-2', 'ana.torres@gruas.com', '+56955667788', 'A2-87654321', '2026-06-15', '5678', true),
('Luis Rojas', '77665544-3', 'luis.rojas@gruas.com', '+56966778899', 'A1-11223344', '2025-08-20', '9012', true)
ON CONFLICT (rut) DO NOTHING;

INSERT INTO public.cranes (name, brand, model, year, license_plate, capacity, active) VALUES
('Grúa 1', 'Volvo', 'FH16', 2020, 'GR-1234', 25000, true),
('Grúa 2', 'Mercedes-Benz', 'Actros', 2019, 'GR-5678', 30000, true),
('Grúa 3', 'Scania', 'R450', 2021, 'GR-9012', 35000, true),
('Grúa 4', 'DAF', 'XF105', 2018, 'GR-3456', 20000, true)
ON CONFLICT (license_plate) DO NOTHING;

-- Asignar operadores a grúas
UPDATE public.cranes SET operator_id = (SELECT id FROM public.operators WHERE email = 'operador@gruas.com' LIMIT 1) WHERE name = 'Grúa 1';
UPDATE public.cranes SET operator_id = (SELECT id FROM public.operators WHERE email = 'ana.torres@gruas.com' LIMIT 1) WHERE name = 'Grúa 2';
UPDATE public.cranes SET operator_id = (SELECT id FROM public.operators WHERE email = 'luis.rojas@gruas.com' LIMIT 1) WHERE name = 'Grúa 3';

-- Insertar algunos servicios de ejemplo
INSERT INTO public.services (
  folio, client_id, client_name, service_type_id, service_type_name,
  crane_id, crane_name, operator_id, operator_name,
  request_date, service_date, pickup_location, delivery_location,
  vehicle_brand, vehicle_model, license_plate, service_value,
  operator_commission, status, observations
) VALUES
(
  'SRV-' || TO_CHAR(NOW(), 'YYYY') || '-001',
  (SELECT id FROM public.clients WHERE email = 'cliente@empresa.com' LIMIT 1),
  'Empresa Demo S.A.',
  (SELECT id FROM public.service_types WHERE name = 'Traslado de Vehículo' LIMIT 1),
  'Traslado de Vehículo',
  (SELECT id FROM public.cranes WHERE name = 'Grúa 1' LIMIT 1),
  'Grúa 1',
  (SELECT id FROM public.operators WHERE email = 'operador@gruas.com' LIMIT 1),
  'Pedro Martínez',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 day',
  'Av. Providencia 1234, Santiago',
  'Av. Las Condes 5678, Las Condes',
  'Toyota',
  'Corolla',
  'AB-1234',
  25000,
  5000,
  'pending',
  'Servicio programado para mañana'
),
(
  'SRV-' || TO_CHAR(NOW(), 'YYYY') || '-002',
  (SELECT id FROM public.clients WHERE email = 'contacto@abc.cl' LIMIT 1),
  'Constructora ABC Ltda.',
  (SELECT id FROM public.service_types WHERE name = 'Rescate Vehicular' LIMIT 1),
  'Rescate Vehicular',
  (SELECT id FROM public.cranes WHERE name = 'Grúa 2' LIMIT 1),
  'Grúa 2',
  (SELECT id FROM public.operators WHERE email = 'ana.torres@gruas.com' LIMIT 1),
  'Ana Torres',
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE,
  'Ruta 68 Km 45',
  'Taller Mecánico Central, Santiago',
  'Ford',
  'Transit',
  'CD-5678',
  35000,
  7000,
  'completed',
  'Rescate completado exitosamente'
);
