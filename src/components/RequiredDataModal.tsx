import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, User, Calendar, Users, Ruler, Loader } from 'lucide-react';

export const RequiredDataModal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const [formData, setFormData] = useState({
    data_nascimento: '',
    sexo: '',
    altura_cm: ''
  });

  useEffect(() => {
    if (user?.id && !isChecking) {
      checkRequiredData();
    }
  }, [user?.id, isChecking]);

  const checkRequiredData = async () => {
    if (!user?.id || isChecking) return;
    
    try {
      setIsChecking(true);
      console.log('🔍 Verificando dados obrigatórios para usuário:', user.id);
      
      // Desabilitar modal temporariamente para evitar problemas
      // TODO: Reativar quando o esquema do banco estiver estável
      console.log('✅ Modal de dados obrigatórios desabilitado temporariamente');
      setOpen(false);
      return;
      
      // Código original comentado para evitar erros
      /*
      // 1. Verificar se o usuário tem dados físicos completos na tabela dados_fisicos_usuario
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profileData) {
        console.log('❌ Profile não encontrado');
        return;
      }

      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('altura_cm, sexo, data_nascimento, peso_atual_kg')
        .eq('user_id', profileData.id)
        .maybeSingle();

      // Se dados físicos já existem e estão completos, não mostrar modal
      if (dadosFisicos && dadosFisicos.altura_cm && dadosFisicos.sexo && dadosFisicos.data_nascimento) {
        console.log('✅ Dados físicos já existem e estão completos:', dadosFisicos);
        setOpen(false);
        return;
      }

      console.log('✅ Todos os dados estão presentes, não exibindo modal');
      setOpen(false);
      */
    } catch (error) {
      console.error('❌ Erro ao verificar dados obrigatórios:', error);
      // Em caso de erro, não mostrar modal para não interromper a experiência
      setOpen(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    // Validar campos obrigatórios
    if (!formData.data_nascimento || !formData.sexo || !formData.altura_cm) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Atualizar dados no perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          data_nascimento: formData.data_nascimento,
          sexo: formData.sexo,
          altura_cm: parseInt(formData.altura_cm)
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Criar dados físicos iniciais
      const { error: dadosFisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .upsert({
          user_id: profile.id,
          nome_completo: profile.full_name,
          altura_cm: parseInt(formData.altura_cm),
          data_nascimento: formData.data_nascimento,
          sexo: formData.sexo,
          peso_atual_kg: 70, // Valor padrão - será atualizado na primeira pesagem
          circunferencia_abdominal_cm: 90, // Valor padrão - será atualizado na primeira pesagem
        });
      
      if (dadosFisicosError) {
        console.error('Erro ao criar dados físicos:', dadosFisicosError);
      }

      toast({
        title: "✅ Perfil configurado!",
        description: "Seus dados foram salvos. Agora você pode usar todas as funcionalidades do sistema.",
      });

      setOpen(false);

    } catch (error) {
      console.error('Erro ao salvar dados obrigatórios:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-instituto-orange">
            <AlertTriangle className="h-5 w-5" />
            Configuração Inicial Obrigatória
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-instituto-orange/5 rounded-lg border border-instituto-orange/20">
            <p className="text-sm text-instituto-dark">
              <strong>Bem-vindo ao Trend Track!</strong> Para personalizar sua experiência e fornecer 
              análises precisas de saúde, precisamos de algumas informações básicas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="data_nascimento" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-instituto-orange" />
                Data de Nascimento *
              </Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleChange('data_nascimento', e.target.value)}
                required
                className="border-instituto-orange/30 focus:border-instituto-orange"
              />
              <p className="text-xs text-muted-foreground">
                Usada para calcular sua idade e recomendações personalizadas
              </p>
            </div>

            {/* Sexo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-instituto-orange" />
                Sexo *
              </Label>
              <Select 
                value={formData.sexo} 
                onValueChange={(value) => handleChange('sexo', value)}
                required
              >
                <SelectTrigger className="border-instituto-orange/30 focus:border-instituto-orange">
                  <SelectValue placeholder="Selecione seu sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Necessário para cálculos de IMC e risco cardiometabólico
              </p>
            </div>

            {/* Altura */}
            <div className="space-y-2">
              <Label htmlFor="altura_cm" className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-instituto-orange" />
                Altura (cm) *
              </Label>
              <Input
                id="altura_cm"
                type="number"
                min="100"
                max="250"
                value={formData.altura_cm}
                onChange={(e) => handleChange('altura_cm', e.target.value)}
                placeholder="Ex: 175"
                required
                className="border-instituto-orange/30 focus:border-instituto-orange"
              />
              <p className="text-xs text-muted-foreground">
                Fundamental para todos os cálculos de índices de saúde
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">🔒 Segurança e Privacidade</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Seus dados são criptografados e protegidos</li>
                <li>• Apenas você tem acesso às suas informações pessoais</li>
                <li>• Os dados são usados exclusivamente para melhorar sua experiência</li>
              </ul>
            </div>

            <Button 
              type="submit"
              className="w-full bg-instituto-orange hover:bg-instituto-orange/90"
              disabled={loading || !formData.data_nascimento || !formData.sexo || !formData.altura_cm}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Configurando perfil...
                </>
              ) : (
                '🚀 Finalizar Configuração'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};