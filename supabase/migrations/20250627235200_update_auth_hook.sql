
-- Actualizar la función del trigger para manejar mejor los errores
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Intentar insertar el perfil del usuario
  INSERT INTO public.user_profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role)
  );
  
  -- Si es un cliente, crear también el registro en la tabla clients
  IF COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'client'::public.app_role) = 'client' THEN
    INSERT INTO public.clients (user_id, name, email, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
      NEW.email,
      true
    );
  END IF;
  
  -- Si es un operador, crear también el registro en la tabla operators
  IF (NEW.raw_user_meta_data ->> 'role')::public.app_role = 'operator' THEN
    INSERT INTO public.operators (user_id, name, email, pin, active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'pin', '0000'),
      true
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log del error pero no bloquear la creación del usuario
    RAISE WARNING 'Error creating user profile for % (ID: %): %', NEW.email, NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
