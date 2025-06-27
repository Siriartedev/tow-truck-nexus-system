
-- Crear tipos de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'operator');

-- Crear tabla de perfiles de usuario
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'client',
  active BOOLEAN NOT NULL DEFAULT true,
  rut TEXT,
  address TEXT,
  company_name TEXT,
  pin TEXT, -- Para operadores
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS en user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = auth.uid();
$$;

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = _role AND active = true
  );
$$;

-- Políticas RLS para user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (user_id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (user_id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "Admins can insert profiles"
  ON public.user_profiles FOR INSERT
  WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can delete profiles"
  ON public.user_profiles FOR DELETE
  USING (public.has_role('admin'));

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'client')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear tablas principales del sistema
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rut TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  contact_person TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rut TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  pin TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.cranes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT UNIQUE NOT NULL,
  capacity INTEGER,
  operator_id UUID REFERENCES public.operators(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  client_name TEXT NOT NULL,
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  service_type_name TEXT NOT NULL,
  crane_id UUID REFERENCES public.cranes(id),
  crane_name TEXT,
  operator_id UUID REFERENCES public.operators(id),
  operator_name TEXT,
  request_date DATE NOT NULL,
  service_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  license_plate TEXT,
  service_value DECIMAL(10,2),
  operator_commission DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas para clients
CREATE POLICY "Clients can view their own data"
  ON public.clients FOR SELECT
  USING (user_id = auth.uid() OR public.has_role('admin') OR public.has_role('operator'));

CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL
  USING (public.has_role('admin'));

-- Políticas para operators
CREATE POLICY "Operators can view their own data"
  ON public.operators FOR SELECT
  USING (user_id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "Admins can manage operators"
  ON public.operators FOR ALL
  USING (public.has_role('admin'));

-- Políticas para services (CRÍTICO: Operadores solo ven servicios asignados)
CREATE POLICY "Operators can view assigned services"
  ON public.services FOR SELECT
  USING (
    public.has_role('admin') OR
    (public.has_role('operator') AND operator_id IN (
      SELECT id FROM public.operators WHERE user_id = auth.uid()
    )) OR
    (public.has_role('client') AND client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Operators can update assigned services"
  ON public.services FOR UPDATE
  USING (
    public.has_role('admin') OR
    (public.has_role('operator') AND operator_id IN (
      SELECT id FROM public.operators WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Admins can manage all services"
  ON public.services FOR ALL
  USING (public.has_role('admin'));

-- Políticas para cranes
CREATE POLICY "Users can view cranes"
  ON public.cranes FOR SELECT
  USING (public.has_role('admin') OR public.has_role('operator'));

CREATE POLICY "Admins can manage cranes"
  ON public.cranes FOR ALL
  USING (public.has_role('admin'));

-- Políticas para service_types
CREATE POLICY "All authenticated users can view service types"
  ON public.service_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage service types"
  ON public.service_types FOR ALL
  USING (public.has_role('admin'));

-- Insertar algunos datos de prueba
INSERT INTO public.service_types (name, description, base_price) VALUES
('Traslado de Vehículo', 'Servicio de traslado de vehículos', 15000),
('Rescate Vehicular', 'Rescate de vehículos en emergencia', 25000),
('Montaje Industrial', 'Montaje de equipos industriales', 50000),
('Traslado de Equipo', 'Traslado de maquinaria pesada', 35000);
