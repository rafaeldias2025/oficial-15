-- Fix RLS policy for test_responses table to allow users to insert their own responses
-- The current policy is blocking users from inserting their own test responses

-- First, let's check if there's already an INSERT policy and drop it if needed
DROP POLICY IF EXISTS "Allow insert for own responses" ON public.test_responses;
DROP POLICY IF EXISTS "Users can create their own test responses" ON public.test_responses;

-- Create the correct INSERT policy for test_responses
-- The policy should allow authenticated users to insert responses where the user_id matches their profile.id
CREATE POLICY "Users can create their own test responses"
ON public.test_responses
FOR INSERT
TO authenticated
WITH CHECK (user_id IN (
    SELECT profiles.id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
));

-- Also ensure users can update their own responses (upsert functionality)
DROP POLICY IF EXISTS "Users can update their own test responses" ON public.test_responses;

CREATE POLICY "Users can update their own test responses"
ON public.test_responses
FOR UPDATE
TO authenticated
USING (user_id IN (
    SELECT profiles.id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
))
WITH CHECK (user_id IN (
    SELECT profiles.id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
));