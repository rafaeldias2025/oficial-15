import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Star, Clock, Users } from 'lucide-react';

interface HeroItem {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  category: string;
  duration?: string;
  participants?: number;
  rating?: number;
  cta: string;
  ctaAction: () => void;
  badge?: string;
}

interface HeroCarouselProps {
  items: HeroItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];

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

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${currentItem.backgroundImage})` 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div className="max-w-2xl text-white animate-fade-in-up">
          {/* Badge */}
          {currentItem.badge && (
            <Badge className="mb-4 animate-bounce-in bg-netflix-red text-white border-0">
              {currentItem.badge}
            </Badge>
          )}
          
          {/* Category */}
          <Badge className={`mb-3 ${getCategoryClass(currentItem.category)} border-0`}>
            {currentItem.category}
          </Badge>
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {currentItem.title}
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200">
            {currentItem.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center gap-6 mb-8 text-sm">
            {currentItem.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentItem.duration}</span>
              </div>
            )}
            {currentItem.participants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{currentItem.participants} participantes</span>
              </div>
            )}
            {currentItem.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{currentItem.rating}/5</span>
              </div>
            )}
          </div>
          
          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold netflix-card"
            onClick={currentItem.ctaAction}
          >
            <Play className="w-5 h-5 mr-2" />
            {currentItem.cta}
          </Button>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-200"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-200"
        onClick={nextSlide}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}