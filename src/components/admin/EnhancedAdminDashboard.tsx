import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { UsersList } from '@/components/admin/UsersList';
import { CompleteTrendTrackWeightSystem } from '@/components/admin/CompleteTrendTrackWeightSystem';
import { ClientRegistrationForm } from '@/components/admin/ClientRegistrationForm';
import { SessionManagement } from '@/components/admin/SessionManagement';
import { SessionHistory } from '@/components/admin/SessionHistory';
import { ClientReports } from '@/components/admin/ClientReports';
import { UserManagement } from '@/components/admin/UserManagement';
import { DataVisualization } from '@/components/admin/DataVisualization';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { UserSelector } from '@/components/admin/UserSelector';
import { IndividualClientDashboard } from '@/components/admin/IndividualClientDashboard';
import { 
  Users, 
  Video, 
  BarChart3, 
  Settings, 
  Bell,
  Crown,
  UserPlus,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  Eye,
  Database,
  GraduationCap,
  UserSearch
} from 'lucide-react';

export const EnhancedAdminDashboard: React.FC = () => {
  console.log('EnhancedAdminDashboard component rendering');
  
  const [notifications, setNotifications] = useState(3);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const stats = [
    {
      title: "Clientes Ativos",
      value: "47",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "instituto-orange"
    },
    {
      title: "Sessões Enviadas",
      value: "124",
      change: "+8%",
      trend: "up",
      icon: Video,
      color: "instituto-purple"
    },
    {
      title: "Taxa de Conclusão",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "instituto-green"
    },
    {
      title: "Engajamento Semanal",
      value: "94%",
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "instituto-lilac"
    }
  ];

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-netflix-dark p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-netflix-text flex items-center gap-3">
                <Crown className="h-8 w-8 text-instituto-gold animate-glow" />
                Painel Administrativo Avançado
              </h1>
              <p className="text-netflix-text-muted text-lg">
                {selectedUserId ? 'Dashboard Individual do Cliente' : 'Gerencie e monitore seus clientes com análises detalhadas'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative border-netflix-border text-netflix-text hover:bg-netflix-hover">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-instituto-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in">
                    {notifications}
                  </span>
                )}
              </Button>
              <Button variant="outline" className="border-netflix-border text-netflix-text hover:bg-netflix-hover">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 floating-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-netflix-text-muted text-sm font-medium">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-netflix-text">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium flex items-center gap-1 mt-1 text-instituto-green`}>
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}/10 pulse-glow`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="clientes" className="space-y-6">
          <TabsList className="bg-netflix-card border border-netflix-border grid grid-cols-2 lg:grid-cols-5 gap-1">
            {/* 👥 Análise de Clientes */}
            <TabsTrigger 
              value="clientes" 
              className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text transition-all duration-200 hover:bg-instituto-orange/20"
            >
              <UserSearch className="h-4 w-4 mr-2" />
              👥 Clientes
            </TabsTrigger>
            
            {/* 👥 Gestão de Usuários */}
            <TabsTrigger 
              value="usuarios" 
              className="data-[state=active]:bg-instituto-purple data-[state=active]:text-white text-netflix-text transition-all duration-200 hover:bg-instituto-purple/20"
            >
              <Users className="h-4 w-4 mr-2" />
              👥 Usuários
            </TabsTrigger>
            
            {/* 📚 Cursos Pagos */}
            <TabsTrigger 
              value="cursos" 
              className="data-[state=active]:bg-instituto-green data-[state=active]:text-white text-netflix-text transition-all duration-200 hover:bg-instituto-green/20"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              📚 Cursos
            </TabsTrigger>

            {/* 📊 Relatórios e Dados */}
            <TabsTrigger 
              value="relatorios" 
              className="data-[state=active]:bg-instituto-gold data-[state=active]:text-white text-netflix-text transition-all duration-200 hover:bg-instituto-gold/20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              📊 Relatórios
            </TabsTrigger>
            
            {/* ⚙️ Configurações */}
            <TabsTrigger 
              value="configuracoes" 
              className="data-[state=active]:bg-instituto-lilac data-[state=active]:text-white text-netflix-text transition-all duration-200 hover:bg-instituto-lilac/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              ⚙️ Config
            </TabsTrigger>
          </TabsList>

          {/* 👥 ANÁLISE INDIVIDUAL DE CLIENTES */}
          <TabsContent value="clientes" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Seletor de Usuários */}
              <div className="xl:col-span-1">
                <UserSelector
                  onUserSelect={setSelectedUserId}
                  selectedUserId={selectedUserId}
                />
              </div>

              {/* Dashboard Individual */}
              <div className="xl:col-span-2">
                <IndividualClientDashboard
                  selectedUserId={selectedUserId}
                  onClose={() => setSelectedUserId(null)}
                />
              </div>
            </div>
          </TabsContent>

          {/* 👥 GESTÃO DE USUÁRIOS */}
          <TabsContent value="usuarios" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Cadastro de Cliente */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-purple/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-instituto-purple" />
                    👤 Cadastrar Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientRegistrationForm />
                </CardContent>
              </Card>

              {/* Lista de Usuários */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-purple/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <Users className="h-5 w-5 text-instituto-purple" />
                    👥 Lista de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UsersList />
                </CardContent>
              </Card>
            </div>

            {/* Gerenciamento Completo */}
            <Card className="bg-netflix-card border-netflix-border hover:border-instituto-purple/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Shield className="h-5 w-5 text-instituto-purple" />
                  🔧 Gerenciamento Avançado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 📚 CURSOS PAGOS */}
          <TabsContent value="cursos" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border hover:border-instituto-green/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-instituto-green" />
                  📚 Gerenciar Cursos Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CourseManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 📊 RELATÓRIOS E DADOS */}
          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Visualização de Dados */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-gold/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <Eye className="h-5 w-5 text-instituto-gold" />
                    📈 Visualizar Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataVisualization />
                </CardContent>
              </Card>

              {/* Relatórios de Clientes */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-gold/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-instituto-gold" />
                    📊 Relatórios de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientReports />
                </CardContent>
              </Card>
            </div>

            {/* Sistema de Peso Completo */}
            <Card className="bg-netflix-card border-netflix-border hover:border-instituto-gold/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-instituto-gold" />
                  📈 Sistema de Controle de Peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompleteTrendTrackWeightSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ⚙️ CONFIGURAÇÕES E INTEGRAÇÕES */}
          <TabsContent value="configuracoes" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Gestão de Sessões */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-lilac/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <Video className="h-5 w-5 text-instituto-lilac" />
                    🎥 Gestão de Sessões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionManagement />
                </CardContent>
              </Card>

              {/* Histórico de Sessões */}
              <Card className="bg-netflix-card border-netflix-border hover:border-instituto-lilac/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-netflix-text flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-instituto-lilac" />
                    📅 Histórico de Sessões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionHistory />
                </CardContent>
              </Card>
            </div>

            {/* Configurações do Sistema */}
            <Card className="bg-netflix-card border-netflix-border hover:border-instituto-lilac/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Database className="h-5 w-5 text-instituto-lilac" />
                  🔧 Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SystemSettings />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AdminProtectedRoute>
  );
};