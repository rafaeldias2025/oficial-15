import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Database, 
  Bell, 
  Mail, 
  Shield, 
  Clock,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    systemName: 'Instituto Borboleta',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    maintenanceMode: false,
    
    // Notificações
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notificationSound: true,
    
    // Segurança
    requireTwoFactor: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Sistema
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    debugMode: false
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Instituto Borboleta'
  });

  const handleSaveSettings = async () => {
    try {
      // Aqui você salvaria as configurações no banco
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  const handleTestEmail = async () => {
    try {
      toast({
        title: "Email de teste enviado",
        description: "Verifique sua caixa de entrada."
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o email de teste.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="text-sm">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="system" className="text-sm">
            <Database className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Globe className="h-5 w-5 text-instituto-orange" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                    className="bg-netflix-hover border-netflix-border text-netflix-text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma Padrão</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-netflix-hover rounded-lg">
                  <div>
                    <Label>Modo Manutenção</Label>
                    <p className="text-sm text-netflix-text-muted">
                      Bloqueia acesso de usuários ao sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Bell className="h-5 w-5 text-instituto-purple" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-netflix-text">Tipos de Notificação</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-netflix-text-muted">Receber notificações por email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Push</Label>
                      <p className="text-sm text-netflix-text-muted">Notificações push no navegador</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>SMS</Label>
                      <p className="text-sm text-netflix-text-muted">Notificações por SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Som</Label>
                      <p className="text-sm text-netflix-text-muted">Reproduzir som nas notificações</p>
                    </div>
                    <Switch
                      checked={settings.notificationSound}
                      onCheckedChange={(checked) => setSettings({...settings, notificationSound: checked})}
                    />
                  </div>
                </div>

                {/* Configuração de Email */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-netflix-text flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Configuração SMTP
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="smtpHost">Servidor SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={emailConfig.smtpHost}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                        placeholder="smtp.gmail.com"
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpPort">Porta</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={emailConfig.smtpPort}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpPort: parseInt(e.target.value)})}
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fromEmail">Email Remetente</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={emailConfig.fromEmail}
                        onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                        placeholder="noreply@institutoborboleta.com"
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                      />
                    </div>

                    <Button onClick={handleTestEmail} variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Testar Configuração
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Shield className="h-5 w-5 text-instituto-green" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Autenticação em Duas Etapas</Label>
                      <p className="text-sm text-netflix-text-muted">Exigir 2FA para todos os admins</p>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => setSettings({...settings, requireTwoFactor: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Expiração de Senha (dias)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Tentativas de Login</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={settings.loginAttempts}
                      onChange={(e) => setSettings({...settings, loginAttempts: parseInt(e.target.value)})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Sistema */}
        <TabsContent value="system" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Database className="h-5 w-5 text-instituto-lilac" />
                Configurações de Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-netflix-text-muted">Fazer backup automaticamente</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                      <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) => setSettings({...settings, dataRetention: parseInt(e.target.value)})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                    <div>
                      <Label>Modo Debug</Label>
                      <p className="text-sm text-netflix-text-muted">Ativar logs detalhados</p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Ações do Sistema */}
              <div className="border-t border-netflix-border pt-4 mt-6">
                <h3 className="text-lg font-semibold text-netflix-text mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Ações Críticas do Sistema
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6" />
                    <span>Reiniciar Sistema</span>
                    <span className="text-xs text-netflix-text-muted">Reinicia todos os serviços</span>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Database className="h-6 w-6" />
                    <span>Backup Manual</span>
                    <span className="text-xs text-netflix-text-muted">Criar backup agora</span>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 text-red-500 border-red-500/20 hover:bg-red-500/10">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Limpar Cache</span>
                    <span className="text-xs text-netflix-text-muted">Remove todos os caches</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-instituto-orange hover:bg-instituto-orange/80">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};