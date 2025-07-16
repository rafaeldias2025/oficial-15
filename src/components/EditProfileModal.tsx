import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Users, Ruler, Loader } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData?: {
    full_name?: string;
    email?: string;
    celular?: string;
    data_nascimento?: string;
    sexo?: string;
    altura_cm?: number;
  };
  onDataUpdated?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  setOpen,
  userData,
  onDataUpdated 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    celular: '',
    data_nascimento: '',
    sexo: '',
    altura_cm: ''
  });

  // Carregar dados do usuário quando o modal abrir
  React.useEffect(() => {
    const loadUserData = async () => {
      if (!user || !open) return;

      try {
        // Buscar dados do profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Buscar dados físicos se existirem
        const { data: dadosFisicos } = await supabase
          .from('dados_fisicos_usuario')
          .select('*')
          .eq('user_id', profile?.id)
          .maybeSingle();

        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            email: profile.email || user.email || '',
            celular: profile.celular || '',
            data_nascimento: profile.data_nascimento || '',
            sexo: profile.sexo || (dadosFisicos?.sexo) || '',
            altura_cm: profile.altura_cm?.toString() || (dadosFisicos?.altura_cm?.toString()) || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      // Atualizar dados no perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          celular: formData.celular,
          data_nascimento: formData.data_nascimento || null,
          sexo: formData.sexo || null,
          altura_cm: formData.altura_cm ? parseInt(formData.altura_cm) : null
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Buscar o profile ID para atualizar dados físicos
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile && formData.altura_cm && formData.data_nascimento && formData.sexo) {
        // Atualizar ou criar dados físicos do usuário
        const { error: dadosFisicosError } = await supabase
          .from('dados_fisicos_usuario')
          .upsert({
            user_id: profile.id,
            nome_completo: formData.full_name,
            altura_cm: parseInt(formData.altura_cm),
            data_nascimento: formData.data_nascimento,
            sexo: formData.sexo,
            // Manter valores existentes ou usar padrões
            peso_atual_kg: 70, // Será atualizado na próxima pesagem
            circunferencia_abdominal_cm: 90, // Será atualizado na próxima pesagem
          });
        
        if (dadosFisicosError) {
          console.error('Erro ao atualizar dados físicos:', dadosFisicosError);
        }
      }

      toast({
        title: "✅ Dados atualizados com sucesso!",
        description: "Suas informações pessoais foram atualizadas.",
      });

      setOpen(false);
      onDataUpdated?.();

    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seus dados. Tente novamente.",
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
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-instituto-orange">
            <User className="h-5 w-5" />
            Editar Dados Pessoais
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-instituto-orange" />
              Nome Completo *
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Ex: João Silva"
              required
              className="border-instituto-orange/30 focus:border-instituto-orange"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-instituto-orange" />
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ex: joao@email.com"
              required
              className="border-instituto-orange/30 focus:border-instituto-orange"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="celular" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-instituto-orange" />
              Telefone
            </Label>
            <Input
              id="celular"
              type="tel"
              value={formData.celular}
              onChange={(e) => handleChange('celular', e.target.value)}
              placeholder="Ex: (11) 99999-9999"
              className="border-instituto-orange/30 focus:border-instituto-orange"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="data_nascimento" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-instituto-orange" />
              Data de Nascimento
            </Label>
            <Input
              id="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={(e) => handleChange('data_nascimento', e.target.value)}
              className="border-instituto-orange/30 focus:border-instituto-orange"
            />
          </div>

          {/* Sexo */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-instituto-orange" />
              Sexo
            </Label>
            <Select 
              value={formData.sexo} 
              onValueChange={(value) => handleChange('sexo', value)}
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
          </div>

          {/* Altura */}
          <div className="space-y-2">
            <Label htmlFor="altura_cm" className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-instituto-orange" />
              Altura (cm)
            </Label>
            <Input
              id="altura_cm"
              type="number"
              min="100"
              max="250"
              value={formData.altura_cm}
              onChange={(e) => handleChange('altura_cm', e.target.value)}
              placeholder="Ex: 175"
              className="border-instituto-orange/30 focus:border-instituto-orange"
            />
          </div>

          <div className="p-4 bg-instituto-orange/5 rounded-lg border border-instituto-orange/20">
            <h4 className="font-medium text-instituto-orange mb-2">💡 Informações importantes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Altura, sexo e data de nascimento são usados nos cálculos de saúde</li>
              <li>• Dados obrigatórios estão marcados com *</li>
              <li>• Alterações são aplicadas imediatamente</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-instituto-orange hover:bg-instituto-orange/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                '💾 Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};