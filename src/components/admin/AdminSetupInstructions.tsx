import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, Copy, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface AdminSetupInstructionsProps {
  missingTables: string[];
  onRefresh: () => void;
}

export const AdminSetupInstructions: React.FC<AdminSetupInstructionsProps> = ({ 
  missingTables, 
  onRefresh 
}) => {
  const migrationSQL = `-- =====================================================
-- MIGRAÇÃO PARA CORRIGIR TABELAS DO PAINEL ADMINISTRATIVO
-- =====================================================

-- Tabela goals para metas dos usuários
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  progress INTEGER DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela sessions para sessões administradas
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  pdf_url TEXT,
  category TEXT DEFAULT 'general',
  estimated_time TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela dados_saude_usuario para dados de saúde
CREATE TABLE IF NOT EXISTS public.dados_saude_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  peso_atual_kg DECIMAL(5,2),
  imc DECIMAL(5,2),
  meta_peso_kg DECIMAL(5,2),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela courses para cursos pagos
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela course_modules para módulos dos cursos
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela course_lessons para aulas dos módulos
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_saude_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para goals
CREATE POLICY "Users can view their own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para sessions
CREATE POLICY "Users can view their assigned sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = assigned_to OR is_admin());

CREATE POLICY "Admins can manage all sessions" ON public.sessions
  FOR ALL USING (is_admin());

-- Políticas RLS para dados_saude_usuario
CREATE POLICY "Users can view their own health data" ON public.dados_saude_usuario
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data" ON public.dados_saude_usuario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data" ON public.dados_saude_usuario
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all health data" ON public.dados_saude_usuario
  FOR SELECT USING (is_admin());

-- Políticas RLS para courses
CREATE POLICY "Everyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (is_admin());

-- Políticas RLS para course_modules
CREATE POLICY "Everyone can view active modules" ON public.course_modules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all modules" ON public.course_modules
  FOR ALL USING (is_admin());

-- Políticas RLS para course_lessons
CREATE POLICY "Everyone can view active lessons" ON public.course_lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
  FOR ALL USING (is_admin());

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_assigned_to ON public.sessions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_dados_saude_user_id ON public.dados_saude_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON public.course_lessons(module_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(migrationSQL);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  return (
    <div className="min-h-screen bg-netflix-dark p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Database className="h-6 w-6 text-instituto-orange" />
              Configuração do Banco de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-yellow-500/20 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-netflix-text">
                Algumas tabelas necessárias para o painel administrativo não foram encontradas.
                Você precisa executar a migração SQL no Supabase.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-netflix-text">
                Tabelas em falta:
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingTables.map((table) => (
                  <span
                    key={table}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                  >
                    {table}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-netflix-text">
                Instruções:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-netflix-text-muted">
                <li>Abra o Supabase Dashboard</li>
                <li>Vá para "SQL Editor"</li>
                <li>Copie o SQL abaixo e cole no editor</li>
                <li>Execute a query</li>
                <li>Volte aqui e clique em "Verificar Novamente"</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-netflix-text">
                  SQL de Migração:
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar SQL
                  </Button>
                  <Button
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                    variant="outline"
                    className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Supabase
                  </Button>
                </div>
              </div>

              <div className="bg-netflix-dark p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm text-netflix-text whitespace-pre-wrap">
                  {migrationSQL}
                </pre>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onRefresh}
                className="bg-instituto-orange hover:bg-instituto-orange/90 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verificar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 