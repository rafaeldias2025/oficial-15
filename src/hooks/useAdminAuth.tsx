
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('🔍 useAdminAuth - Checking admin role for user:', user?.id, 'Session exists:', !!session);
      
      if (!session) {
        console.log('🔍 useAdminAuth - No session found, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (!user) {
        console.log('🔍 useAdminAuth - No user found in session, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Lista de emails administrativos
      const adminEmails = [
        'admin@instituto.com',
        'admin@sonhos.com',
        'rafael@admin.com'
      ];

      // Verificar se o email do usuário está na lista de admins
      const isAdminEmail = adminEmails.includes(user.email || '');
      console.log('🔍 useAdminAuth - User email:', user.email);
      console.log('🔍 useAdminAuth - Is admin email?', isAdminEmail);

      if (isAdminEmail) {
        console.log('🔍 useAdminAuth - User is admin by email, setting isAdmin to true');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 useAdminAuth - Fetching profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('🔍 useAdminAuth - Erro ao verificar perfil:', error);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        console.log('🔍 useAdminAuth - Profile found:', profile);
        
        // Verificar se é admin por role
        const adminStatus = profile?.role === 'admin';
        console.log('🔍 useAdminAuth - Is admin by role?', adminStatus);
        console.log('🔍 useAdminAuth - Profile role:', profile?.role);
        console.log('🔍 useAdminAuth - Setting isAdmin to:', adminStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('🔍 useAdminAuth - Erro na verificação de admin:', error);
        setIsAdmin(false);
      } finally {
        console.log('🔍 useAdminAuth - Setting loading to false');
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, session]);

  return { isAdmin, loading };
};
