-- Fix security issue: Set search_path for is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$function$;