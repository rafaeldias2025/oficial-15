import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, UserCheck, Ruler } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const UserProfileHeader = () => {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);


  if (loading) {
    return (
      <Card className="border-2 border-instituto-orange/20">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-2 border-instituto-orange/20">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Dados do perfil não encontrados
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSexoLabel = (sexo: string) => {
    const labels: { [key: string]: string } = {
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'outro': 'Outro'
    };
    return labels[sexo] || sexo;
  };

  return (
    <Card className="border-2 border-instituto-orange/20 bg-gradient-to-r from-instituto-orange/5 to-instituto-orange/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-instituto-orange/20 rounded-full">
            <User className="h-6 w-6 text-instituto-orange" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-instituto-dark">Dados Pessoais</h2>
            <p className="text-sm text-muted-foreground">Suas informações pessoais</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Nome Completo</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {profile.full_name || 'Não informado'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>E-mail</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {profile.email || 'Não informado'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Telefone</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {profile.celular || 'Não informado'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data de Nascimento</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {formatDate(profile.data_nascimento)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4" />
              <span>Sexo</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {getSexoLabel(profile.sexo)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>Altura</span>
            </div>
            <div className="font-medium text-instituto-dark">
              {profile.altura_cm ? `${profile.altura_cm} cm` : 'Não informado'}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-instituto-orange/20">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✅ Perfil completo
            </Badge>
            <span className="text-xs text-muted-foreground">
              Dados protegidos e criptografados
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};