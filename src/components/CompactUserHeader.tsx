import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, UserCheck, Ruler } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const CompactUserHeader = () => {
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
      <Card className="border border-instituto-orange/20">
        <CardContent className="p-3">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border border-instituto-orange/20">
        <CardContent className="p-3">
          <div className="text-sm text-muted-foreground">
            Dados do perfil não encontrados
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getSexoLabel = (sexo: string) => {
    const labels: { [key: string]: string } = {
      'masculino': 'M',
      'feminino': 'F',
      'outro': 'O'
    };
    return labels[sexo] || '-';
  };

  return (
    <Card className="border border-instituto-orange/20 bg-gradient-to-r from-instituto-orange/5 to-instituto-orange/10">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-instituto-orange/20 rounded-full">
              <User className="h-4 w-4 text-instituto-orange" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-instituto-dark">
                {profile.full_name || 'Usuário'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-instituto-orange" />
              <span className="font-medium">{calculateAge(profile.data_nascimento)} anos</span>
            </div>
            
            <div className="flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-instituto-orange" />
              <span className="font-medium">{getSexoLabel(profile.sexo)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3 text-instituto-orange" />
              <span className="font-medium">{profile.altura_cm ? `${profile.altura_cm}cm` : 'N/A'}</span>
            </div>
            
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
              ✅ Ativo
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};