
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, LogOut } from "lucide-react";
import ThemeToggle from "@/components/netflix/ThemeToggle";
import { DadosFisicosForm } from "@/components/DadosFisicosForm";
import AvaliacaoSemanal from "@/components/AvaliacaoSemanal";
import { RealUserRanking } from "@/components/RealUserRanking";
import MinhasMetas from "@/components/MinhasMetas";
import Desafios from "@/components/Desafios";
import DiarioSaude from "@/components/DiarioSaude";
import MissaoDia from "@/components/MissaoDia";
import { BeneficiosVisuais } from "@/components/BeneficiosVisuais";
import { ProgressCharts } from "@/components/ProgressCharts";
import { TesteSabotadores } from "@/components/TesteSabotadores";
import { useGoals } from "@/hooks/useGoals";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ClientSessions } from "@/components/sessions/ClientSessions";
import { RequiredDataModal } from "@/components/RequiredDataModal";
import { PaidCourses } from "@/components/courses/PaidCourses";
import { AdvancedHealthDashboard } from "@/components/dashboard/AdvancedHealthDashboard";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home,
  Trophy,
  Calendar,
  Target,
  Award,
  FileText,
  Settings,
  BarChart3,
  Scale,
  GraduationCap,
  User
} from "lucide-react";

// Dados mock para ranking
const topRankingUsers = [
  {id: 1, name: "Ana Silva", points: 3200, position: 1, lastPosition: 2, streak: 25, completedChallenges: 28, cidade: "São Paulo", trend: 'up' as const, positionChange: 1},
  {id: 2, name: "Carlos Santos", points: 2800, position: 2, lastPosition: 1, streak: 20, completedChallenges: 22, cidade: "Rio de Janeiro", trend: 'down' as const, positionChange: 1},
  {id: 3, name: "Maria Costa", points: 2400, position: 3, lastPosition: 3, streak: 15, completedChallenges: 18, cidade: "Belo Horizonte", trend: 'stable' as const, positionChange: 0},
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('inicio');
  const [rankingTimeFilter, setRankingTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'cursos-pagos', label: 'Cursos Pagos', icon: GraduationCap },
    { id: 'sessoes', label: 'Sessões', icon: FileText },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'avaliacao-semanal', label: 'Avaliação Semanal', icon: Calendar },
    { id: 'metas', label: 'Minhas Metas', icon: Target },
    { id: 'desafios', label: 'Desafios', icon: Award },
    { id: 'diario', label: 'Diário de Saúde', icon: FileText },
    { id: 'teste-sabotadores', label: 'Teste de Sabotadores', icon: Settings },
    { id: 'meu-progresso', label: 'Meu Progresso', icon: BarChart3 },
    { id: 'analise-avancada', label: 'Análise Avançada', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <MissaoDia isVisitor={false} />;
      case 'cursos-pagos':
        return <PaidCourses />;
      case 'sessoes':
        return <ClientSessions />;
      case 'ranking':
        return (
          <RealUserRanking 
            timeFilter={rankingTimeFilter}
            onTimeFilterChange={setRankingTimeFilter}
          />
        );
      case 'avaliacao-semanal':
        return <AvaliacaoSemanal />;
      case 'metas':
        return <MinhasMetas userType="cliente" />;
      case 'desafios':
        return <Desafios />;
      case 'diario':
        return <DiarioSaude />;
      case 'teste-sabotadores':
        return <TesteSabotadores />;
      case 'meu-progresso':
        return (
          <div className="space-y-8">
            <BeneficiosVisuais />
            <ProgressCharts />
          </div>
        );
      case 'analise-avancada':
        return <AdvancedHealthDashboard />;
      default:
        return <MissaoDia isVisitor={false} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-white/10">
        <UserProfileMenu />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col bg-white/5 backdrop-blur-sm border-r border-white/10">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-sm border-r border-white/10 z-50"
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Required Data Modal */}
      <RequiredDataModal />
    </div>
  );
};

export default Dashboard;