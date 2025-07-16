-- Remover as políticas restritivas atuais que impedem visualização de outros usuários
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

-- Garantir que todos os usuários tenham registros de pontos
INSERT INTO user_points (user_id, total_points, daily_points, weekly_points, monthly_points, current_streak, best_streak, completed_challenges)
SELECT 
  p.id,
  0,
  0,
  0,
  0,
  0,
  0,
  0
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_points up WHERE up.user_id = p.id
);