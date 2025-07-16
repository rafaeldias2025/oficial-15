import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play, Clock, Users, Star, CheckCircle } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  duration?: string;
  participants?: number;
  rating?: number;
  progress?: number;
  status?: 'new' | 'in-progress' | 'completed';
  level?: 'iniciante' | 'intermediario' | 'avancado';
  onClick: () => void;
}

interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
  showProgress?: boolean;
}

export default function ContentCarousel({ title, items, showProgress = false }: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const getCategoryClass = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Nutrição': 'category-nutrition',
      'Psicologia': 'category-psychology', 
      'Bem-estar': 'category-wellness',
      'Fitness': 'category-fitness',
      'Mindfulness': 'category-mindfulness'
    };
    return categoryMap[category] || 'bg-muted';
  };

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      'new': { label: 'Novo', class: 'bg-green-500 text-white' },
      'in-progress': { label: 'Em Andamento', class: 'bg-yellow-500 text-white' },
      'completed': { label: 'Concluído', class: 'bg-blue-500 text-white' }
    };
    return status ? statusMap[status as keyof typeof statusMap] : null;
  };

  const getLevelColor = (level?: string) => {
    const levelMap = {
      'iniciante': 'bg-green-100 text-green-800',
      'intermediario': 'bg-yellow-100 text-yellow-800',
      'avancado': 'bg-red-100 text-red-800'
    };
    return level ? levelMap[level as keyof typeof levelMap] : '';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            
            return (
              <Card 
                key={item.id}
                className="flex-shrink-0 w-80 netflix-card cursor-pointer bg-card hover:bg-card/80 transition-all duration-300"
                onClick={item.onClick}
              >
                <div className="relative">
                  {/* Image */}
                  <div 
                    className="h-44 bg-cover bg-center rounded-t-lg relative"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg" />
                    
                    {/* Status Badge */}
                    {statusBadge && (
                      <Badge className={`absolute top-3 left-3 ${statusBadge.class} border-0`}>
                        {item.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {statusBadge.label}
                      </Badge>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" className="bg-primary/80 hover:bg-primary text-white rounded-full">
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 space-y-3">
                    {/* Category and Level */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getCategoryClass(item.category)} border-0 text-xs`}>
                        {item.category}
                      </Badge>
                      {item.level && (
                        <Badge className={`${getLevelColor(item.level)} border-0 text-xs`}>
                          {item.level}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}</span>
                          </div>
                        )}
                        {item.participants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{item.participants}</span>
                          </div>
                        )}
                      </div>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {showProgress && item.progress !== undefined && (
                      <div className="space-y-1">
                        <Progress value={item.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">
                          {item.progress}% completo
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}