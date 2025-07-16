import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHealthIntegration } from '@/hooks/useHealthIntegration';
import { 
  Activity, 
  Heart, 
  Smartphone, 
  RefreshCw, 
  Settings, 
  Shield, 
  Clock, 
  Check, 
  X,
  AlertCircle,
  Apple,
  Chrome,
  Loader2,
  Download,
  Upload,
  Zap
} from 'lucide-react';

export const HealthIntegration = () => {
  const {
    state,
    isIOS,
    isAndroid,
    isAppleHealthAvailable,
    isGoogleFitAvailable,
    connectAppleHealth,
    connectGoogleFit,
    syncAllData,
    saveUserConfig,
    disconnect,
  } = useHealthIntegration();

  const [syncingData, setSyncingData] = useState(false);

  const handleSync = async () => {
    setSyncingData(true);
    try {
      await syncAllData();
    } finally {
      setSyncingData(false);
    }
  };

  const handleDataTypeToggle = (dataType: keyof typeof state.config.dataTypes) => {
    saveUserConfig({
      dataTypes: {
        ...state.config.dataTypes,
        [dataType]: !state.config.dataTypes[dataType],
      },
    });
  };

  const handleSyncFrequencyChange = (frequency: 'daily' | 'weekly' | 'manual') => {
    saveUserConfig({ syncFrequency: frequency });
  };

  const handleAutoSyncToggle = () => {
    saveUserConfig({ autoSync: !state.config.autoSync });
  };

  const getConnectionStatus = () => {
    if (state.isConnected) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
          <Check className="h-3 w-3 mr-1" />
          Conectado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <X className="h-3 w-3 mr-1" />
        Desconectado
      </Badge>
    );
  };

  const getDeviceIcon = () => {
    if (isIOS) return <Apple className="h-5 w-5" />;
    if (isAndroid) return <Chrome className="h-5 w-5" />;
    return <Smartphone className="h-5 w-5" />;
  };

  const getLastSyncInfo = () => {
    if (state.lastSync) {
      const timeAgo = new Date(Date.now() - state.lastSync.getTime()).toLocaleString();
      return `Última sincronização: ${timeAgo}`;
    }
    return 'Nenhuma sincronização realizada';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Heart className="h-6 w-6" />
            Integração com Apple Health & Google Fit
          </CardTitle>
          <CardDescription className="text-blue-600">
            Sincronize automaticamente seus dados de saúde e fitness dos aplicativos nativos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getDeviceIcon()}
              Status da Conexão
            </span>
            {getConnectionStatus()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                state.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`} />
              <span className="font-medium">
                {state.isConnected ? 'Serviços conectados' : 'Nenhuma conexão ativa'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {getLastSyncInfo()}
            </div>
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Conexões Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apple Health */}
        <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Apple Health
            </CardTitle>
            <CardDescription>
              Sincronize dados de saúde do iPhone/iPad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={state.config.appleHealthEnabled ? "default" : "secondary"}>
                {state.config.appleHealthEnabled ? 'Habilitado' : 'Desabilitado'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Disponível:</span>
              <span className="text-sm">
                {isAppleHealthAvailable ? '✅ Sim' : '❌ Não'}
              </span>
            </div>

            <div className="flex gap-2">
              {!state.config.appleHealthEnabled ? (
                <Button
                  onClick={connectAppleHealth}
                  disabled={state.isLoading || !isIOS}
                  className="flex-1"
                  size="sm"
                >
                  {state.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Conectar
                </Button>
              ) : (
                <Button
                  onClick={() => disconnect('apple_health')}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              )}
            </div>

            {!isIOS && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Disponível apenas em dispositivos iOS
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Google Fit */}
        <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Google Fit
            </CardTitle>
            <CardDescription>
              Sincronize dados de fitness do Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={state.config.googleFitEnabled ? "default" : "secondary"}>
                {state.config.googleFitEnabled ? 'Habilitado' : 'Desabilitado'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Disponível:</span>
              <span className="text-sm">
                {isGoogleFitAvailable ? '✅ Sim' : '🔄 Carregando'}
              </span>
            </div>

            <div className="flex gap-2">
              {!state.config.googleFitEnabled ? (
                <Button
                  onClick={connectGoogleFit}
                  disabled={state.isLoading}
                  className="flex-1"
                  size="sm"
                >
                  {state.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Conectar
                </Button>
              ) : (
                <Button
                  onClick={() => disconnect('google_fit')}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Funciona em Android e navegadores web
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Sincronização */}
      {state.isConnected && (
        <Card>
          <CardHeader>
                       <CardTitle className="flex items-center gap-2">
             <RefreshCw className="h-5 w-5" />
             Controles de Sincronização
           </CardTitle>
            <CardDescription>
              Gerencie como e quando seus dados são sincronizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sincronização Manual */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Sincronizar Agora</p>
                  <p className="text-sm text-gray-600">Importar dados mais recentes</p>
                </div>
              </div>
              <Button
                onClick={handleSync}
                disabled={syncingData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {syncingData ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Sincronizar
              </Button>
            </div>

            <Separator />

            {/* Sincronização Automática */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="auto-sync" className="font-medium">
                    Sincronização Automática
                  </Label>
                  <p className="text-sm text-gray-600">
                    Sincronizar dados automaticamente
                  </p>
                </div>
              </div>
              <Switch
                id="auto-sync"
                checked={state.config.autoSync}
                onCheckedChange={handleAutoSyncToggle}
              />
            </div>

            {/* Frequência de Sincronização */}
            {state.config.autoSync && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Frequência:</Label>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'manual'] as const).map((freq) => (
                    <Button
                      key={freq}
                      variant={state.config.syncFrequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSyncFrequencyChange(freq)}
                    >
                      {freq === 'daily' && 'Diário'}
                      {freq === 'weekly' && 'Semanal'}
                      {freq === 'manual' && 'Manual'}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configuração de Dados */}
      {state.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tipos de Dados
            </CardTitle>
            <CardDescription>
              Escolha quais dados serão sincronizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(state.config.dataTypes).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {key === 'weight' && <Activity className="h-4 w-4 text-blue-600" />}
                    {key === 'height' && <Activity className="h-4 w-4 text-green-600" />}
                    {key === 'bodyComposition' && <Activity className="h-4 w-4 text-purple-600" />}
                    {key === 'activity' && <Activity className="h-4 w-4 text-orange-600" />}
                    {key === 'sleep' && <Activity className="h-4 w-4 text-indigo-600" />}
                    {key === 'heartRate' && <Heart className="h-4 w-4 text-red-600" />}
                    {key === 'bloodPressure' && <Heart className="h-4 w-4 text-red-800" />}
                    {key === 'nutrition' && <Activity className="h-4 w-4 text-yellow-600" />}
                    <span className="text-sm font-medium capitalize">
                      {key === 'weight' && 'Peso'}
                      {key === 'height' && 'Altura'}
                      {key === 'bodyComposition' && 'Composição Corporal'}
                      {key === 'activity' && 'Atividade Física'}
                      {key === 'sleep' && 'Sono'}
                      {key === 'heartRate' && 'Frequência Cardíaca'}
                      {key === 'bloodPressure' && 'Pressão Arterial'}
                      {key === 'nutrition' && 'Nutrição'}
                    </span>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleDataTypeToggle(key as keyof typeof state.config.dataTypes)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações de Privacidade */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Shield className="h-5 w-5" />
            Privacidade e Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-700">
          <p>• Seus dados de saúde são criptografados e armazenados com segurança</p>
          <p>• Apenas você tem acesso aos seus dados pessoais</p>
          <p>• Você pode desconectar e remover os dados a qualquer momento</p>
          <p>• Seguimos todas as regulamentações de privacidade aplicáveis</p>
        </CardContent>
      </Card>

      {/* Instruções de Uso */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            Como Usar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700">
          <p><strong>Para iOS:</strong> Conecte com Apple Health para sincronizar dados do iPhone/iPad</p>
          <p><strong>Para Android:</strong> Use Google Fit para sincronizar dados de fitness</p>
          <p><strong>Para Web:</strong> Google Fit funciona em navegadores Chrome e Edge</p>
          <p><strong>Sincronização:</strong> Os dados são importados automaticamente baseado na frequência escolhida</p>
        </CardContent>
      </Card>
    </div>
  );
}; 