
-- 🔧 SOLUCIÓN DEFINITIVA: Eliminar recursión infinita en políticas RLS

-- 1. Limpiar TODAS las políticas problemáticas
DROP POLICY IF EXISTS "user_profiles_read" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_write" ON public.user_profiles;
DROP POLICY IF EXISTS "clients_access" ON public.clients;
DROP POLICY IF EXISTS "operators_access" ON public.operators;
DROP POLICY IF EXISTS "services_access" ON public.services;
DROP POLICY IF EXISTS "cranes_access" ON public.cranes;
DROP POLICY IF EXISTS "service_types_read" ON public.service_types;
DROP POLICY IF EXISTS "service_types_write" ON public.service_types;

-- 2. Crear función auxiliar SIN recursión
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = check_user_id LIMIT 1;
$$;

-- 3. Políticas SIMPLES y SIN recursión para user_profiles
CREATE POLICY "user_profiles_select" ON public.user_profiles
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "user_profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_profiles_update" ON public.user_profiles
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- 4. Políticas simples para otras tablas
CREATE POLICY "clients_policy" ON public.clients
  FOR ALL USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) IN ('admin', 'operator')
  );

CREATE POLICY "operators_policy" ON public.operators
  FOR ALL USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "services_policy" ON public.services
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'admin' OR
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()) OR
    operator_id IN (SELECT id FROM public.operators WHERE user_id = auth.uid())
  );

CREATE POLICY "cranes_policy" ON public.cranes
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operator')
  );

CREATE POLICY "service_types_select" ON public.service_types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "service_types_modify" ON public.service_types
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- 5. Asegurar que RLS esté habilitado
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
