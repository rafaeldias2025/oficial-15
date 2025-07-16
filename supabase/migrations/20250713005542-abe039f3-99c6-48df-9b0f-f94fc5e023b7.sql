-- Fix all security issues and database problems

-- 1. Fix security issue: Set search_path for track_interaction function
CREATE OR REPLACE FUNCTION public.track_interaction(p_user_id uuid, p_type interaction_type, p_target_id uuid DEFAULT NULL::uuid, p_target_table text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  interaction_id UUID;
BEGIN
  INSERT INTO public.interactions (user_id, interaction_type, target_id, target_table, metadata)
  VALUES (p_user_id, p_type, p_target_id, p_target_table, p_metadata)
  RETURNING id INTO interaction_id;
  
  RETURN interaction_id;
END;
$function$;

-- 2. Fix security issue: Set search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Create the user_role enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'client', 'visitor');
    END IF;
END $$;

-- 4. Create the interaction_type enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interaction_type') THEN
        CREATE TYPE interaction_type AS ENUM ('diary', 'session', 'test', 'comment', 'favorite');
    END IF;
END $$;

-- 5. Fix the handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'rafael@admin.com' THEN 'admin'::user_role
      ELSE 'client'::user_role
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$function$;

-- 6. Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;