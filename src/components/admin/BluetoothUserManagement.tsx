import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Activity,
  Target,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserWithWeightData {
  id: string;
  full_name: string;
  email: string;
  latest_weight?: {
    peso_kg: number;
    data_medicao: string;
    gordura_corporal_pct?: number;
    imc?: number;
    origem_medicao: string;
  };
  weight_trend?: 'up' | 'down' | 'stable';
  risk_level?: 'low' | 'moderate' | 'high';
  total_measurements: number;
}

export const BluetoothUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWithWeightData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsersWithWeightData();
  }, []);

  const loadUsersWithWeightData = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'client')
        .order('full_name');

      if (profilesError) throw profilesError;

      // Para cada usuário, buscar dados de peso
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Buscar última pesagem
          const { data: latestWeight } = await supabase
            .from('pesagens')
            .select('peso_kg, data_medicao, gordura_corporal_pct, imc, origem_medicao')
            .eq('user_id', profile.id)
            .order('data_medicao', { ascending: false })
            .limit(1)
            .single();

          // Contar total de medições
          const { count: totalMeasurements } = await supabase
            .from('pesagens')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          // Buscar tendência de peso (últimas 2 medições)
          const { data: weightHistory } = await supabase
            .from('pesagens')
            .select('peso_kg')
            .eq('user_id', profile.id)
            .order('data_medicao', { ascending: false })
            .limit(2);

          let weight_trend: 'up' | 'down' | 'stable' = 'stable';
          if (weightHistory && weightHistory.length >= 2) {
            const current = weightHistory[0].peso_kg;
            const previous = weightHistory[1].peso_kg;
            const diff = current - previous;
            
            if (diff > 0.5) weight_trend = 'up';
            else if (diff < -0.5) weight_trend = 'down';
            else weight_trend = 'stable';
          }

          // Determinar nível de risco baseado no IMC
          let risk_level: 'low' | 'moderate' | 'high' = 'low';
          if (latestWeight?.imc) {
            if (latestWeight.imc < 18.5 || latestWeight.imc >= 30) {
              risk_level = 'high';
            } else if (latestWeight.imc >= 25) {
              risk_level = 'moderate';
            }
          }

          return {
            ...profile,
            latest_weight: latestWeight,
            weight_trend,
            risk_level,
            total_measurements: totalMeasurements || 0
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Erro ao carregar dados dos usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-instituto-green/10 text-instituto-green';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-instituto-green" />;
      default: return <Activity className="h-4 w-4 text-netflix-text-muted" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Users className="h-5 w-5 text-instituto-orange" />
            Usuários com Dados de Balança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {users.map((user) => (
              <div 
                key={user.id}
                className="p-4 bg-netflix-hover rounded-lg border border-netflix-border hover:border-instituto-orange/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-netflix-text">{user.full_name}</h3>
                    <p className="text-sm text-netflix-text-muted">{user.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskBadgeColor(user.risk_level || 'low')}>
                      {user.risk_level === 'high' ? 'Alto Risco' : 
                       user.risk_level === 'moderate' ? 'Risco Moderado' : 'Baixo Risco'}
                    </Badge>
                    
                    {user.latest_weight && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(user.weight_trend || 'stable')}
                        <span className="text-sm text-netflix-text-muted">
                          {user.weight_trend === 'up' ? 'Subindo' :
                           user.weight_trend === 'down' ? 'Descendo' : 'Estável'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {user.latest_weight ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-2 bg-netflix-card rounded">
                      <p className="text-xs text-netflix-text-muted">Peso Atual</p>
                      <p className="text-lg font-bold text-netflix-text">
                        {user.latest_weight.peso_kg.toFixed(1)} kg
                      </p>
                    </div>
                    
                    <div className="text-center p-2 bg-netflix-card rounded">
                      <p className="text-xs text-netflix-text-muted">IMC</p>
                      <p className="text-lg font-bold text-netflix-text">
                        {user.latest_weight.imc?.toFixed(1) || '--'}
                      </p>
                    </div>
                    
                    <div className="text-center p-2 bg-netflix-card rounded">
                      <p className="text-xs text-netflix-text-muted">Gordura</p>
                      <p className="text-lg font-bold text-netflix-text">
                        {user.latest_weight.gordura_corporal_pct?.toFixed(1) || '--'}%
                      </p>
                    </div>
                    
                    <div className="text-center p-2 bg-netflix-card rounded">
                      <p className="text-xs text-netflix-text-muted">Medições</p>
                      <p className="text-lg font-bold text-netflix-text">
                        {user.total_measurements}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-netflix-text-muted">
                    <Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum dado de peso registrado</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-netflix-border">
                  <div className="flex items-center gap-2 text-xs text-netflix-text-muted">
                    <Calendar className="h-3 w-3" />
                    {user.latest_weight ? (
                      <span>
                        Última medição: {formatDistanceToNow(new Date(user.latest_weight.data_medicao), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    ) : (
                      <span>Sem medições</span>
                    )}
                  </div>

                  {user.latest_weight?.origem_medicao === 'balança_bluetooth' && (
                    <Badge variant="outline" className="text-xs border-instituto-purple text-instituto-purple">
                      Via Bluetooth
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange/10"
                    onClick={() => {
                      // Funcionalidade para atualizar dados via balança será implementada
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "Use a aba 'Bluetooth' para coletar novos dados",
                      });
                    }}
                  >
                    <Scale className="h-3 w-3 mr-1" />
                    Atualizar via Balança
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                    onClick={() => {
                      // Navegar para histórico do usuário
                      toast({
                        title: "Histórico",
                        description: `Abrindo histórico de ${user.full_name}`,
                      });
                    }}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Ver Histórico
                  </Button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-netflix-text-muted">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p>Cadastre usuários para começar a coletar dados da balança</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-instituto-orange" />
              <div>
                <p className="text-sm text-netflix-text-muted">Total Usuários</p>
                <p className="text-2xl font-bold text-netflix-text">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-instituto-purple" />
              <div>
                <p className="text-sm text-netflix-text-muted">Com Dados</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {users.filter(u => u.latest_weight).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-netflix-text-muted">Alto Risco</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {users.filter(u => u.risk_level === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-instituto-green" />
              <div>
                <p className="text-sm text-netflix-text-muted">Baixo Risco</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {users.filter(u => u.risk_level === 'low').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};