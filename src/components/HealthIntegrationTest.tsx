import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Chrome, Smartphone, TestTube } from 'lucide-react';
import { useHealthIntegration } from '@/hooks/useHealthIntegration';
import { GoogleFitModal } from './GoogleFitModal';

export const HealthIntegrationTest: React.FC = () => {
  const [showGoogleFitModal, setShowGoogleFitModal] = useState(false);
  
  const {
    state: healthState,
    connectGoogleFit
  } = useHealthIntegration();

  // Funções para detectar plataforma
  const isAndroidDevice = () => /Android/.test(navigator.userAgent);

  const handleGoogleFitConnect = async (email: string) => {
    await connectGoogleFit(email);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Teste de Integração Google Fit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações da Plataforma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm font-medium">User Agent</div>
              <div className="text-xs text-muted-foreground break-all">
                {navigator.userAgent}
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Chrome className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm font-medium">Android Detectado</div>
              <Badge variant={isAndroidDevice() ? "default" : "secondary"}>
                {isAndroidDevice() ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>

          {/* Status da Conexão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status Google Fit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Conectado:</span>
                  <Badge variant={healthState.isConnected ? "default" : "secondary"}>
                    {healthState.isConnected ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Autorizado:</span>
                  <Badge variant={healthState.isAuthorized ? "default" : "secondary"}>
                    {healthState.isAuthorized ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Carregando:</span>
                  <Badge variant={healthState.isLoading ? "default" : "secondary"}>
                    {healthState.isLoading ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Teste */}
          <Button
            onClick={() => setShowGoogleFitModal(true)}
            disabled={healthState.isLoading}
            className="w-full"
            variant="default"
          >
            <Chrome className="h-4 w-4 mr-2" />
            Testar Google Fit
          </Button>

          {/* Informações importantes */}
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">ℹ️ Como funciona:</div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Email:</strong> Digite seu email Google para autenticação</p>
                <p>• <strong>OAuth2:</strong> Autenticação real com Google Fit API</p>
                <p>• <strong>Dados:</strong> Peso, passos, frequência cardíaca, calorias</p>
                <p>• <strong>Supabase:</strong> Dados salvos automaticamente</p>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-800 mb-2">✅ Funciona em:</div>
              <div className="text-sm text-green-700 space-y-1">
                <p>• <strong>Android:</strong> Integração nativa com Google Fit</p>
                <p>• <strong>Web:</strong> Qualquer navegador com conta Google</p>
                <p>• <strong>iOS:</strong> Via navegador com conta Google</p>
              </div>
            </div>
          </div>

          {/* Erro se houver */}
          {healthState.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm font-medium text-red-800">Erro:</div>
              <div className="text-sm text-red-600">{healthState.error}</div>
            </div>
          )}

          {/* Última sincronização */}
          {healthState.lastSync && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-800">Última Sincronização:</div>
              <div className="text-sm text-green-600">
                {healthState.lastSync.toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <GoogleFitModal
        isOpen={showGoogleFitModal}
        onClose={() => setShowGoogleFitModal(false)}
        onConnect={handleGoogleFitConnect}
        isLoading={healthState.isLoading}
        isConnected={healthState.isConnected}
      />
    </div>
  );
}; 