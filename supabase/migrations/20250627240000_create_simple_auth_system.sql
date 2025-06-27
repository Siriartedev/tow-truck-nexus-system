
-- Clean up existing problematic data
DELETE FROM public.clients WHERE email IN ('admin@gruas.com', 'cliente@empresa.com', 'operador@gruas.com');
DELETE FROM public.operators WHERE email IN ('admin@gruas.com', 'cliente@empresa.com', 'operador@gruas.com');

-- Ensure we have service types for demo
INSERT INTO public.service_types (name, description, base_price, active) VALUES
('Traslado de Vehículo', 'Servicio de traslado de vehículos averiados', 25000, true),
('Rescate Vehicular', 'Servicio de rescate en carretera', 35000, true),
('Grúa de Auxilio', 'Servicio de grúa para emergencias', 30000, true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  active = EXCLUDED.active;

-- Create a simple trigger function that handles new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create basic user profile
  INSERT INTO public.user_profiles (user_id, email, name, role, active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role),
    true
  );
  
  -- If it's a client, create client record
  IF COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role) = 'client' THEN
    INSERT INTO public.clients (user_id, name, email, rut, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      '12345678-9', -- Default RUT for demo
      true
    );
  END IF;
  
  -- If it's an operator, create operator record
  IF COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role) = 'operator' THEN
    INSERT INTO public.operators (user_id, name, email, rut, pin, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      '12345678-9', -- Default RUT for demo
      '0000', -- Default PIN
      true
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are simple and working
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable all access for clients" ON public.clients;
DROP POLICY IF EXISTS "Enable all access for operators" ON public.operators;

-- Create simple RLS policies that work
CREATE POLICY "Allow all authenticated access to profiles" 
  ON public.user_profiles FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated access to clients" 
  ON public.clients FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated access to operators" 
  ON public.operators FOR ALL 
  TO authenticated 
  USING (true);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
