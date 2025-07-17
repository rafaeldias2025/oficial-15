import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Users, 
  Target, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Salad, 
  Dumbbell, 
  HeartHandshake, 
  Crown, 
  User, 
  Trophy,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Play,
  CheckCircle,
  Scale,
  LineChart,
  Flame,
  Medal,
  BarChart3,
  Waves,
  Sunrise,
  Moon,
  Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import butterflyHero from '@/assets/butterfly-hero.png';
import butterflyLogo from '@/assets/butterfly-logo.png';
import mirrorReflection from '@/assets/mirror-reflection.png';
import pilatesEquipment from '@/assets/pilates-equipment.png';
import groupSilhouette from '@/assets/group-silhouette.png';

// Estatísticas de impacto do Instituto
const ImpactStats = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
  >
    {[
      { icon: Users, value: '5.000+', label: 'Vidas Transformadas', color: 'text-brand-600' },
      { icon: Trophy, value: '98%', label: 'Taxa de Sucesso', color: 'text-wellness-600' },
      { icon: Crown, value: '15+', label: 'Anos de Experiência', color: 'text-mindful-600' },
      { icon: Heart, value: '24/7', label: 'Suporte Dedicado', color: 'text-ocean-600' }
    ].map((stat, index) => (
      <Card key={index} className="glass-effect card-hover p-6 text-center border-0 shadow-lg">
        <div className="flex flex-col items-center space-y-3">
          <div className={`p-3 rounded-full bg-gradient-to-r from-background to-muted ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
          </div>
        </div>
      </Card>
    ))}
  </motion.div>
);

// Componente de funcionalidades destacadas
const FeatureCard = ({ icon: Icon, title, description, color, delay }: {
  icon: any,
  title: string,
  description: string,
  color: string,
  delay: number
}) => (
  <motion.div
    className="glass-effect card-hover p-6 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className={`p-3 w-fit rounded-lg ${color} mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

// Componente de ranking dinâmico
const LiveRanking = () => {
  const [topUsers] = useState([
    { name: "Ana Silva", points: 3420, level: "Mestre", avatar: "🌟" },
    { name: "Carlos Mendes", points: 2980, level: "Avançado", avatar: "🔥" },
    { name: "Maria Santos", points: 2750, level: "Avançado", avatar: "💎" },
  ]);

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-netflix-text">🏆 Top Ranking</h3>
        <Link to="/ranking">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver Mais <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.name}
            className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm">{user.avatar}</span>
              </div>
              <div>
                <p className="font-medium text-netflix-text">{user.name}</p>
                <p className="text-xs text-netflix-text-muted">{user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{user.points}</p>
              <p className="text-xs text-netflix-text-muted">pontos</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Componente de benefícios visuais
const VisualBenefits = () => {
  const benefits = [
    { 
      icon: BarChart3, 
      title: "Acompanhamento Inteligente", 
      description: "Gráficos e análises detalhadas do seu progresso",
      color: "gradient-brand"
    },
    { 
      icon: Scale, 
      title: "Balança Inteligente", 
      description: "Sincronização automática com balanças Bluetooth",
      color: "gradient-wellness"
    },
    { 
      icon: Flame, 
      title: "Gamificação", 
      description: "Sistema de pontos, níveis e conquistas motivadores",
      color: "gradient-mindful"
    },
    { 
      icon: Heart, 
      title: "Saúde Integral", 
      description: "Monitoramento completo de métricas de saúde",
      color: "gradient-ocean"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((benefit, index) => (
        <FeatureCard
          key={benefit.title}
          icon={benefit.icon}
          title={benefit.title}
          description={benefit.description}
          color={benefit.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

// Componente principal da HomePage
const HomePage = () => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-mindful-50 pointer-events-none" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-mindful-100/50 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">Instituto dos Sonhos</span>
            </motion.div>
            
            <motion.nav 
              className="flex gap-6 items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to="/ranking">
                <Button variant="ghost" className="text-netflix-text hover:text-primary">
                  <Trophy className="mr-2 h-4 w-4" />
                  Ranking
                </Button>
              </Link>
              {user && ['admin@instituto.com', 'admin@sonhos.com', 'rafael@admin.com'].includes(user.email || '') && (
                <Link to="/admin?tab=usuarios">
                  <Button variant="ghost" className="text-amber-600 hover:text-amber-500 hover:bg-amber-50 animate-pulse">
                    <Shield className="mr-2 h-4 w-4" />
                    Gerenciar Usuários
                  </Button>
                </Link>
              )}
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <Target className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Badge className="bg-sunset-500/20 text-sunset-400 border-sunset-500/30 animate-pulse">
                    🔥 ÚLTIMAS 24H: 89 novas transformações
                  </Badge>
                  <Badge className="bg-wellness-500/20 text-wellness-400 border-wellness-500/30">
                    ⭐ 4.9/5 • +5.000 vidas transformadas
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="text-energy-400">Jornada Radical.</span><br />
                  <span className="bg-gradient-to-r from-brand-500 to-mindful-500 bg-clip-text text-transparent">
                    Transforme sua vida
                  </span><br />
                  <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground">em apenas 30 dias</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <strong className="text-foreground">Método exclusivo</strong> usado por mais de 5.000 pessoas que já 
                  perderam peso, ganharam energia e descobriram uma versão completamente nova de si mesmas.
                </motion.p>

                <motion.div 
                  className="bg-gradient-to-r from-ocean-500/10 to-mindful-500/10 border border-ocean-500/20 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-5 h-5 text-energy-400" />
                    <span className="text-lg font-semibold text-foreground">ACESSO PREMIUM GRATUITO</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ 7 dias de acesso completo GRÁTIS</li>
                    <li>✅ Sistema de missões personalizado</li>
                    <li>✅ Acompanhamento 24/7 com IA</li>
                    <li>✅ Resultados visíveis em 72 horas</li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link to={user ? "/dashboard" : "/auth"} className="flex-1 sm:flex-none">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gradient-wellness hover:scale-105 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {user ? "ACESSAR DASHBOARD" : "🚀 COMEÇAR TRANSFORMAÇÃO GRÁTIS"}
                    <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </Button>
                </Link>
                
                <Link to="/ranking" className="flex-1 sm:flex-none">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-2 border-energy-400 text-energy-400 hover:bg-energy-400/10 px-8 py-6 text-lg font-semibold"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Ver Ranking de Sucessos
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-wellness-400 mr-1" />
                    <span className="text-wellness-400 font-semibold">100% GRATUITO</span> por 7 dias
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-ocean-400 mr-1" />
                    <span className="text-ocean-400 font-semibold">MÉTODO CIENTÍFICO</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <Flame className="w-3 h-3" />
                  <span className="font-semibold">ATENÇÃO:</span> Apenas 50 vagas disponíveis este mês • 
                  <span className="animate-pulse">23 restantes</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative z-10">
                <img 
                  src={butterflyHero} 
                  alt="Transformação" 
                  className="w-full max-w-lg mx-auto animate-float" 
                />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 glass-card p-4 bg-health-success/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckCircle className="w-6 h-6 text-health-success" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 glass-card p-4 bg-health-warning/20"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Zap className="w-6 h-6 text-health-warning" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-netflix-card/30 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Números que Inspiram
            </h2>
            <p className="text-netflix-text-muted max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram suas vidas
            </p>
          </motion.div>
          
          <ImpactStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ferramentas Poderosas para Sua Transformação
            </h2>
            <p className="text-xl text-netflix-text-muted max-w-3xl mx-auto">
              Descubra como nossa plataforma pode acelerar sua jornada de bem-estar
            </p>
          </motion.div>
          
          <VisualBenefits />
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-netflix-card/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Programas de Transformação
            </h2>
            <p className="text-xl text-netflix-text-muted max-w-3xl mx-auto">
              Caminhos estruturados para sua evolução pessoal
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Processo de Recomeço */}
            <motion.div
              className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={mirrorReflection} 
                  alt="Processo de Recomeço" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
                  <Sunrise className="w-5 h-5 text-primary mr-2" />
                  PROCESSO DE RECOMEÇO
                </h3>
                <p className="text-netflix-text-muted mb-4 leading-relaxed">
                  Programa transformador para ressignificar sua vida, 
                  deixando para trás padrões limitantes e abraçando novas possibilidades.
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Começar Jornada
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Terapia e Autoconhecimento */}
            <motion.div
              className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={groupSilhouette} 
                  alt="Terapia e Autoconhecimento" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
                  <Brain className="w-5 h-5 text-health-purple mr-2" />
                  TERAPIA E AUTOCONHECIMENTO
                </h3>
                <p className="text-netflix-text-muted mb-4 leading-relaxed">
                  Sessões personalizadas que promovem o autoconhecimento profundo, 
                  trabalhando crenças limitantes e desenvolvendo sua melhor versão.
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-health-purple hover:bg-health-purple/90 text-white">
                    Explorar Sessões
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Atividade Física */}
            <motion.div
              className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={pilatesEquipment} 
                  alt="Atividade Física" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
                  <Activity className="w-5 h-5 text-health-success mr-2" />
                  ATIVIDADE FÍSICA E BEM-ESTAR
                </h3>
                <p className="text-netflix-text-muted mb-4 leading-relaxed">
                  Programas de exercícios personalizados que fortalecem não apenas o corpo, 
                  mas também a mente e o espírito.
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-health-success hover:bg-health-success/90 text-white">
                    Participar
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Comunidade que Motiva
              </h2>
              <p className="text-xl text-netflix-text-muted mb-8 leading-relaxed">
                Conecte-se com pessoas que compartilham os mesmos objetivos. 
                Participe de desafios, compartilhe conquistas e cresça junto com nossa comunidade.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-health-success/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-health-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Ranking Global</h4>
                    <p className="text-netflix-text-muted">Compita de forma saudável com outros usuários</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-health-warning/20 rounded-full flex items-center justify-center">
                    <Medal className="w-5 h-5 text-health-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Conquistas</h4>
                    <p className="text-netflix-text-muted">Desbloqueie badges e celebre suas vitórias</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-health-info/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-health-info" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Apoio Mútuo</h4>
                    <p className="text-netflix-text-muted">Suporte da comunidade em sua jornada</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LiveRanking />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-health-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para Transformar sua Vida?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Junte-se a milhares de pessoas que já descobriram o poder da transformação. 
              Sua jornada começa com um simples clique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Crown className="mr-2 h-6 w-6" />
                  ENTRAR NO INSTITUTO
                </Button>
              </Link>
              
              <Link to="/ranking">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 px-12 py-6 text-xl font-bold"
                >
                  <Trophy className="mr-2 h-6 w-6" />
                  VER RANKING
                </Button>
              </Link>
              
              {user && ['admin@instituto.com', 'admin@sonhos.com', 'rafael@admin.com'].includes(user.email || '') && (
                <Link to="/admin?tab=usuarios">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-amber-400 text-amber-400 hover:bg-amber-400/20 px-12 py-6 text-xl font-bold backdrop-blur-sm animate-pulse"
                  >
                    <Shield className="mr-2 h-6 w-6" />
                    GERENCIAR USUÁRIOS
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Star className="w-10 h-10 text-white" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-netflix-card border-t border-netflix-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center gap-3 mb-4 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-8 h-8" />
              <span className="text-xl font-semibold text-foreground">Instituto dos Sonhos</span>
            </motion.div>
            
            <motion.div 
              className="text-netflix-text-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              © 2024 Instituto dos Sonhos. Todos os direitos reservados.
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;