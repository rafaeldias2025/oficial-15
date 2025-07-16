import React, { useState } from 'react';
import NetflixCourseCarousel from './NetflixCourseCarousel';
import { NetflixHeroSection } from './NetflixHeroSection';
import { NetflixCategoryGrid } from './NetflixCategoryGrid';
import { simulatedCourses } from '@/data/courses';

export const NetflixCoursesPage: React.FC = () => {
  const [featuredCourse] = useState(simulatedCourses[0]);
  
  // Filtrar cursos por status
  const continueCourses = simulatedCourses.filter(c => c.status === 'in-progress');
  const newCourses = simulatedCourses.filter(c => c.status === 'not-started');
  const completedCourses = simulatedCourses.filter(c => c.status === 'completed');
  const trendingCourses = simulatedCourses.filter(c => c.studentsCount > 1000);
  const recommendedCourses = simulatedCourses.filter(c => c.rating >= 4.7);

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      {/* Hero Section */}
      <NetflixHeroSection featuredCourse={featuredCourse} />

      {/* Course Carousels */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {continueCourses.length > 0 && (
          <NetflixCourseCarousel
            title="Continue Assistindo"
            courses={continueCourses}
            showFilters={false}
          />
        )}

        <NetflixCourseCarousel
          title="Recomendado para Você"
          courses={recommendedCourses}
          showFilters={true}
        />

        <NetflixCourseCarousel
          title="Em Alta Agora"
          courses={trendingCourses}
          showFilters={false}
        />

        <NetflixCourseCarousel
          title="Novos Cursos"
          courses={newCourses}
          showFilters={false}
        />

        {completedCourses.length > 0 && (
          <NetflixCourseCarousel
            title="Seus Cursos Concluídos"
            courses={completedCourses}
            showFilters={false}
          />
        )}

        {/* Categorias */}
        <NetflixCategoryGrid />
      </div>
    </div>
  );
};

export default NetflixCoursesPage;