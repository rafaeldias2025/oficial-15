
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('Checking admin role for user:', user?.id, 'Session exists:', !!session);
      
      if (!session) {
        console.log('No session found');
        setIsAdmin(false);
        setLoading(false);
        navigate('/auth');
        return;
      }

      if (!user) {
        console.log('No user found in session');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar perfil:', error);
          setIsAdmin(false);
          setLoading(false);
          navigate('/');
          return;
        }

        console.log('Profile found:', profile);
        const adminStatus = profile?.role === 'admin';
        console.log('Is admin?', adminStatus);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          console.log('User is not admin, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro na verificação de admin:', error);
        setIsAdmin(false);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, session, navigate]);

  return { isAdmin, loading };
};
