import React from 'react';
import ContentCarousel from './ContentCarousel';
import { Lightbulb, TrendingUp, Clock, Star } from 'lucide-react';

interface RecommendationEngineProps {
  userProgress: {
    completedCourses: string[];
    activeDesafios: string[];
    weakAreas: string[];
    preferredCategories: string[];
    sabotadores: string[];
  };
}

export default function RecommendationEngine({ userProgress }: RecommendationEngineProps) {
  // Mock data - in a real app, this would come from an AI recommendation system
  const generateRecommendations = () => {
    const baseCourses = [
      {
        id: 1,
        title: "Mindful Eating: Coma com Consciência",
        description: "Aprenda a desenvolver uma relação saudável com a comida através da atenção plena.",
        image: "/api/placeholder/300/200",
        category: "Mindfulness",
        duration: "45 min",
        participants: 1234,
        rating: 4.8,
        level: "iniciante" as const,
        onClick: () => console.log('Open course 1')
      },
      {
        id: 2,
        title: "Vencendo o Sabotador Emocional",
        description: "Identifique e supere padrões de comportamento que sabotam seus objetivos.",
        image: "/api/placeholder/300/200",
        category: "Psicologia",
        duration: "60 min",
        participants: 856,
        rating: 4.9,
        level: "intermediario" as const,
        onClick: () => console.log('Open course 2')
      },
      {
        id: 3,
        title: "Treino HIIT para Iniciantes",
        description: "Exercícios intensos e eficazes para acelerar seu metabolismo em casa.",
        image: "/api/placeholder/300/200",
        category: "Fitness",
        duration: "30 min",
        participants: 2156,
        rating: 4.7,
        level: "iniciante" as const,
        onClick: () => console.log('Open course 3')
      },
      {
        id: 4,
        title: "Planejamento de Refeições Saudáveis",
        description: "Como organizar sua semana com refeições nutritivas e saborosas.",
        image: "/api/placeholder/300/200",
        category: "Nutrição",
        duration: "50 min",
        participants: 1893,
        rating: 4.8,
        level: "intermediario" as const,
        onClick: () => console.log('Open course 4')
      },
      {
        id: 5,
        title: "Sono Reparador: Técnicas para Dormir Melhor",
        description: "Desenvolva hábitos para uma noite de sono revigorante e reparadora.",
        image: "/api/placeholder/300/200",
        category: "Bem-estar",
        duration: "40 min",
        participants: 987,
        rating: 4.6,
        level: "iniciante" as const,
        onClick: () => console.log('Open course 5')
      }
    ];

    const baseDesafios = [
      {
        id: 6,
        title: "21 Dias de Hidratação",
        description: "Mantenha-se hidratado por 21 dias consecutivos e forme um hábito duradouro.",
        image: "/api/placeholder/300/200",
        category: "Bem-estar",
        duration: "21 dias",
        participants: 3456,
        rating: 4.5,
        progress: 45,
        status: "in-progress" as const,
        level: "iniciante" as const,
        onClick: () => console.log('Open challenge 1')
      },
      {
        id: 7,
        title: "Semana sem Açúcar",
        description: "Desafie-se a evitar açúcar refinado por uma semana inteira.",
        image: "/api/placeholder/300/200",
        category: "Nutrição",
        duration: "7 dias",
        participants: 1234,
        rating: 4.4,
        status: "new" as const,
        level: "intermediario" as const,
        onClick: () => console.log('Open challenge 2')
      },
      {
        id: 8,
        title: "10.000 Passos Diários",
        description: "Alcance a meta de 10.000 passos todos os dias por 2 semanas.",
        image: "/api/placeholder/300/200",
        category: "Fitness",
        duration: "14 dias",
        participants: 2890,
        rating: 4.6,
        status: "new" as const,
        level: "iniciante" as const,
        onClick: () => console.log('Open challenge 3')
      }
    ];

    // Personalized recommendations based on user data
    const personalizedForYou = [...baseCourses];
    
    // Trending content
    const trending = [...baseCourses].sort(() => Math.random() - 0.5);
    
    // Continue watching (with progress)
    const continueWatching = baseDesafios.filter(item => item.status === 'in-progress');
    
    // Based on sabotadores
    const sabotadorBased = baseCourses.filter(course => 
      userProgress.sabotadores.some(sab => 
        course.description.toLowerCase().includes(sab.toLowerCase()) ||
        course.title.toLowerCase().includes(sab.toLowerCase())
      )
    );

    return {
      personalizedForYou,
      trending,
      continueWatching,
      sabotadorBased
    };
  };

  const recommendations = generateRecommendations();

  return (
    <div className="space-y-8">
      {/* Continue Watching */}
      {recommendations.continueWatching.length > 0 && (
        <ContentCarousel
          title="Continue de Onde Parou"
          items={recommendations.continueWatching}
          showProgress={true}
        />
      )}

      {/* Personalized Recommendations */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Recomendado para Você</h2>
        </div>
        <ContentCarousel
          title=""
          items={recommendations.personalizedForYou}
        />
      </div>

      {/* Based on Sabotadores */}
      {recommendations.sabotadorBased.length > 0 && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">Para Superar Seus Sabotadores</h2>
          </div>
          <ContentCarousel
            title=""
            items={recommendations.sabotadorBased}
          />
        </div>
      )}

      {/* Trending Now */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Em Alta Agora</h2>
        </div>
        <ContentCarousel
          title=""
          items={recommendations.trending}
        />
      </div>

      {/* Quick Actions */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Sessões Rápidas (15-30 min)</h2>
        </div>
        <ContentCarousel
          title=""
          items={recommendations.personalizedForYou.filter(item => 
            item.duration && parseInt(item.duration) <= 30
          )}
        />
      </div>
    </div>
  );
}