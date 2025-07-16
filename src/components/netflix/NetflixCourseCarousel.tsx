import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Play, Star, Users, Clock, BookOpen, Filter } from 'lucide-react';
import { Course } from '@/data/courses';

interface NetflixCourseCarouselProps {
  title: string;
  courses: Course[];
  showFilters?: boolean;
}

const NetflixCourseCarousel: React.FC<NetflixCourseCarouselProps> = ({ 
  title, 
  courses, 
  showFilters = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [filter, setFilter] = useState('todos');

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
    if (filter === 'alta') return course.studentsCount > 1000;
    if (filter === 'novo') return course.id === '5';
    if (filter === 'meta') return ['Nutrição', 'Atividade Física'].includes(course.category);
    return true;
  });

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredCourses.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, filteredCourses.length - 2)) % Math.max(1, filteredCourses.length - 2));
  };

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
      'Psicologia': 'category-psychology',
      'Nutrição': 'category-nutrition',
      'Atividade Física': 'category-fitness',
      'Bem-estar': 'category-wellness',
      'Mindfulness': 'category-mindfulness'
    };
    return colors[category as keyof typeof colors] || 'bg-netflix-hover';
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
        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="text-netflix-text-muted hover:text-netflix-text hover:bg-netflix-hover"
              disabled={currentIndex === 0 || filteredCourses.length <= 3}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="text-netflix-text-muted hover:text-netflix-text hover:bg-netflix-hover"
              disabled={currentIndex >= filteredCourses.length - 3}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex-none w-1/3"
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              <Card className={`bg-netflix-card border-netflix-border netflix-card group ${
                hoveredCourse === course.id ? 'scale-105 z-10' : ''
              }`}>
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-instituto-orange/20 to-instituto-purple/20 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 text-instituto-orange mx-auto mb-2" />
                      <div className="text-sm text-netflix-text-muted">Capa do Curso</div>
                    </div>
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
                    <h3 className="font-semibold text-netflix-text line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                   <p className="text-sm text-netflix-text-muted line-clamp-2">
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
    </div>
  );
};

export default NetflixCourseCarousel;