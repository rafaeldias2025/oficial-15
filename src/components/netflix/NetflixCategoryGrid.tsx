import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/courses';

export const NetflixCategoryGrid: React.FC = () => {
  const getCategoryEmoji = (category: string) => {
    const emojiMap = {
      'Nutrição': '🥗',
      'Psicologia': '🧠',
      'Atividade Física': '💪',
      'Bem-estar': '🌸',
      'Mindfulness': '🧘'
    };
    return emojiMap[category as keyof typeof emojiMap] || '📚';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-netflix-text">Explorar por Categoria</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Card 
            key={category} 
            className="bg-netflix-card border-netflix-border hover:scale-105 transition-transform cursor-pointer group"
          >
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">
                {getCategoryEmoji(category)}
              </div>
              <h3 className="font-semibold text-netflix-text group-hover:text-instituto-orange transition-colors">
                {category}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};