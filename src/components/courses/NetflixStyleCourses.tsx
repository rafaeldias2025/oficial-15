import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users, Star, ChevronLeft, ChevronRight, Heart, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { CoursePlayer } from './CoursePlayer';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import { HealthLayout } from '@/components/layout/HealthLayout';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  instructor?: string;
  duration?: string;
  rating?: number;
  students?: number;
}

// Dados mock expandidos baseados na imagem
const mockCoursesData: Course[] = [
  // INTELIGÊNCIA EMOCIONAL
  {
    id: 'ie1',
    title: 'LT1: EMOCIONAL',
    description: 'Fundamentos da inteligência emocional para transformação pessoal',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 197.00,
    instructor: 'Dr. Carlos Silva',
    duration: '4h 30min',
    rating: 4.9,
    students: 1240
  },
  {
    id: 'ie2',
    title: 'LT2: AUTOCONHECIMENTO',
    description: 'Desenvolva autoconhecimento profundo e transforme sua vida',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 167.00,
    instructor: 'Dra. Ana Santos',
    duration: '3h 15min',
    rating: 4.8,
    students: 956
  },
  {
    id: 'ie3',
    title: 'LT3: RESILIÊNCIA',
    description: 'Construa resiliência emocional e supere desafios',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 127.00,
    instructor: 'Prof. João Costa',
    duration: '2h 45min',
    rating: 4.7,
    students: 743
  },
  {
    id: 'ie4',
    title: 'REFORMA MENTAL',
    description: 'Reestruture seus padrões mentais para o sucesso',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 197.00,
    instructor: 'Dr. Pedro Oliveira',
    duration: '5h 20min',
    rating: 4.9,
    students: 1560
  },
  {
    id: 'ie5',
    title: 'HERO TRAINING',
    description: 'Treinamento intensivo para desenvolver seu herói interior',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 297.00,
    instructor: 'Master Coach Alex',
    duration: '8h 45min',
    rating: 5.0,
    students: 2340
  },
  {
    id: 'ie6',
    title: 'BUSINESS TRAINING',
    description: 'Desenvolva inteligência emocional para negócios',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 397.00,
    instructor: 'CEO Maria Lima',
    duration: '12h 30min',
    rating: 4.8,
    students: 890
  },
  {
    id: 'ie7',
    title: 'ORATÓRIA AVANÇADA',
    description: 'Domine a arte da comunicação e oratória',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'INTELIGÊNCIA EMOCIONAL',
    price: 267.00,
    instructor: 'Prof. Roberto Silva',
    duration: '6h 15min',
    rating: 4.7,
    students: 1120
  },

  // MASTERCLASSES
  {
    id: 'mc1',
    title: 'MINDFULNESS ESSENCIAL',
    description: 'Práticas essenciais de mindfulness para o dia a dia',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MASTERCLASSES',
    price: 147.00,
    instructor: 'Mestre Zen Silva',
    duration: '4h 00min',
    rating: 4.9,
    students: 1780
  },
  {
    id: 'mc2',
    title: 'PSICOLOGIA COMPORTAMENTAL',
    description: 'Entenda os padrões de comportamento humano',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MASTERCLASSES',
    price: 197.00,
    instructor: 'Dr. Felipe Torres',
    duration: '5h 30min',
    rating: 4.8,
    students: 920
  },
  {
    id: 'mc3',
    title: 'NEUROCIÊNCIA APLICADA',
    description: 'Aplicações práticas da neurociência no desenvolvimento pessoal',
    image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MASTERCLASSES',
    price: 297.00,
    instructor: 'Dra. Neuza Campos',
    duration: '7h 15min',
    rating: 4.9,
    students: 650
  },
  {
    id: 'mc4',
    title: 'LIDERANÇA COMPORTAMENTAL',
    description: 'Desenvolva habilidades de liderança baseadas em comportamento',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MASTERCLASSES',
    price: 347.00,
    instructor: 'CEO Sandra Costa',
    duration: '9h 45min',
    rating: 4.7,
    students: 1340
  },

  // MARKETING DIGITAL
  {
    id: 'md1',
    title: 'MERCADO DIGITAL',
    description: 'Domine as estratégias do mercado digital atual',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 297.00,
    instructor: 'Guru Digital Tom',
    duration: '8h 30min',
    rating: 4.8,
    students: 2140
  },
  {
    id: 'md2',
    title: 'CAPTAÇÃO AVANÇADA',
    description: 'Técnicas avançadas de captação de leads e clientes',
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 247.00,
    instructor: 'Expert Julia Ramos',
    duration: '6h 20min',
    rating: 4.9,
    students: 1567
  },
  {
    id: 'md3',
    title: 'TRÁFEGO META',
    description: 'Domine o tráfego pago no Facebook e Instagram',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 197.00,
    instructor: 'Specialist Mark Johnson',
    duration: '4h 45min',
    rating: 4.7,
    students: 1890
  },
  {
    id: 'md4',
    title: 'TELEGRAM MARKETING',
    description: 'Estratégias de marketing no Telegram para resultados',
    image_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 147.00,
    instructor: 'Expert Telegram Ana',
    duration: '3h 30min',
    rating: 4.6,
    students: 1230
  },
  {
    id: 'md5',
    title: 'GOOGLE ADS MASTERY',
    description: 'Domine completamente o Google Ads',
    image_url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 347.00,
    instructor: 'Google Expert Carlos',
    duration: '10h 15min',
    rating: 4.8,
    students: 980
  },
  {
    id: 'md6',
    title: 'LANÇAMENTO ÉPICO',
    description: 'Fórmula completa para lançamentos de sucesso',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MARKETING DIGITAL',
    price: 497.00,
    instructor: 'Launch Master Pedro',
    duration: '15h 45min',
    rating: 5.0,
    students: 750
  },

  // BIBLIOTECA LUCRATIVA
  {
    id: 'bl1',
    title: 'FILMSHOT',
    description: 'Produção cinematográfica para empreendedores',
    image_url: 'https://images.unsplash.com/photo-1489599511946-221c679c3719?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'BIBLIOTECA LUCRATIVA',
    price: 197.00,
    instructor: 'Diretor Alex Movie',
    duration: '6h 30min',
    rating: 4.7,
    students: 890
  },
  {
    id: 'bl2',
    title: 'ROTEIRO MASTER',
    description: 'Criação de roteiros profissionais e impactantes',
    image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'BIBLIOTECA LUCRATIVA',
    price: 167.00,
    instructor: 'Roteirista Maria Luz',
    duration: '4h 15min',
    rating: 4.8,
    students: 1120
  },
  {
    id: 'bl3',
    title: 'IMERSÃO CRIATIVA',
    description: 'Desenvolva sua criatividade para negócios',
    image_url: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'BIBLIOTECA LUCRATIVA',
    price: 297.00,
    instructor: 'Creative Master João',
    duration: '8h 20min',
    rating: 4.9,
    students: 670
  },

  // CRIAÇÃO E ESTRATÉGIAS
  {
    id: 'ce1',
    title: 'TRAINER INTRO',
    description: 'Introdução ao mundo dos treinamentos profissionais',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CRIAÇÃO E ESTRATÉGIAS',
    price: 97.00,
    instructor: 'Trainer Pro Silva',
    duration: '2h 30min',
    rating: 4.6,
    students: 1450
  },
  {
    id: 'ce2',
    title: 'PALESTRANTE ESPECIALISTA',
    description: 'Torne-se um palestrante de alto impacto',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CRIAÇÃO E ESTRATÉGIAS',
    price: 247.00,
    instructor: 'Speaker Expert Ana',
    duration: '7h 45min',
    rating: 4.8,
    students: 980
  },
  {
    id: 'ce3',
    title: 'MAPA DA INTELIGÊNCIA MASTER',
    description: 'Metodologia completa para desenvolver inteligência',
    image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CRIAÇÃO E ESTRATÉGIAS',
    price: 397.00,
    instructor: 'Master Intelligence Dr. Paulo',
    duration: '12h 30min',
    rating: 4.9,
    students: 560
  },

  // MATERIAL DE APOIO
  {
    id: 'ma1',
    title: 'ARI SPOTIFY',
    description: 'Como usar o Spotify para desenvolvimento pessoal',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MATERIAL DE APOIO',
    price: 47.00,
    instructor: 'Music Therapist Ari',
    duration: '1h 30min',
    rating: 4.5,
    students: 2340
  },
  {
    id: 'ma2',
    title: 'PLANILHAS INTELIGENTES',
    description: 'Domine planilhas para produtividade máxima',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MATERIAL DE APOIO',
    price: 97.00,
    instructor: 'Excel Master Carlos',
    duration: '3h 15min',
    rating: 4.7,
    students: 1870
  },
  {
    id: 'ma3',
    title: 'DOCUMENTOS INTELIGENTES',
    description: 'Crie documentos profissionais e impactantes',
    image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MATERIAL DE APOIO',
    price: 67.00,
    instructor: 'Doc Expert Maria',
    duration: '2h 45min',
    rating: 4.6,
    students: 1450
  },
  {
    id: 'ma4',
    title: 'EVENTOS PROFISSIONAIS',
    description: 'Organize eventos de alto padrão e impacto',
    image_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MATERIAL DE APOIO',
    price: 197.00,
    instructor: 'Event Manager João',
    duration: '5h 30min',
    rating: 4.8,
    students: 780
  },

  // VENDAS
  {
    id: 'v1',
    title: 'VENDAS ESSENCIAIS',
    description: 'Fundamentos das vendas de alto desempenho',
    image_url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'VENDAS',
    price: 197.00,
    instructor: 'Sales Master Pedro',
    duration: '6h 15min',
    rating: 4.8,
    students: 1560
  },
  {
    id: 'v2',
    title: 'PITCH MASTER',
    description: 'Crie apresentações irresistíveis que vendem',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'VENDAS',
    price: 247.00,
    instructor: 'Pitch Expert Ana',
    duration: '4h 45min',
    rating: 4.9,
    students: 1120
  },
  {
    id: 'v3',
    title: 'MISSÃO NAS VENDAS',
    description: 'Transforme vendas em missão de vida',
    image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'VENDAS',
    price: 297.00,
    instructor: 'Mission Sales Carlos',
    duration: '8h 30min',
    rating: 4.7,
    students: 890
  },

  // FINANÇAS E SUCESSOS
  {
    id: 'fs1',
    title: 'JEJUM INTELIGENTE',
    description: 'Estratégias inteligentes de jejum para saúde e performance',
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 147.00,
    instructor: 'Dr. Nutrition Silva',
    duration: '3h 30min',
    rating: 4.8,
    students: 1340
  },
  {
    id: 'fs2',
    title: 'DINHEIRO EM LIMITES',
    description: 'Supere seus limites financeiros e cresça',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 297.00,
    instructor: 'Finance Expert Maria',
    duration: '7h 15min',
    rating: 4.9,
    students: 980
  },
  {
    id: 'fs3',
    title: 'JORNADA DO BLINDADO',
    description: 'Construa uma mentalidade financeira blindada',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 397.00,
    instructor: 'Mindset Money João',
    duration: '10h 45min',
    rating: 4.8,
    students: 670
  },
  {
    id: 'fs4',
    title: 'FORÇAS DE CARÁTER',
    description: 'Desenvolva forças de caráter para o sucesso',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 247.00,
    instructor: 'Character Coach Ana',
    duration: '6h 20min',
    rating: 4.7,
    students: 1120
  },
  {
    id: 'fs5',
    title: 'COACH BILIDADE NA PRÁTICA',
    description: 'Aplicação prática de coaching para resultados',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 347.00,
    instructor: 'Master Coach Pedro',
    duration: '9h 30min',
    rating: 4.9,
    students: 560
  },
  {
    id: 'fs6',
    title: 'DIGITAL COACH',
    description: 'Coaching na era digital para máximos resultados',
    image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FINANÇAS E SUCESSOS',
    price: 297.00,
    instructor: 'Digital Coach Julia',
    duration: '8h 15min',
    rating: 4.8,
    students: 890
  }
];

