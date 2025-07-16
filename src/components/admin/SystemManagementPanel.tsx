import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Database, 
  Download, 
  MessageSquare, 
  Users,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { ReportExporter } from '@/components/reports/ReportExporter';
import { SupportChat } from '@/components/support/SupportChat';
import { useNotifications } from '@/hooks/useNotifications';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useDataBackup } from '@/hooks/useDataBackup';
import { useToast } from '@/hooks/use-toast';

export const SystemManagementPanel: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('notifications');
  const { 
    permission, 
    isSupported, 
    requestPermission, 
    notifyMissionComplete,
    notifyWeeklyReport,
    notifySessionReminder 
  } = useNotifications();
  
  const { 
    isOnline, 
    pendingActions, 
    syncPendingActions 
  } = useOfflineMode();
  
  const { 
    isBackingUp, 
    lastBackup, 
    backupHistory, 
    createBackup,
    exportBackup 
  } = useDataBackup();
  
  const { toast } = useToast();

  const testNotifications = () => {
    notifyMissionComplete("Exercício matinal de 30 minutos");
    toast({
      title: "Notificação de teste enviada",
      description: "Verifique se recebeu a notificação"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-netflix-text">Gerenciamento do Sistema</h2>
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-netflix-card border-netflix-border">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="offline" className="gap-2">
            <Zap className="w-4 h-4" />
            Modo Offline
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <Download className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Suporte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Sistema de Notificações Push
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-netflix-text">Status das Notificações</h4>
                  <p className="text-sm text-netflix-text-muted">
                    {isSupported ? 'Suportado pelo navegador' : 'Não suportado'}
                  </p>
                </div>
                <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
                  {permission === 'granted' ? 'Ativas' : permission === 'denied' ? 'Negadas' : 'Pendente'}
                </Badge>
              </div>

              {permission !== 'granted' && (
                <Button 
                  onClick={requestPermission}
                  className="w-full bg-instituto-orange hover:bg-instituto-orange-hover"
                >
                  Ativar Notificações Push
                </Button>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-netflix-text">Testar Notificações</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => notifyMissionComplete("Teste de missão")}
                  >
                    Missão Completa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={notifyWeeklyReport}
                  >
                    Relatório Semanal
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => notifySessionReminder("15:30")}
                  >
                    Lembrete Sessão
                  </Button>
                </div>
              </div>

              <div className="bg-instituto-orange/10 p-4 rounded-lg">
                <h4 className="font-semibold text-netflix-text mb-2">Configurações de Notificação</h4>
                <ul className="text-sm text-netflix-text-muted space-y-1">
                  <li>• Notificações automáticas para missões concluídas</li>
                  <li>• Lembretes de sessões agendadas</li>
                  <li>• Relatórios semanais de progresso</li>
                  <li>• Conquistas e marcos importantes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Modo Offline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-netflix-text">Status da Conexão</h4>
                  <p className="text-sm text-netflix-text-muted">
                    {isOnline ? 'Conectado à internet' : 'Trabalhando offline'}
                  </p>
                </div>
                <Badge variant={isOnline ? 'default' : 'destructive'}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {pendingActions > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-netflix-text">Ações Pendentes</h4>
                      <p className="text-sm text-netflix-text-muted">
                        {pendingActions} ações aguardando sincronização
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={syncPendingActions}
                      disabled={!isOnline}
                    >
                      Sincronizar
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-instituto-orange/10 p-4 rounded-lg">
                <h4 className="font-semibold text-netflix-text mb-2">Funcionalidades Offline</h4>
                <ul className="text-sm text-netflix-text-muted space-y-1">
                  <li>• Visualizar dados salvos localmente</li>
                  <li>• Completar missões (sincroniza quando online)</li>
                  <li>• Acessar cursos baixados</li>
                  <li>• Registrar progresso básico</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup Automático de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-netflix-text">Último Backup</h4>
                  <p className="text-sm text-netflix-text-muted">
                    {lastBackup ? new Date(lastBackup).toLocaleString('pt-BR') : 'Nenhum backup realizado'}
                  </p>
                </div>
                <Button 
                  onClick={() => createBackup('manual')}
                  disabled={isBackingUp}
                  className="bg-instituto-orange hover:bg-instituto-orange-hover"
                >
                  {isBackingUp ? 'Criando...' : 'Backup Manual'}
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-netflix-text">Histórico de Backups</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-netflix-text">
                          {backup.backup_type === 'automatic' ? 'Automático' : 'Manual'}
                        </p>
                        <p className="text-xs text-netflix-text-muted">
                          {new Date(backup.created_at).toLocaleString('pt-BR')} - {(backup.size_bytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => exportBackup(backup.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-instituto-orange/10 p-4 rounded-lg">
                <h4 className="font-semibold text-netflix-text mb-2">Configuração de Backup</h4>
                <ul className="text-sm text-netflix-text-muted space-y-1">
                  <li>• Backup automático a cada 24 horas</li>
                  <li>• Dados inclusos: perfil, progresso, missões, metas</li>
                  <li>• Armazenamento local seguro</li>
                  <li>• Exportação disponível em JSON</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportExporter />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-instituto-orange/10 p-4 rounded-lg">
                <h4 className="font-semibold text-netflix-text mb-2">Sistema de Suporte Integrado</h4>
                <ul className="text-sm text-netflix-text-muted space-y-1 mb-4">
                  <li>• Chat em tempo real com suporte</li>
                  <li>• Integração com Zapier para automações</li>
                  <li>• Ações rápidas para dúvidas comuns</li>
                  <li>• Histórico de conversas salvo</li>
                </ul>
                <p className="text-sm text-netflix-text-muted">
                  O widget de chat está disponível no canto inferior direito da tela.
                  Configure seu webhook do Zapier para receber mensagens automaticamente.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* O SupportChat será renderizado como floating widget */}
          <SupportChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};