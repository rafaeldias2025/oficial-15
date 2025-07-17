import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk5OTU1NywiZXhwIjoyMDUyNTc1NTU3fQ.4TKHlMV2V8LjmnlFBErvU3OL_RpwEKNT4sF8YYK2-z8';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
async function main() {
    const email = `fakeuser_${Date.now()}@test.com`;
    const password = 'Test@123456';
    // Cria usuário auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (userError || !userData || !userData.user) {
        console.error('Erro ao criar usuário:', userError);
        return;
    }
    const userId = userData.user.id;
    // Cria profile
    const { error: profileError } = await supabase.from('profiles').insert({
        user_id: userId,
        full_name: 'Usuário Fictício',
        email,
        role: 'client',
        created_at: new Date().toISOString()
    });
    if (profileError) {
        console.error('Erro ao criar profile:', profileError);
        return;
    }
    console.log('Usuário fictício criado com sucesso:', { email, password, userId });
}
main().catch(console.error);
