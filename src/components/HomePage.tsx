import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Users, Target, Heart, Sparkles, ArrowRight, Brain, Salad, Dumbbell, HeartHandshake, Goal, Instagram, Facebook, Youtube, Eye, Crown, User, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/netflix/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import butterflyHero from '@/assets/butterfly-hero.png';
import butterflyLogo from '@/assets/butterfly-logo.png';
import mirrorReflection from '@/assets/mirror-reflection.png';
import pilatesEquipment from '@/assets/pilates-equipment.png';
import groupSilhouette from '@/assets/group-silhouette.png';
const IconCard = ({
  icon: Icon,
  title
}: {
  icon: any;
  title: string;
}) => <div className="text-center">
    <Icon className="mx-auto h-10 w-10 text-white mb-4" />
    <h3 className="font-bold text-white uppercase tracking-wider">{title}</h3>
  </div>;
const HomePage = () => {
  const { user } = useAuth();
  
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-8 h-8" />
            <span className="text-xl font-bold text-instituto-dark">Instituto dos Sonhos</span>
          </div>
            <nav className="flex gap-4 items-center">
              <ThemeToggle />
              <Button variant="ghost" className="text-instituto-dark">Home</Button>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="default" className="bg-instituto-orange hover:bg-instituto-orange-hover">
                    <Target className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="default" className="bg-instituto-orange hover:bg-instituto-orange-hover">
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-instituto-warm/30 to-instituto-cream/50"></div>
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-instituto-dark leading-tight">
                  INSTITUTO DOS SONHOS
                </h1>
                <p className="text-lg text-instituto-dark/80 leading-relaxed">
                  Transforme sua vida através da nossa metodologia exclusiva de desenvolvimento pessoal e bem-estar integral.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={user ? "/dashboard" : "/auth"}>
                  <Button size="lg" className="bg-instituto-orange hover:bg-instituto-orange-hover text-white px-8 py-4 text-lg font-semibold shadow-warm">
                    <Crown className="mr-2 h-5 w-5" />
                    {user ? "ACESSAR DASHBOARD" : "ÁREA DO CLIENTE"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-instituto-gold/20 to-transparent rounded-full blur-3xl"></div>
              <img src={butterflyHero} alt="Transformação" className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Dark Quote Section */}
      <section className="bg-instituto-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <blockquote className="text-3xl lg:text-4xl font-light text-white leading-relaxed max-w-4xl mx-auto">
            "TUDO COMEÇA COM UMA ESCOLHA"
          </blockquote>
          <p className="text-instituto-light/80 mt-6 text-lg max-w-2xl mx-auto">
            O primeiro passo para a transformação é decidir que você merece viver a vida dos seus sonhos. 
            Nós estamos aqui para guiá-lo nessa jornada única de autodescoberta e crescimento.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-instituto-gold/10 rounded-full blur-xl"></div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-instituto-light/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-instituto-dark mb-4">
              PROGRAMAS DE TRANSFORMAÇÃO
            </h2>
            <p className="text-lg text-instituto-dark/70 max-w-2xl mx-auto">
              Nossos programas são cuidadosamente desenvolvidos para atender às suas necessidades específicas de crescimento.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Processo de Recomeço */}
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={mirrorReflection} alt="Processo de Recomeço" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-instituto-dark mb-3">
                  PROCESSO DE RECOMEÇO
                </h3>
                <p className="text-instituto-dark/70 mb-4 leading-relaxed">
                  Um programa transformador que te ajuda a ressignificar sua vida, 
                  deixando para trás padrões limitantes e abraçando novas possibilidades.
                </p>
                <div className="flex gap-2">
                  <Link to="/auth" className="flex-1">
                    <Button className="w-full bg-instituto-orange hover:bg-instituto-orange-hover">
                      COMEÇAR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Terapia e Autoconhecimento */}
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={groupSilhouette} alt="Terapia e Autoconhecimento" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-instituto-dark mb-3">
                  TERAPIA E AUTOCONHECIMENTO
                </h3>
                <p className="text-instituto-dark/70 mb-4 leading-relaxed">
                  Sessões personalizadas que promovem o autoconhecimento profundo, 
                  trabalhando crenças limitantes e desenvolvendo sua melhor versão.
                </p>
                <div className="flex gap-2">
                  <Link to="/auth" className="flex-1">
                    <Button className="w-full bg-instituto-orange hover:bg-instituto-orange-hover">
                      COMEÇAR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Atividade Física */}
            <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={pilatesEquipment} alt="Atividade Física" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-instituto-dark mb-3">
                  ATIVIDADE FÍSICA E BEM-ESTAR
                </h3>
                <p className="text-instituto-dark/70 mb-4 leading-relaxed">
                  Programas de exercícios personalizados que fortalecem não apenas o corpo, 
                  mas também a mente e o espírito.
                </p>
                <div className="flex gap-2">
                  <Link to="/auth" className="flex-1">
                    <Button className="w-full bg-instituto-orange hover:bg-instituto-orange-hover">
                      PARTICIPAR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-instituto-orange">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              TUDO O QUE VOCÊ PRECISA EM UM SÓ LUGAR
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Uma metodologia completa que integra desenvolvimento pessoal, bem-estar físico e mental
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/90">Vidas Transformadas</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">4.9</div>
                <div className="text-white/90">Avaliação Média</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-white/90">Taxa de Sucesso</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-white/90">Satisfação</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="outline" className="bg-white text-instituto-orange border-white hover:bg-instituto-light px-8 py-4 text-lg font-semibold">
                  COMECE SUA TRANSFORMAÇÃO
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-instituto-light/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl lg:text-3xl font-light text-instituto-dark leading-relaxed mb-8">
              "O Instituto dos Sonhos mudou completamente minha perspectiva sobre mim mesma. 
              Descobri forças que não sabia que tinha e aprendi a amar cada etapa da minha jornada."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-instituto-gold rounded-full flex items-center justify-center">
                <span className="text-white font-bold">MC</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-instituto-dark">Maria Clara</div>
                <div className="text-instituto-dark/70">Empresária, 34 anos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-instituto-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            QUER ENTRAR? VOCÊ É TRANSFORMAÇÃO POR COMPLETO
          </h2>
          <p className="text-xl text-instituto-light/90 mb-8 max-w-2xl mx-auto">
            Dê o primeiro passo rumo à vida que você sempre sonhou. 
            Sua jornada de transformação começa agora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-instituto-orange hover:bg-instituto-orange-hover text-white px-12 py-4 text-xl font-bold shadow-warm">
                <Crown className="mr-2 h-5 w-5" />
                ENTRAR NO INSTITUTO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-instituto-dark border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-6 h-6" />
              <span className="text-instituto-light font-semibold">Instituto dos Sonhos</span>
            </div>
            <div className="text-instituto-light/70 text-sm">
              © 2024 Instituto dos Sonhos. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default HomePage;