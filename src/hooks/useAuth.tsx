import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, celular?: string, dataNascimento?: string, sexo?: string, altura?: number) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string, celular?: string, dataNascimento?: string, sexo?: string, altura?: number) => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      // 1. Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
            celular: celular || '',
            data_nascimento: dataNascimento || '',
            sexo: sexo || '',
            altura_cm: altura?.toString() || '',
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      // 2. Se o usuário foi criado com sucesso, criar perfil completo
      if (authData.user) {
        console.log('🔄 Usuário criado no auth, iniciando criação do perfil completo...');
        
        // Aguardar um pouco para garantir que o trigger criou o profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📊 Dados para perfil completo:', {
          user_id: authData.user.id,
          full_name: fullName,
          celular,
          data_nascimento: dataNascimento,
          sexo,
          altura
        });
        
        const { data: profileResult, error: profileError } = await supabase.rpc(
          'create_complete_user_profile',
          {
            p_user_id: authData.user.id,
            p_full_name: fullName || 'Usuário',
            p_celular: celular || '',
            p_data_nascimento: dataNascimento ? new Date(dataNascimento).toISOString().split('T')[0] : null,
            p_sexo: sexo || 'outro',
            p_altura_cm: altura ? parseInt(altura.toString()) : 170
          }
        );

        if (profileError) {
          console.error('❌ Erro ao criar perfil completo:', profileError);
          
          // Sistema de fallback robusto
          try {
            console.log('🔄 Iniciando fallback manual...');
            
            // Aguardar mais um pouco e tentar novamente
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('user_id', authData.user.id)
              .single();

            if (profile?.id) {
              console.log('✅ Profile encontrado, atualizando dados...');
              
              // Atualizar profile
              await supabase
                .from('profiles')
                .update({
                  full_name: fullName || 'Usuário',
                  celular: celular || '',
                  data_nascimento: dataNascimento ? new Date(dataNascimento).toISOString().split('T')[0] : null,
                  sexo: sexo || 'outro',
                  altura_cm: altura ? parseInt(altura.toString()) : 170
                })
                .eq('id', profile.id);

              // Criar dados físicos
              await supabase
                .from('dados_fisicos_usuario')
                .upsert({
                  user_id: profile.id,
                  nome_completo: fullName || 'Usuário',
                  altura_cm: altura ? parseInt(altura.toString()) : 170,
                  sexo: sexo || 'outro',
                  data_nascimento: dataNascimento ? new Date(dataNascimento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                  peso_atual_kg: 70,
                  circunferencia_abdominal_cm: 90,
                  meta_peso_kg: 70
                });

              // Criar user_points inicial
              await supabase
                .from('user_points')
                .upsert({
                  user_id: profile.id,
                  total_points: 0,
                  daily_points: 0,
                  weekly_points: 0,
                  monthly_points: 0,
                  current_streak: 0,
                  best_streak: 0,
                  completed_challenges: 0,
                  last_activity_date: new Date().toISOString().split('T')[0]
                });

              console.log('✅ Fallback concluído com sucesso');
            }
          } catch (fallbackError) {
            console.error('❌ Erro no fallback:', fallbackError);
          }
        } else {
          console.log('✅ Perfil completo criado com sucesso:', profileResult);
        }
      }

      return { error: null };
      
    } catch (error) {
      console.error('Erro geral no signUp:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Limpar todos os dados do localStorage relacionados ao usuário
      if (user) {
        localStorage.removeItem(`physical_data_complete_${user.id}`);
        // Limpar outros dados em cache se necessário
        Object.keys(localStorage).forEach(key => {
          if (key.includes(user.id)) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Fazer logout no Supabase
      await supabase.auth.signOut();
      
      // Limpar estado local
      setUser(null);
      setSession(null);
      
      // Redirecionar para página inicial (se necessário)
      window.location.href = '/';
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      setSession(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};