import React from 'react';
import { HealthIntegrationTest } from '@/components/HealthIntegrationTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, Chrome, Smartphone, TestTube, CheckCircle, XCircle } from 'lucide-react';

export const TesteIntegracaoSaude: React.FC = () => {
  // Funções para detectar plataforma
  const isIOSDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroidDevice = () => /Android/.test(navigator.userAgent);
  const isWebDevice = () => !isIOSDevice() && !isAndroidDevice();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">🧪 Teste de Integração de Saúde</h1>
        <p className="text-muted-foreground">
          Verifique se as integrações com Apple Health e Google Fit estão funcionando corretamente
        </p>
      </div>

      {/* Resumo da Plataforma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Detecção de Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Apple className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">iOS</div>
              <Badge variant={isIOSDevice() ? "default" : "secondary"}>
                {isIOSDevice() ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {isIOSDevice() ? "Detectado" : "Não detectado"}
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Chrome className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Android</div>
              <Badge variant={isAndroidDevice() ? "default" : "secondary"}>
                {isAndroidDevice() ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {isAndroidDevice() ? "Detectado" : "Não detectado"}
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Web</div>
              <Badge variant={isWebDevice() ? "default" : "secondary"}>
                {isWebDevice() ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {isWebDevice() ? "Detectado" : "Não detectado"}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium mb-2">User Agent:</div>
            <div className="text-xs text-muted-foreground break-all">
              {navigator.userAgent}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Como Testar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Apple className="h-4 w-4" />
                Apple Health (iOS)
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Disponível apenas em dispositivos iOS</li>
                <li>• Requer app nativo com HealthKit</li>
                <li>• No navegador: dados simulados</li>
                <li>• Clique em "Testar Apple Health"</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Chrome className="h-4 w-4" />
                Google Fit (Android/Web)
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Funciona em Android e Web</li>
                <li>• Requer conta Google</li>
                <li>• OAuth2 real com dados da API</li>
                <li>• Clique em "Testar Google Fit"</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">⚠️ Importante:</div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>iOS real:</strong> Precisa de app nativo com Capacitor</p>
              <p>• <strong>Android real:</strong> Precisa das chaves Google configuradas</p>
              <p>• <strong>Web:</strong> Dados simulados para demonstração</p>
              <p>• <strong>Teste:</strong> Ambos os modais funcionam em qualquer plataforma</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente de Teste */}
      <HealthIntegrationTest />
    </div>
  );
}; 