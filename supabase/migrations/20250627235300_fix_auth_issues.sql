
-- Eliminar políticas problemáticas que pueden causar recursión
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Operators can view their own data" ON public.operators;
DROP POLICY IF EXISTS "Admins can manage operators" ON public.operators;

-- Crear políticas más simples y directas para user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Permitir a admins ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Permitir a admins administrar todos los perfiles
CREATE POLICY "Admins can manage all profiles"
  ON public.user_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Simplificar políticas para clientes
CREATE POLICY "Users can view own client data"
  ON public.clients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert client data"
  ON public.clients FOR INSERT
  WITH CHECK (true);

-- Simplificar políticas para operadores
CREATE POLICY "Users can view own operator data"
  ON public.operators FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert operator data"
  ON public.operators FOR INSERT
  WITH CHECK (true);

-- Actualizar el trigger para crear perfiles automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar perfil de usuario
  INSERT INTO public.user_profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role)
  );
  
  -- Si es cliente, crear registro en tabla clients
  IF COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role) = 'client' THEN
    INSERT INTO public.clients (user_id, name, email, rut, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'rut', '12345678-9'),
      true
    );
  END IF;
  
  -- Si es operador, crear registro en tabla operators
  IF (NEW.raw_user_meta_data ->> 'role')::public.app_role = 'operator' THEN
    INSERT INTO public.operators (user_id, name, email, rut, pin, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'rut', '12345678-9'),
      COALESCE(NEW.raw_user_meta_data ->> 'pin', '0000'),
      true
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error pero no bloquear la creación del usuario
    RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
