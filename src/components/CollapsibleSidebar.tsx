import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  GraduationCap, 
  Trophy, 
  Calendar, 
  Target, 
  Award, 
  FileText, 
  Settings, 
  BarChart3, 
  Scale, 
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfileMenu } from '@/components/UserProfileMenu';
import { Link } from 'react-router-dom';

interface CollapsibleSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeSection,
  onSectionChange,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'biblioteca-cursos', label: 'Biblioteca de Cursos', icon: GraduationCap },
    { id: 'cursos-pagos', label: 'Cursos Pagos', icon: GraduationCap },
    { id: 'sessoes', label: 'Sessões', icon: FileText },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'avaliacao-semanal', label: 'Avaliação Semanal', icon: Calendar },
    { id: 'metas', label: 'Minhas Metas', icon: Target },
    { id: 'desafios', label: 'Desafios', icon: Award },
    { id: 'dados-fisicos', label: 'Dados Físicos', icon: Scale },
    { id: 'meu-progresso', label: 'Meu Progresso', icon: BarChart3 },
    { id: 'analise-avancada', label: 'Análise Avançada', icon: BarChart3 },
    { id: 'diario', label: 'Diário de Saúde', icon: FileText },
    { id: 'teste-sabotadores', label: 'Teste de Sabotadores', icon: Target },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  // Toggle button for mobile
  const MobileToggle = () => (
    <Button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      variant="ghost"
      size="sm"
      className="lg:hidden fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
    >
      {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.div
      animate={{ 
        width: isCollapsed ? '80px' : '320px' 
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`hidden lg:flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 relative ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/src/assets/butterfly-logo.png" 
                  alt="Instituto dos Sonhos" 
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-lg">
                  Instituto dos Sonhos
                </span>
              </Link>
            </motion.div>
          )}
          
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 p-2"
          >
            {isCollapsed ? 
              <ChevronRight className="w-4 h-4" /> : 
              <ChevronLeft className="w-4 h-4" />
            }
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-b border-gray-700"
        >
          <UserProfileMenu />
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 relative group ${
                  isActive 
                    ? 'bg-instituto-orange text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-1 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Badge variant="outline" className="text-xs text-gray-400">
              v2.0.0
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <img 
                    src="/src/assets/butterfly-logo.png" 
                    alt="Instituto dos Sonhos" 
                    className="w-8 h-8"
                  />
                  <span className="text-white font-bold text-lg">
                    Instituto dos Sonhos
                  </span>
                </Link>
                
                <Button
                  onClick={() => setIsMobileOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700">
              <UserProfileMenu />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsMobileOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-instituto-orange text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileTab"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 text-center">
              <Badge variant="outline" className="text-xs text-gray-400">
                Instituto dos Sonhos v2.0.0
              </Badge>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileToggle />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};
