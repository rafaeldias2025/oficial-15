-- Fix security issue: Set search_path for get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$function$;