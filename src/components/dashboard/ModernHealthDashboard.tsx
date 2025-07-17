import React, { useState } from 'react';
import { Heart, Activity, TrendingUp, Footprints, Zap, Moon, Target, Plus, Trophy, Bell, User, Menu, X } from 'lucide-react';
import ColoredCard from '../ui/ColoredCard';
import { GoogleFitModal } from '../GoogleFitModal';

const ModernHealthDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const [showGoogleFitModal, setShowGoogleFitModal] = useState(false);

  const healthMetrics = [
    {
      id: 'steps',
      label: 'Passos',
      value: '8,547',
      goal: '10,000',
      percentage: 85,
      icon: Footprints,
      variant: 'steps' as const
    },
    {
      id: 'heart',
      label: 'Frequência Cardíaca',
      value: '72 bpm',
      goal: '60-100 bpm',
      percentage: 90,
      icon: Heart,
      variant: 'heart' as const
    },
    {
      id: 'calories',
      label: 'Calorias',
      value: '1,847',
      goal: '2,200',
      percentage: 84,
      icon: Zap,
      variant: 'calories' as const
    },
    {
      id: 'sleep',
      label: 'Sono',
      value: '7h 23m',
      goal: '8h',
      percentage: 92,
      icon: Moon,
      variant: 'sleep' as const
    },
    {
      id: 'active',
      label: 'Tempo Ativo',
      value: '45 min',
      goal: '60 min',
      percentage: 75,
      icon: Activity,
      variant: 'active' as const
    },
    {
      id: 'distance',
      label: 'Distância',
      value: '6.2 km',
      goal: '8 km',
      percentage: 78,
      icon: TrendingUp,
      variant: 'distance' as const
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'goals', label: 'Metas', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4" style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary)'
        }}>
          Jornada dos Sonhos
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out`}
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-primary)'
          }}
        >
          <div className="p-6">
            <h1 className="hidden lg:block" style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              marginBottom: '2rem'
            }}>
              Jornada dos Sonhos
            </h1>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: item.id === 'dashboard' ? 'var(--primary-light)' : 'transparent',
                    color: item.id === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Google Fit Connection Button */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <button
                onClick={() => setShowGoogleFitModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={20} />
                <span>Conectar Google Fit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                Sua Jornada de Saúde
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Acompanhe seu progresso e alcance seus objetivos
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {healthMetrics.map((metric) => (
                <ColoredCard
                  key={metric.id}
                  variant={metric.variant}
                  selected={selectedMetric === metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className="hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        backgroundColor: `var(--metric-${metric.variant})`,
                        color: 'white'
                      }}>
                        <metric.icon size={20} />
                      </div>
                      <span style={{ 
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>
                        {metric.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div style={{ 
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {metric.value}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Meta: {metric.goal}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: `${metric.percentage}%`,
                          height: '100%',
                          backgroundColor: `var(--metric-${metric.variant})`,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width var(--transition-normal)'
                        }}
                      />
                    </div>
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: `var(--metric-${metric.variant})`
                    }}>
                      {metric.percentage}% completo
                    </div>
                  </div>
                </ColoredCard>
              ))}
            </div>

            {/* Selected Metric Details */}
            {selectedMetric && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--border-primary)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem'
                }}>
                  Detalhes - {healthMetrics.find(m => m.id === selectedMetric)?.label}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Aqui você pode ver informações detalhadas sobre sua métrica selecionada.
                  Gráficos e análises mais profundas serão implementados aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google Fit Modal */}
      {showGoogleFitModal && (
        <GoogleFitModal
          isOpen={showGoogleFitModal}
          onClose={() => setShowGoogleFitModal(false)}
          onConnect={async (email: string) => {
            console.log('Conectando com email:', email);
            // Simulate connection process
            setTimeout(() => {
              setShowGoogleFitModal(false);
            }, 2000);
          }}
          isLoading={false}
          isConnected={false}
        />
      )}
    </div>
  );
};

export default ModernHealthDashboard;