// Componente do carrossel de cursos
const CourseCarousel: React.FC<{ title: string; courses: Course[]; onCourseSelect: (course: Course) => void }> = ({ 
  title, 
  courses, 
  onCourseSelect 
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Responsivo: diferentes quantidades por tela
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1536) return 6; // 2xl
      if (window.innerWidth >= 1280) return 5; // xl
      if (window.innerWidth >= 1024) return 4; // lg
      if (window.innerWidth >= 768) return 3;  // md
      return 2; // sm e xs
    }
    return 6;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setStartIndex(prev => 
      prev + itemsPerView >= courses.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setStartIndex(prev => 
      prev - itemsPerView < 0 ? Math.max(0, courses.length - itemsPerView) : prev - itemsPerView
    );
  };

  const visibleCourses = courses.slice(startIndex, startIndex + itemsPerView);
  const canScrollPrev = startIndex > 0;
  const canScrollNext = startIndex + itemsPerView < courses.length;

  return (
    <div 
      className="space-y-4 group/carousel relative px-6 lg:px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between relative">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">{title}</h2>
        
        {/* Navigation Buttons - Sempre visíveis quando necessário */}
        {courses.length > itemsPerView && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={!canScrollPrev}
              className={`
                nav-btn-top
                ${!canScrollPrev ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 hover:shadow-xl'}
              `}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={!canScrollNext}
              className={`
                nav-btn-top
                ${!canScrollNext ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 hover:shadow-xl'}
              `}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Setas laterais grandes para desktop - estilo Netflix */}
      {courses.length > itemsPerView && (
        <>
          {/* Seta Esquerda */}
          {canScrollPrev && (
            <button
              onClick={prevSlide}
              className="carousel-nav-btn prev hidden lg:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {/* Seta Direita */}
          {canScrollNext && (
            <button
              onClick={nextSlide}
              className="carousel-nav-btn next hidden lg:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* Progress Indicator */}
      {courses.length > itemsPerView && (
        <div className="flex gap-1 justify-center lg:justify-start">
          {Array.from({ length: Math.ceil(courses.length / itemsPerView) }, (_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i * itemsPerView)}
              className={`h-1 rounded-full transition-all duration-300 ${
                Math.floor(startIndex / itemsPerView) === i 
                  ? 'w-8 bg-instituto-orange' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 relative lg:mx-6">
        {visibleCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onCourseSelect(course)}
          >
            <Card className="bg-transparent border-none overflow-hidden group-hover:scale-105 transition-all duration-300 group-hover:z-10">
              <CardContent className="p-0">
                {/* Novo formato de capa estilo streaming - aspect ratio mais vertical como Netflix */}
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                  <img 
                    src={course.image_url} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay aprimorado com mais informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {/* Título */}
                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:line-clamp-none">
                        {course.title}
                      </h3>
                      
                      {/* Instrutor */}
                      {course.instructor && (
                        <p className="text-white/80 text-xs mb-2">
                          por {course.instructor}
                        </p>
                      )}
                      
                      {/* Métricas */}
                      <div className="flex items-center gap-3 text-xs text-white/80 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        {course.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                        {course.students && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Preço e ação */}
                      <div className="flex items-center justify-between">
                        <span className="text-instituto-orange font-bold text-sm">
                          R$ {course.price.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge de categoria melhorado */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/80 backdrop-blur-sm text-white text-xs border-none">
                      {course.category}
                    </Badge>
                  </div>
                  
                  {/* Indicador de qualidade premium */}
                  {course.rating && course.rating >= 4.8 && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 fill-current text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Título sempre visível abaixo da capa */}
                <div className="mt-2 px-1">
                  <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-instituto-orange transition-colors">
                    {course.title}
                  </h4>
                  {course.instructor && (
                    <p className="text-gray-400 text-xs mt-1">
                      {course.instructor}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const NetflixStyleCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);

  // Agrupar cursos por categoria
  const coursesByCategory = mockCoursesData.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Ordem das categorias baseada na imagem
  const categoryOrder = [
    'INTELIGÊNCIA EMOCIONAL',
    'MASTERCLASSES', 
    'MARKETING DIGITAL',
    'BIBLIOTECA LUCRATIVA',
    'CRIAÇÃO E ESTRATÉGIAS',
    'MATERIAL DE APOIO',
    'VENDAS',
    'FINANÇAS E SUCESSOS'
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedLesson(null);
  };

  // Exibir Health Dashboard se solicitado
  if (showHealthDashboard) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={() => setShowHealthDashboard(false)} 
            className="mb-6 text-white border-white/30 hover:bg-white/10"
          >
            ← Voltar aos Cursos
          </Button>
          <HealthDashboard />
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <CoursePlayer
        lesson={selectedLesson}
        course={selectedCourse}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="space-y-6 p-6">
          <Button variant="outline" onClick={handleBackToCourses} className="mb-6">
            ← Voltar aos Cursos
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img 
                  src={selectedCourse.image_url} 
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-4">{selectedCourse.title}</h1>
                <p className="text-gray-300 text-lg mb-6">{selectedCourse.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{selectedCourse.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedCourse.students} estudantes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-instituto-orange mb-2">
                      R$ {selectedCourse.price.toFixed(2)}
                    </div>
                    <Button className="w-full bg-instituto-orange hover:bg-instituto-orange-hover text-white">
                      Comprar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sobre o Instrutor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-instituto-orange rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {selectedCourse.instructor?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{selectedCourse.instructor}</div>
                      <div className="text-sm text-gray-400">Especialista</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HealthLayout 
      showHealthStats={true} 
      enableQuickAccess={true}
      className="netflix-courses-page"
    >
      <div className="min-h-screen bg-black text-white">
      {/* Hero Section Melhorado */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 flex items-center h-full px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <Badge className="bg-instituto-orange/20 text-instituto-orange border-instituto-orange/50 mb-4">
                ✨ Mais de 36 cursos premium
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              Transforme
              <br />
              <span className="text-instituto-orange">Sua Vida</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl mb-8 text-gray-300 max-w-2xl leading-relaxed"
            >
              Acesse uma biblioteca premium de cursos de desenvolvimento pessoal e profissional,
              criados por especialistas reconhecidos no mercado.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex gap-4 flex-wrap"
            >
              <Button 
                size="lg" 
                className="bg-instituto-orange hover:bg-instituto-orange-hover text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const firstSection = document.querySelector('.course-section');
                  firstSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explorar Cursos
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                onClick={() => setShowHealthDashboard(true)}
              >
                <Heart className="w-5 h-5 mr-2" />
                Dashboard de Saúde
              </Button>
            </motion.div>
            
            {/* Stats Melhorados com Foco em Saúde e Gamificação */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-8 mt-12 text-sm"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-orange">36+</div>
                <div className="text-gray-400">Cursos Premium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-orange">25K+</div>
                <div className="text-gray-400">Estudantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-orange">4.9</div>
                <div className="text-gray-400">Avaliação Média</div>
              </div>
              <div className="text-center cursor-pointer" onClick={() => setShowHealthDashboard(true)}>
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                  <Activity className="w-6 h-6" />
                  98%
                </div>
                <div className="text-gray-400">Score Saúde</div>
              </div>
              <div className="text-center cursor-pointer" onClick={() => setShowHealthDashboard(true)}>
                <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-1">
                  <Zap className="w-6 h-6" />
                  25
                </div>
                <div className="text-gray-400">Idade Metabólica</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Seções de Cursos */}
      <div className="px-6 lg:px-12 py-16 space-y-16">
        {categoryOrder.map((category, index) => {
          const categoryCourses = coursesByCategory[category];
          if (!categoryCourses || categoryCourses.length === 0) return null;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="course-section"
            >
              <CourseCarousel
                title={category}
                courses={categoryCourses}
                onCourseSelect={handleCourseSelect}
              />
            </motion.div>
          );
        })}
      </div>
      </div>
    </HealthLayout>
  );
};
