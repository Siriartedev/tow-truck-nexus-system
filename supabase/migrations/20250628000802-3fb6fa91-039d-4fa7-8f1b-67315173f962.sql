
-- 🧹 LIMPIAR POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all authenticated access to profiles" ON public.user_profiles;

-- Limpiar todas las políticas existentes para empezar de cero
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Limpiar políticas de otras tablas
DROP POLICY IF EXISTS "Allow all authenticated access to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow all authenticated access to operators" ON public.operators;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable all access for clients" ON public.clients;
DROP POLICY IF EXISTS "Enable all access for operators" ON public.operators;

-- 🧹 LIMPIAR TRIGGER PROBLEMÁTICO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 🧹 LIMPIAR DATOS DUPLICADOS
DELETE FROM public.clients WHERE rut = '12345678-9' AND email NOT IN ('cliente@empresa.com');
DELETE FROM public.operators WHERE rut = '12345678-9' AND email NOT IN ('operador@gruas.com');

-- 🔧 CREAR FUNCIÓN DE TRIGGER FUNCIONAL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role public.app_role;
  user_name TEXT;
  unique_rut TEXT;
BEGIN
  -- Obtener datos del usuario
  user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role);
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1));
  
  -- Generar RUT único basado en timestamp para evitar conflictos
  unique_rut := '12345678-' || (EXTRACT(EPOCH FROM NOW())::BIGINT % 10)::TEXT;
  
  -- Crear perfil de usuario SIEMPRE
  INSERT INTO public.user_profiles (user_id, email, name, role, active)
  VALUES (NEW.id, NEW.email, user_name, user_role, true);
  
  -- Crear registro específico según el rol
  IF user_role = 'client' THEN
    INSERT INTO public.clients (user_id, name, email, rut, active)
    VALUES (NEW.id, user_name, NEW.email, unique_rut, true);
    
  ELSIF user_role = 'operator' THEN
    INSERT INTO public.operators (user_id, name, email, rut, pin, active)
    VALUES (NEW.id, user_name, NEW.email, unique_rut, '0000', true);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log el error pero NO bloquear la creación del usuario
    RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- ✅ RECREAR TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 🔐 CREAR POLÍTICAS RLS SIMPLES Y FUNCIONALES

-- Política para user_profiles: Los usuarios ven su propio perfil + admins ven todo
CREATE POLICY "user_profiles_read"
  ON public.user_profiles FOR SELECT
  USING (
    user_id = auth.uid() OR 
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role = 'admin' AND active = true
    )
  );

CREATE POLICY "user_profiles_write"
  ON public.user_profiles FOR ALL
  USING (
    user_id = auth.uid() OR 
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role = 'admin' AND active = true
    )
  );

-- Política para clients: Clientes ven sus datos + admins y operadores ven todo
CREATE POLICY "clients_access"
  ON public.clients FOR ALL
  USING (
    user_id = auth.uid() OR
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role IN ('admin', 'operator') AND active = true
    )
  );

-- Política para operators: Operadores ven sus datos + admins ven todo
CREATE POLICY "operators_access"
  ON public.operators FOR ALL
  USING (
    user_id = auth.uid() OR
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role = 'admin' AND active = true
    )
  );

-- Política para services: Según el rol
CREATE POLICY "services_access"
  ON public.services FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role = 'admin' AND active = true
    ) OR
    (
      auth.uid() IN (
        SELECT user_id FROM public.user_profiles 
        WHERE role = 'client' AND active = true
      ) AND 
      client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    ) OR
    (
      auth.uid() IN (
        SELECT user_id FROM public.user_profiles 
        WHERE role = 'operator' AND active = true
      ) AND 
      operator_id IN (SELECT id FROM public.operators WHERE user_id = auth.uid())
    )
  );

-- Política para cranes: Admin y operadores
CREATE POLICY "cranes_access"
  ON public.cranes FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role IN ('admin', 'operator') AND active = true
    )
  );

-- Política para service_types: Todos los autenticados pueden leer, solo admin modificar
CREATE POLICY "service_types_read"
  ON public.service_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "service_types_write"
  ON public.service_types FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles 
      WHERE role = 'admin' AND active = true
    )
  );

-- 🔒 ASEGURAR QUE RLS ESTÉ HABILITADO
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
