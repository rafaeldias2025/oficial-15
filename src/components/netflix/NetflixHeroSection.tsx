import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Star, Clock, Users, Info } from 'lucide-react';
import { Course } from '@/data/courses';
import courseHeroBanner from '@/assets/course-hero-banner.jpg';

interface NetflixHeroSectionProps {
  featuredCourse: Course;
}

export const NetflixHeroSection: React.FC<NetflixHeroSectionProps> = ({ 
  featuredCourse 
}) => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${courseHeroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-background/90 via-netflix-background/50 to-transparent" />
      </div>
      
      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-8">
        <div className="max-w-2xl">
          <Badge className="category-nutrition text-white mb-4">
            {featuredCourse.category}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {featuredCourse.title}
          </h1>
          <p className="text-xl text-netflix-text-muted mb-8 leading-relaxed">
            {featuredCourse.description}
          </p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{featuredCourse.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-netflix-text-muted" />
              <span>{featuredCourse.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-netflix-text-muted" />
              <span>{featuredCourse.studentsCount.toLocaleString()} alunos</span>
            </div>
          </div>

          {featuredCourse.progress > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Seu progresso</span>
                <span>{featuredCourse.progress}%</span>
              </div>
              <Progress value={featuredCourse.progress} className="h-2" />
            </div>
          )}

          <div className="flex gap-4">
            <Button className="bg-instituto-orange hover:bg-instituto-orange-hover text-white px-8 py-3 text-lg font-semibold">
              <Play className="h-5 w-5 mr-2" />
              {featuredCourse.status === 'in-progress' ? 'Continuar' : 'Jornada Radical'}
            </Button>
            <Button variant="outline" className="border-netflix-text-muted text-netflix-text hover:bg-netflix-hover px-8 py-3 text-lg">
              <Info className="h-5 w-5 mr-2" />
              Mais Informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};