import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TesteSabotadores } from './TesteSabotadores';
import DiarioSaude from './DiarioSaude';
import MissaoDia from './MissaoDia';
import AvaliacaoSemanal from './AvaliacaoSemanal';
import Desafios from './Desafios';
import { PublicRanking } from './PublicRanking';
import MinhasMetas from './MinhasMetas';

import { BeneficiosVisuais } from './BeneficiosVisuais';
import NetflixCourseCarousel from './netflix/NetflixCourseCarousel';
import { MotivationalMessages } from './intelligent/MotivationalMessages';
import { SmartAnalytics } from './intelligent/SmartAnalytics';
import { EnhancedRanking } from './visual/EnhancedRanking';
import { AnimatedButton } from './visual/AnimatedButton';
import { BalancaPareamento } from './BalancaPareamento';
import { ClientSessions } from './sessions/ClientSessions';
import { AdminSessions } from './sessions/AdminSessions';
import { 
  Target, 
  Trophy, 
  BookOpen, 
  FileText, 
  Calendar, 
  Award, 
  GraduationCap, 
  BarChart3, 
  Home,
  Users,
  Heart,
  Play,
  ChevronRight,
  Video,
  UserCog,
  Scale
} from 'lucide-react';

// Dados mock para demonstração
const mockCourses = [
  {
    id: '1',
    title: 'Nutrição Intuitiva: Transforme sua Relação com a Comida',
    category: 'Nutrição',
    description: 'Aprenda a ouvir seu corpo e desenvolver uma relação saudável com a alimentação.',
    coverImage: '/api/placeholder/400/250',
    progress: 65,
    duration: '4h 30min',
    rating: 4.8,
    studentsCount: 1234,
    status: 'in-progress' as const,
    instructor: 'Dra. Maria Silva'
  },
  {
    id: '2',
    title: 'Mindfulness e Redução do Estresse',
    category: 'Mindfulness',
    description: 'Técnicas de mindfulness para reduzir ansiedade e melhorar qualidade de vida.',
    coverImage: '/api/placeholder/400/250',
    progress: 0,
    duration: '3h 15min',
    rating: 4.9,
    studentsCount: 856,
    status: 'not-started' as const,
    instructor: 'Dr. João Santos'
  },
  {
    id: '3',
    title: 'Exercícios Funcionais para Iniciantes',
    category: 'Atividade Física',
    description: 'Programa completo de exercícios funcionais adaptados para iniciantes.',
    coverImage: '/api/placeholder/400/250',
    progress: 100,
    duration: '5h 20min',
    rating: 4.7,
    studentsCount: 2156,
    status: 'completed' as const,
    instructor: 'Prof. Ana Costa'
  },
  {
    id: '4',
    title: 'Psicologia Positiva: Construindo Resiliência',
    category: 'Psicologia',
    description: 'Desenvolva habilidades emocionais e construa uma mentalidade resiliente.',
    coverImage: '/api/placeholder/400/250',
    progress: 25,
    duration: '6h 45min',
    rating: 4.9,
    studentsCount: 743,
    status: 'in-progress' as const,
    instructor: 'Dra. Carla Ferreira'
  }
];

const topRankingUsers = [
  {id: 1, name: "Ana Silva", points: 3200, position: 1, lastPosition: 2, streak: 25, completedChallenges: 28, cidade: "São Paulo", trend: 'up' as const, positionChange: 1},
  {id: 2, name: "Carlos Santos", points: 2800, position: 2, lastPosition: 1, streak: 20, completedChallenges: 22, cidade: "Rio de Janeiro", trend: 'down' as const, positionChange: 1},
  {id: 3, name: "Maria Costa", points: 2400, position: 3, lastPosition: 3, streak: 15, completedChallenges: 18, cidade: "Belo Horizonte", trend: 'stable' as const, positionChange: 0},
  {id: 4, name: "João Ferreira", points: 2100, position: 4, lastPosition: 5, streak: 12, completedChallenges: 15, cidade: "Porto Alegre", trend: 'up' as const, positionChange: 1},
  {id: 5, name: "Paula Oliveira", points: 1900, position: 5, lastPosition: 4, streak: 18, completedChallenges: 14, cidade: "Salvador", trend: 'down' as const, positionChange: 1},
  {id: 6, name: "Roberto Silva", points: 1750, position: 6, lastPosition: 8, streak: 10, completedChallenges: 12, cidade: "Brasília", trend: 'up' as const, positionChange: 2},
  {id: 7, name: "Fernanda Lima", points: 1600, position: 7, lastPosition: 6, streak: 22, completedChallenges: 16, cidade: "Curitiba", trend: 'down' as const, positionChange: 1},
];

