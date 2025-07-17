import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight, Heart, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import { cn } from '@/lib/utils';

interface HealthLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHealthStats?: boolean;
  enableQuickAccess?: boolean;
}

export function HealthLayout({ 
  children, 
  className,
  showHealthStats = true,
  enableQuickAccess = true
}: HealthLayoutProps) {
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock health data - em produção, isso viria do contexto do usuário
  const healthStats = {
    metabolicAge: 28,
    realAge: 32,
    vitalityScore: 85,
    dailyGoals: 3,
    completedGoals: 2,
    weeklyProgress: 72
  };

  const quickStats = [
    {
      icon: Heart,
      label: 'Idade Metabólica',
      value: `${healthStats.metabolicAge} anos`,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      trend: healthStats.metabolicAge < healthStats.realAge ? 'up' : 'down'
    },
    {
      icon: Zap,
      label: 'Vitalidade',
      value: `${healthStats.vitalityScore}%`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      trend: healthStats.vitalityScore > 80 ? 'up' : 'down'
    },
    {
      icon: Target,
      label: 'Metas Diárias',
      value: `${healthStats.completedGoals}/${healthStats.dailyGoals}`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: healthStats.completedGoals >= healthStats.dailyGoals ? 'up' : 'down'
    }
  ];

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-50 to-slate-100', className)}>
      {/* Health Dashboard Modal */}
      <AnimatePresence>
        {showHealthDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHealthDashboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-7xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <HealthDashboard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Health Panel */}
      {enableQuickAccess && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: isCollapsed ? 240 : 0 }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="health-card bg-white/95 backdrop-blur-lg rounded-l-2xl shadow-2xl border border-white/20">
            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "absolute -left-10 top-1/2 -translate-y-1/2",
                "w-10 h-16 rounded-l-xl bg-white/95 border border-r-0 border-white/20",
                "hover:bg-orange-50 transition-colors"
              )}
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>

            <div className={cn("p-4 w-72 transition-all duration-300", isCollapsed && "opacity-0 pointer-events-none")}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-800">Health Center</h3>
                </div>
                <Badge className="metabolic-age-badge">
                  {healthStats.metabolicAge} anos
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-4">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      stat.trend === 'up' ? 'bg-green-400' : 'bg-yellow-400'
                    )} />
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso Semanal</span>
                  <span>{healthStats.weeklyProgress}%</span>
                </div>
                <div className="health-progress h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${healthStats.weeklyProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => setShowHealthDashboard(true)}
                className="w-full health-glow bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
              >
                <Activity className="w-4 h-4 mr-2" />
                Abrir Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Health Stats Bar */}
      {showHealthStats && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-3"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">
                  Idade Metabólica: <strong className="text-red-600">{healthStats.metabolicAge} anos</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">
                  Vitalidade: <strong className="text-orange-600">{healthStats.vitalityScore}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Metas: <strong className="text-blue-600">{healthStats.completedGoals}/{healthStats.dailyGoals}</strong>
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHealthDashboard(true)}
              className="nav-btn-top"
            >
              <Activity className="w-4 h-4 mr-2" />
              Health Dashboard
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
