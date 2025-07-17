import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // Verificar usuários
  try {
    const { data: users } = await supabase.auth.admin.listUsers();
    console.log('Usuários encontrados:', users?.users?.length || 0);
    if (users?.users?.length) {
      console.log('Primeiro usuário:', users.users[0].id, users.users[0].email);
    }
  } catch (error) {
    console.log('Erro ao buscar usuários auth:', error);
  }

  // Verificar profiles
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.log('Profiles encontrados:', profiles?.length || 0);
  if (error) {
    console.log('Erro ao buscar profiles:', error);
  } else if (profiles?.length) {
    console.log('Primeiro profile:', profiles[0]);
  }

  // Verificar desafios
  const { data: challenges } = await supabase.from('challenges').select('*');
  console.log('Desafios encontrados:', challenges?.length || 0);
  if (challenges?.length) {
    console.log('Primeiro desafio:', challenges[0].id, challenges[0].name);
  }
}

main().catch(console.error);