export const MinhaJornada: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [userType, setUserType] = useState<'visitante' | 'cliente' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rankingTimeFilter, setRankingTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [userPoints, setUserPoints] = useState(0);
  const [userMood, setUserMood] = useState<'happy' | 'sad' | 'neutral' | 'motivated' | 'tired'>('neutral');
  const [currentStreak, setCurrentStreak] = useState(7);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePointsEarned = (points: number) => {
    const newTotal = userPoints + points;
    setUserPoints(newTotal);
    localStorage.setItem('userPoints', newTotal.toString());
  };

  const handleClienteAccess = () => {
    if (!user) {
      // Se não está logado, redirecionar para login
      navigate('/auth');
    } else {
      // Se está logado, permitir acesso
      setUserType('cliente');
    }
  };

  // Se ainda não escolheu o tipo de usuário
  if (!userType) {
    return (
      <div className="netflix-container min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-netflix-text mb-6">
            Instituto dos Sonhos
          </h1>
          <p className="text-xl text-netflix-text-muted mb-12">
            Sua jornada de transformação começa aqui. Escolha como deseja começar:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Área do Visitante */}
            <Card 
              className="bg-netflix-card border-netflix-border cursor-pointer hover:border-instituto-orange/50 transition-all duration-300 group"
              onClick={() => setUserType('visitante')}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-instituto-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-instituto-purple" />
                  </div>
                  <h3 className="text-2xl font-bold text-netflix-text mb-4">
                    Sou Visitante
                  </h3>
                  <p className="text-netflix-text-muted mb-6">
                    Explore conteúdos gratuitos, veja benefícios e participe do ranking público
                  </p>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-purple" />
                    <span>Acesso ao ranking público</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-purple" />
                    <span>Missões diárias gratuitas</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-purple" />
                    <span>Conteúdos de bem-estar</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-purple" />
                    <span>Testes e avaliações</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-instituto-purple hover:bg-instituto-purple-light text-white group-hover:scale-105 transition-transform">
                  Explorar como Visitante
                </Button>
              </CardContent>
            </Card>

            {/* Área do Cliente */}
            <Card 
              className="bg-netflix-card border-netflix-border cursor-pointer hover:border-instituto-orange/50 transition-all duration-300 group"
              onClick={handleClienteAccess}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-instituto-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-10 w-10 text-instituto-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-netflix-text mb-4">
                    Sou Cliente
                  </h3>
                  <p className="text-netflix-text-muted mb-6">
                    Acesso completo a todos os cursos, acompanhamento personalizado e ferramentas avançadas
                  </p>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-orange" />
                    <span>Biblioteca completa de cursos</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-orange" />
                    <span>Acompanhamento personalizado</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-orange" />
                    <span>Diário de saúde privado</span>
                  </div>
                  <div className="flex items-center gap-3 text-netflix-text-muted">
                    <ChevronRight className="h-4 w-4 text-instituto-orange" />
                    <span>Metas e progresso avançado</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 instituto-button group-hover:scale-105 transition-transform"
                >
                  Acessar Área do Cliente
                </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Botão Admin (dev only) */}
            <div className="mt-8 flex gap-4 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdmin(!isAdmin)}
                className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
              >
                {isAdmin ? 'Sair do Modo Admin' : 'Modo Admin (Dev)'}
              </Button>
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/admin'}
                  className="instituto-button animate-glow"
                >
                  Painel Admin Completo
                </Button>
              )}
            </div>
          
          <p className="text-netflix-text-muted mt-8">
            Você pode trocar de área a qualquer momento usando o menu superior
          </p>
        </div>
      </div>
    );
  }

  // Menu items baseado no tipo de usuário
  const getMenuItems = () => {
    const baseItems = [
      { id: 'inicio', label: 'Início', icon: Home },
      { id: 'ranking', label: 'Ranking Público', icon: Trophy },
      { id: 'beneficios', label: 'Benefícios Visuais', icon: Heart },
      { id: 'metas', label: 'Minhas Metas', icon: Target },
    ];

    if (userType === 'cliente') {
      const clientItems = [
        ...baseItems,
        { id: 'balanca-pareamento', label: '📡 Atualizar Medidas com Balança', icon: Scale },
        { id: 'sessoes', label: 'Minhas Sessões', icon: Video },
        { id: 'testes-sabotadores', label: 'Testes Sabotadores', icon: BookOpen },
        { id: 'biblioteca', label: 'Biblioteca de Cursos', icon: GraduationCap },
        { id: 'diario', label: 'Diário de Saúde', icon: FileText },
        { id: 'avaliacao-semanal', label: 'Desempenho Semanal', icon: Calendar },
        { id: 'desafios', label: 'Desafios', icon: Award },
        { id: 'progresso', label: 'Meu Progresso', icon: BarChart3 },
      ];
      
      if (isAdmin) {
        clientItems.push({ id: 'admin-sessoes', label: 'Gerenciar Sessões', icon: UserCog });
      }
      
      return clientItems;
    }

    return baseItems;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <MissaoDia isVisitor={userType === 'visitante'} />;
      case 'ranking':
        return (
          <div className="space-y-6">
            <EnhancedRanking 
              users={topRankingUsers}
              currentUser={topRankingUsers[0]}
              showPrizes={true}
            />
          </div>
        );
      case 'beneficios':
        return <BeneficiosVisuais />;
      case 'testes-sabotadores':
        return userType === 'cliente' ? <TesteSabotadores /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'biblioteca':
        return userType === 'cliente' ? (
          <div className="space-y-8">
            <NetflixCourseCarousel 
              title="Continue de onde parou"
              courses={mockCourses.filter(course => course.status === 'in-progress')}
            />
            <NetflixCourseCarousel 
              title="Recomendado para você"
              courses={mockCourses}
              showFilters={true}
            />
            <NetflixCourseCarousel 
              title="Em alta agora"
              courses={mockCourses.filter(course => course.studentsCount > 1000)}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'diario':
        return userType === 'cliente' ? <DiarioSaude /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'avaliacao-semanal':
        return userType === 'cliente' ? <AvaliacaoSemanal /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'desafios':
        return userType === 'cliente' ? <Desafios /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'progresso':
        return userType === 'cliente' ? (
          <div className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-netflix-text mb-4">Seu Progresso</h3>
                <p className="text-netflix-text-muted">
                  Acompanhe sua evolução e conquistas na jornada de transformação
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-instituto-orange/10 rounded-lg">
                    <Trophy className="h-8 w-8 text-instituto-orange mx-auto mb-2" />
                    <p className="text-lg font-bold text-netflix-text">{userPoints}</p>
                    <p className="text-sm text-netflix-text-muted">Pontos Totais</p>
                  </div>
                  <div className="p-4 bg-instituto-green/10 rounded-lg">
                    <Award className="h-8 w-8 text-instituto-green mx-auto mb-2" />
                    <p className="text-lg font-bold text-netflix-text">5</p>
                    <p className="text-sm text-netflix-text-muted">Conquistas</p>
                  </div>
                  <div className="p-4 bg-instituto-purple/10 rounded-lg">
                    <Target className="h-8 w-8 text-instituto-purple mx-auto mb-2" />
                    <p className="text-lg font-bold text-netflix-text">3</p>
                    <p className="text-sm text-netflix-text-muted">Metas Ativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'sessoes':
        return userType === 'cliente' ? <ClientSessions /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'admin-sessoes':
        return isAdmin ? <AdminSessions /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Administrativa</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para administradores</p>
          </div>
        );
      case 'balanca-pareamento':
        return userType === 'cliente' ? <BalancaPareamento /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">Área Restrita</h2>
            <p className="text-netflix-text-muted mb-6">Esta seção é exclusiva para clientes</p>
            <Button onClick={handleClienteAccess} className="instituto-button">
              Acessar como Cliente
            </Button>
          </div>
        );
      case 'metas':
        return <MinhasMetas userType={userType} />;
      default:
        return (
          <div className="space-y-8">
            {/* Mensagens Motivacionais */}
            <MotivationalMessages 
              userMood={userMood}
              currentStreak={currentStreak}
              recentProgress={userPoints > 0}
            />
            
            {/* Benefícios Visuais */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-instituto-orange/20 to-instituto-orange-light/30 border-instituto-orange/30 cursor-pointer hover:border-instituto-orange/60 hover:scale-105 transition-all duration-300 floating-card" onClick={() => setActiveSection('beneficios')}>
                <CardContent className="p-6 text-center">
                  <div className="pulse-glow">
                    <Heart className="h-12 w-12 text-instituto-orange mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Benefícios Comprovados</h3>
                  <p className="text-muted-foreground mb-4">Veja os resultados científicos da sua transformação</p>
                  <AnimatedButton variant="goal" size="sm">Ver Benefícios</AnimatedButton>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-instituto-purple/20 to-instituto-lilac/30 border-instituto-purple/30 cursor-pointer hover:border-instituto-purple/60 hover:scale-105 transition-all duration-300 floating-card" onClick={() => setActiveSection('ranking')}>
                <CardContent className="p-6 text-center">
                  <div className="pulse-glow">
                    <Trophy className="h-12 w-12 text-instituto-purple mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Ranking Global</h3>
                  <p className="text-muted-foreground mb-4">Compete com pessoas do mundo todo e ganhe prêmios</p>
                  <AnimatedButton variant="challenge" size="sm">Ver Ranking</AnimatedButton>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-instituto-green/20 to-instituto-green-light/30 border-instituto-green/30 cursor-pointer hover:border-instituto-green/60 hover:scale-105 transition-all duration-300 floating-card" onClick={() => setActiveSection('metas')}>
                <CardContent className="p-6 text-center">
                  <div className="pulse-glow">
                    <Target className="h-12 w-12 text-instituto-green mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Minhas Metas</h3>
                  <p className="text-muted-foreground mb-4">Defina objetivos e acompanhe seu progresso</p>
                  <AnimatedButton variant="success" size="sm">Ver Metas</AnimatedButton>
                </CardContent>
              </Card>
            </div>

            {/* Ranking Público Resumido com melhorias visuais */}
            <EnhancedRanking 
              users={topRankingUsers}
              currentUser={topRankingUsers[0]}
              showPrizes={false}
            />

            {/* Conteúdo baseado no tipo de usuário */}
            {userType === 'cliente' && (
              <NetflixCourseCarousel 
                title="Continue de onde parou"
                courses={mockCourses.filter(course => course.status === 'in-progress')}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="netflix-container">
      <header className="bg-netflix-dark border-b border-netflix-border shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-netflix-text">Instituto dos Sonhos</h1>
            
            <div className="flex items-center gap-4">
              <Badge className={`${userType === 'cliente' ? 'bg-instituto-orange/20 text-instituto-orange' : 'bg-instituto-purple/20 text-instituto-purple'}`}>
                {userType === 'cliente' ? 'Cliente' : 'Visitante'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setUserType(userType === 'cliente' ? 'visitante' : 'cliente')}
                className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
              >
                Trocar para {userType === 'cliente' ? 'Visitante' : 'Cliente'}
              </Button>
            </div>
          </div>
          
          <nav className="flex gap-2 overflow-x-auto">
            {getMenuItems().map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeSection === item.id 
                    ? 'instituto-button' 
                    : 'text-netflix-text-muted hover:text-netflix-text hover:bg-netflix-hover'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
};