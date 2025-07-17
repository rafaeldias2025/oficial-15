import { createClient } from '@supabase/supabase-js';
import { autoTestUserTools } from '../utils/autoTestUserTools.js';

// Configure suas variáveis de ambiente ou coloque aqui diretamente
const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk5OTU1NywiZXhwIjoyMDUyNTc1NTU3fQ.4TKHlMV2V8LjmnlFBErvU3OL_RpwEKNT4sF8YYK2-z8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // 1. Buscar um usuário real para o teste
  const { data: user } = await supabase.auth.admin.listUsers();
  if (!user || !user.users.length) {
    console.error('Nenhum usuário encontrado para o teste.');
    return;
  }
  const userId = user.users[0].id;

  // 2. Buscar o profile correspondente
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();
  if (!profile) {
    console.error('Profile não encontrado para o usuário.');
    return;
  }
  const profileId = profile.id;

  // 3. Buscar um desafio existente
  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .maybeSingle();
  if (!challenge) {
    console.error('Nenhum desafio encontrado.');
    return;
  }
  const challengeId = challenge.id;

  // 4. Rodar o autoteste
  const result = await autoTestUserTools(userId, profileId, challengeId);
  console.log('Resultado do autoteste:', result);
}

main().catch(console.error);
