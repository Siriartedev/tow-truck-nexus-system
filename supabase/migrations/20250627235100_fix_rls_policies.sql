
-- Arreglar las políticas RLS para evitar problemas de recursión

-- Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Crear políticas RLS más simples y funcionales
CREATE POLICY "Allow admin access to all profiles"
  ON public.user_profiles FOR ALL
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin' 
      AND up.active = true
    )
  );

-- Políticas para las otras tablas
CREATE POLICY "Clients can view their own data"
  ON public.clients FOR SELECT
  USING (user_id = auth.uid() OR public.has_role('admin') OR public.has_role('operator'));

CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL
  USING (public.has_role('admin'));

CREATE POLICY "Operators can view their own data"
  ON public.operators FOR SELECT
  USING (user_id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "Admins can manage operators"
  ON public.operators FOR ALL
  USING (public.has_role('admin'));

-- Políticas para servicios
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

-- Políticas para grúas
CREATE POLICY "Users can view cranes"
  ON public.cranes FOR SELECT
  USING (public.has_role('admin') OR public.has_role('operator'));

CREATE POLICY "Admins can manage cranes"
  ON public.cranes FOR ALL
  USING (public.has_role('admin'));

-- Políticas para tipos de servicio
CREATE POLICY "All authenticated users can view service types"
  ON public.service_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage service types"
  ON public.service_types FOR ALL
  USING (public.has_role('admin'));
