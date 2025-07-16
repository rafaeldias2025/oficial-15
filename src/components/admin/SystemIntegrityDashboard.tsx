import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegistrationSystem } from '@/hooks/useRegistrationSystem';
import { AlertTriangle, CheckCircle, RefreshCw, Activity } from 'lucide-react';

interface IntegrityIssues {
  users_without_weighings: number;
  records_without_user_id: number;
  null_critical_fields: number;
  orphaned_profiles: number;
}

interface IntegrityData {
  monitor_timestamp: string;
  status: 'healthy' | 'warning';
  issues: IntegrityIssues;
  recommendations: string[];
}

export const SystemIntegrityDashboard = () => {
  const { executeDataIntegrityMonitor, executeHealthCheck } = useRegistrationSystem();
  const [integrityData, setIntegrityData] = useState<IntegrityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runIntegrityCheck = async () => {
    setIsLoading(true);
    try {
      const result = await executeDataIntegrityMonitor();
      if (result.success) {
        setIntegrityData(result.data as unknown as IntegrityData);
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('Erro ao executar verificação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runHealthCheckForAllUsers = async () => {
    setIsLoading(true);
    try {
      // Esta funcionalidade seria implementada para verificar todos os usuários
      console.log('Executando health check para todos os usuários...');
      // Implementar lógica para percorrer todos os usuários
      await executeHealthCheck();
      await runIntegrityCheck(); // Re-executar após health check
    } catch (error) {
      console.error('Erro no health check geral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Executar verificação inicial
    runIntegrityCheck();
  }, []);

  const getStatusColor = (status: 'healthy' | 'warning') => {
    return status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500';
  };

  const getStatusIcon = (status: 'healthy' | 'warning') => {
    return status === 'healthy' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;
  };

  const getTotalIssues = (issues: IntegrityIssues) => {
    return Object.values(issues).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Monitoramento de Integridade do Sistema
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={runIntegrityCheck}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Verificar Agora
              </Button>
              <Button
                onClick={runHealthCheckForAllUsers}
                disabled={isLoading}
                size="sm"
              >
                Health Check Geral
              </Button>
            </div>
          </div>
          {lastCheck && (
            <p className="text-sm text-muted-foreground">
              Última verificação: {lastCheck.toLocaleString('pt-BR')}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {integrityData ? (
            <>
              {/* Status Geral */}
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(integrityData.status)}`} />
                {getStatusIcon(integrityData.status)}
                <div>
                  <h3 className="font-semibold">
                    Status do Sistema: {integrityData.status === 'healthy' ? 'Saudável' : 'Atenção Necessária'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTotalIssues(integrityData.issues)} problema(s) detectado(s)
                  </p>
                </div>
              </div>

              {/* Detalhes dos Problemas */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Problemas Detectados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Usuários sem pesagens:</span>
                      <Badge variant={integrityData.issues.users_without_weighings > 0 ? 'destructive' : 'secondary'}>
                        {integrityData.issues.users_without_weighings}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Registros órfãos:</span>
                      <Badge variant={integrityData.issues.records_without_user_id > 0 ? 'destructive' : 'secondary'}>
                        {integrityData.issues.records_without_user_id}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Campos críticos nulos:</span>
                      <Badge variant={integrityData.issues.null_critical_fields > 0 ? 'destructive' : 'secondary'}>
                        {integrityData.issues.null_critical_fields}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profiles incompletos:</span>
                      <Badge variant={integrityData.issues.orphaned_profiles > 0 ? 'destructive' : 'secondary'}>
                        {integrityData.issues.orphaned_profiles}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {integrityData.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {integrityData.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">⚠️</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Nenhuma ação necessária no momento
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Alertas */}
              {integrityData.status === 'warning' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Atenção:</strong> Foram detectados problemas de integridade nos dados. 
                    Recomendamos executar as ações corretivas sugeridas acima para manter o sistema funcionando corretamente.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              {/* Ações Rápidas */}
              <div>
                <h3 className="font-semibold mb-3">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    Criar Pesagens Faltantes
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    Limpar Registros Órfãos
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    Preencher Campos Críticos
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    Completar Profiles
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Clique em "Verificar Agora" para executar a verificação de integridade
              </p>
              <Button onClick={runIntegrityCheck} disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Executar Primeira Verificação'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};