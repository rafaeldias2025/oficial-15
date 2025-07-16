-- Verificar as políticas RLS atuais da tabela user_points
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_points';

-- Remover as políticas restritivas atuais
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;
DROP POLICY IF EXISTS "Users can create their own points record" ON user_points;
DROP POLICY IF EXISTS "Users can update their own points" ON user_points;

-- Criar nova política para permitir visualização de TODOS os pontos (necessário para o ranking)
CREATE POLICY "Everyone can view all points for ranking" 
ON user_points 
FOR SELECT 
TO authenticated 
USING (true);

-- Manter políticas restritivas para INSERT e UPDATE
CREATE POLICY "Users can create their own points record" 
ON user_points 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own points" 
ON user_points 
FOR UPDATE 
TO authenticated 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Admin pode ver tudo
CREATE POLICY "Admins can view all points" 
ON user_points 
FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));