-- Verificar e ajustar políticas RLS para permitir que usuários autenticados criem testes públicos
-- ou buscar teste existente "Teste dos Sabotadores"

-- Primeiro, vamos inserir o teste como administrador se ele não existir
INSERT INTO tests (title, description, is_public, questions, created_by) 
SELECT 
  'Teste dos Sabotadores',
  'Teste para identificar padrões comportamentais que sabotam o emagrecimento',
  true,
  '[
    {"id": 1, "pergunta": "Eu sempre escolho roupas que mais disfarçam meu excesso de peso.", "opcoes": [{"value": 5, "label": "Concordo Fortemente"}, {"value": 4, "label": "Concordo"}, {"value": 3, "label": "Às Vezes"}, {"value": 2, "label": "Discordo"}, {"value": 1, "label": "Discordo Fortemente"}]},
    {"id": 2, "pergunta": "Tenho peças que disfarçam meu corpo, e por isso prefiro até lavar mais vezes essas mesmas peças roupa do que ir às compras e me sentir frustrado(a).", "opcoes": [{"value": 5, "label": "Concordo Fortemente"}, {"value": 4, "label": "Concordo"}, {"value": 3, "label": "Às Vezes"}, {"value": 2, "label": "Discordo"}, {"value": 1, "label": "Discordo Fortemente"}]}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM tests WHERE title = 'Teste dos Sabotadores' AND is_public = true
);

-- Verificar se temos o teste criado
SELECT id, title, is_public FROM tests WHERE title = 'Teste dos Sabotadores';