// Script para verificar status do usuário logado
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://skcfeldqipxaomrjfuym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxODU4MTEsImV4cCI6MjA0OTc2MTgxMX0.pF8sKzN8B6ckzOLPkdOMpRQKMfZ5aRVQP0nP-YfrBcg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserStatus() {
  console.log('🔍 Verificando status do usuário...');
  
  try {
    // Verificar usuário logado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError);
      return;
    }
    
    if (!user) {
      console.log('❌ Nenhum usuário logado');
      return;
    }
    
    console.log('✅ Usuário logado:', {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed: user.email_confirmed_at ? 'Sim' : 'Não'
    });
    
    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.log('⚠️ Erro ao buscar perfil:', profileError);
    } else {
      console.log('📋 Perfil:', profile);
    }
    
    // Verificar se é admin
    const adminEmails = [
      'admin@instituto.com',
      'admin@sonhos.com', 
      'rafael@admin.com'
    ];
    
    const isAdmin = adminEmails.includes(user.email || '');
    console.log('🔐 É admin?', isAdmin ? '✅ SIM' : '❌ NÃO');
    console.log('📧 Email atual:', user.email);
    console.log('📧 Emails admin permitidos:', adminEmails);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkUserStatus();
