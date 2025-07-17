import React, { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Star, Users, Clock, BookOpen, Filter } from 'lucide-react';
import { Course } from '@/data/courses';
import { PrevButton, NextButton, useCarouselButtons } from '../carousel/CarouselButtons';

interface ResponsiveCarouselProps {
  title: string;
  courses: Course[];
  showFilters?: boolean;
}

const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({ 
  title, 
  courses, 
  showFilters = false 
}) => {
  const [filter, setFilter] = useState('todos');
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
      '(min-width: 1280px)': { slidesToScroll: 4 },
      '(min-width: 1536px)': { slidesToScroll: 5 }
    }
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = useCarouselButtons(emblaApi);

  // Filtros disponíveis
  const filters = [
    { value: 'todos', label: 'Todos os cursos' },
    { value: 'recomendado', label: 'Recomendado' },
    { value: 'alta', label: 'Em alta agora' },
    { value: 'novo', label: 'Novo' },
    { value: 'meta', label: 'Baseado na sua meta' }
  ];

  // Aplicar filtros
  const filteredCourses = courses.filter(course => {
    if (filter === 'todos') return true;
    if (filter === 'recomendado') return course.rating >= 4.7;
    if (filter === 'alta') return course.studentsCount > 1500;
    if (filter === 'novo') return ['11', '12', '13', '15', '17', '18', '19', '21', '22', '24'].includes(course.id);
    if (filter === 'meta') return ['Nutrição', 'Atividade Física', 'Bem-estar'].includes(course.category);
    return true;
  });

  const getStatusButton = (course: Course) => {
    switch (course.status) {
      case 'not-started':
        return (
          <Button className="w-full bg-instituto-orange hover:bg-instituto-orange-hover text-white font-semibold">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Curso
          </Button>
        );
      case 'in-progress':
        return (
          <Button className="w-full bg-instituto-purple hover:bg-instituto-purple/90 text-white font-semibold">
            <BookOpen className="h-4 w-4 mr-2" />
            Continuar
          </Button>
        );
      case 'completed':
        return (
          <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500/10 font-semibold">
            <Play className="h-4 w-4 mr-2" />
            Revisar Curso
          </Button>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Psicologia': 'bg-purple-600',
      'Nutrição': 'bg-green-600',
      'Atividade Física': 'bg-blue-600',
      'Bem-estar': 'bg-pink-600',
      'Mindfulness': 'bg-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600';
  };

  if (filteredCourses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-netflix-text">{title}</h2>
          {showFilters && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-netflix-hover border-netflix-border text-netflix-text">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                {filters.map((filterOption) => (
                  <SelectItem 
                    key={filterOption.value} 
                    value={filterOption.value}
                    className="text-netflix-text hover:bg-netflix-hover"
                  >
                    {filterOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-netflix-text-muted mx-auto mb-4" />
          <p className="text-netflix-text-muted">Nenhum curso encontrado para este filtro</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-netflix-text">{title}</h2>
        {showFilters && (
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-netflix-hover border-netflix-border text-netflix-text">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-netflix-card border-netflix-border">
              {filters.map((filterOption) => (
                <SelectItem 
                  key={filterOption.value} 
                  value={filterOption.value}
                  className="text-netflix-text hover:bg-netflix-hover"
                >
                  {filterOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative carousel-container">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] pr-4 carousel-slide"
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <Card className={`bg-netflix-card border-netflix-border netflix-card group transition-all duration-300 course-card ${
                  hoveredCourse === course.id ? 'scale-105 z-10' : ''
                } ${
                  course.rating >= 4.8 ? 'featured' : ''
                } ${
                  ['11', '12', '13', '15', '17', '18', '19', '21', '22', '24'].includes(course.id) ? 'new-release' : ''
                } ${
                  course.studentsCount > 2000 ? 'popular' : ''
                }`} data-category={course.category}>
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={course.coverImage} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 course-card-image"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    </div>
                    
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(course.category)} text-white text-xs`}>
                        {course.category}
                      </Badge>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 rounded px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white font-medium">{course.rating}</span>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-netflix-text line-clamp-2 mb-1 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-sm text-netflix-text-muted line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {course.status === 'in-progress' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-netflix-text-muted">Progresso</span>
                          <span className="text-netflix-text font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-netflix-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{course.studentsCount}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      {getStatusButton(course)}
                    </div>

                    <div className="text-xs text-netflix-text-muted">
                      Instrutor: {course.instructor}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <PrevButton 
          className="carousel-navigation-button" 
          onClick={onPrevButtonClick} 
          disabled={prevBtnDisabled} 
        />
        <NextButton 
          className="carousel-navigation-button" 
          onClick={onNextButtonClick} 
          disabled={nextBtnDisabled} 
        />
      </div>
    </div>
  );
};

export default ResponsiveCarousel;
