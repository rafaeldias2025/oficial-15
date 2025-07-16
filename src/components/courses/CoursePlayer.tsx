import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Volume2, Maximize, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
}

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
}

interface CoursePlayerProps {
  lesson: CourseLesson;
  course: Course | null;
  onBack: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ lesson, course, onBack }) => {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (user && lesson) {
      checkLessonProgress();
    }
  }, [user, lesson]);

  const checkLessonProgress = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('lesson_id', lesson.id)
        .single();

      setIsCompleted(data?.completed || false);
    } catch (error) {
      console.error('Erro ao verificar progresso:', error);
    }
  };

  const markAsCompleted = async () => {
    if (!user || !course) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: profile.id,
          course_id: course.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      setIsCompleted(true);
    } catch (error) {
      console.error('Erro ao marcar como concluído:', error);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Converter URL do YouTube para embed
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&rel=0`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-netflix-text">{lesson.title}</h1>
            {course && (
              <p className="text-netflix-text-secondary">{course.title}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {lesson.duration_minutes && (
            <div className="flex items-center gap-1 text-netflix-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration_minutes} min</span>
            </div>
          )}
          
          <Button
            onClick={markAsCompleted}
            variant={isCompleted ? "secondary" : "default"}
            className="gap-2"
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-green-500' : ''}`} />
            {isCompleted ? 'Concluído' : 'Marcar como Concluído'}
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-netflix-card border-netflix-border overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-black relative">
                <iframe
                  src={getYouTubeEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>

          {/* Lesson Details */}
          <Card className="bg-netflix-card border-netflix-border mt-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-netflix-text mb-2">{lesson.title}</h2>
                  {lesson.description && (
                    <p className="text-netflix-text-secondary">{lesson.description}</p>
                  )}
                </div>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Concluído
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-netflix-border">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-instituto-orange" />
                  <span className="text-netflix-text">Aula em vídeo</span>
                </div>
                {lesson.duration_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-instituto-orange" />
                    <span className="text-netflix-text">{lesson.duration_minutes} minutos</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {course && (
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-4">
                <h3 className="font-semibold text-netflix-text mb-3">Sobre o Curso</h3>
                <div className="aspect-video bg-gradient-to-br from-instituto-orange/20 to-purple-500/20 rounded-lg mb-3 overflow-hidden">
                  {course.image_url && (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h4 className="font-medium text-netflix-text mb-2">{course.title}</h4>
                <p className="text-sm text-netflix-text-secondary mb-3">{course.description}</p>
                
                <Badge className="bg-instituto-orange text-white">
                  {course.category.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          )}

          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-netflix-text mb-3">Recursos</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-netflix-text-secondary">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Áudio em português</span>
                </div>
                <div className="flex items-center gap-2 text-netflix-text-secondary">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">Tela cheia disponível</span>
                </div>
                <div className="flex items-center gap-2 text-netflix-text-secondary">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Progresso salvo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};