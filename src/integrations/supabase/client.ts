// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://skcfeldqipxaomrjfuym.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'instituto-sonhos-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function para queries com tratamento de erro
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      console.error('Supabase query error:', result.error);
      return { data: null, error: result.error };
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Supabase query exception:', error);
    return { data: null, error };
  }
};

// Helper function para mutations com tratamento de erro
export const safeMutation = async <T>(
  mutationFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: any; success: boolean }> => {
  try {
    const result = await mutationFn();
    
    if (result.error) {
      console.error('Supabase mutation error:', result.error);
      return { data: null, error: result.error, success: false };
    }
    
    return { data: result.data, error: null, success: true };
  } catch (error) {
    console.error('Supabase mutation exception:', error);
    return { data: null, error, success: false };
  }
};

// Helper function para verificar se o usuário está autenticado
export const checkAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth check error:', error);
      return { user: null, error };
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Auth check exception:', error);
    return { user: null, error };
  }
};

// Helper function para verificar se o usuário é admin
export const checkAdminRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Admin check error:', error);
      return { isAdmin: false, error };
    }
    
    const adminEmails = [
      'admin@instituto.com',
      'admin@sonhos.com',
      'rafael@admin.com'
    ];
    
    // Verificar também por email para garantir acesso admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdminByEmail = adminEmails.includes(user?.email || '');
    
    return { 
      isAdmin: data?.role === 'admin' || isAdminByEmail, 
      error: null 
    };
  } catch (error) {
    console.error('Admin check exception:', error);
    return { isAdmin: false, error };
  }
};

// Helper function para retry automático em caso de erro
export const retryQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<{ data: T | null; error: any }> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await queryFn();
      
      if (!result.error) {
        return { data: result.data, error: null };
      }
      
      // Se não é o último retry, esperar e tentar novamente
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      return { data: null, error: result.error };
    } catch (error) {
      if (i === maxRetries - 1) {
        return { data: null, error };
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  return { data: null, error: new Error('Max retries exceeded') };
};