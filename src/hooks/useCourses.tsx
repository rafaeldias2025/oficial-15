import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  is_active: boolean;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_active: boolean;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export const useCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...courseData, created_by: profile.id }])
        .select()
        .single();

      if (error) throw error;
      
      setCourses(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao criar curso:', err);
      throw err;
    }
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, ...data } : course
      ));
      
      return data;
    } catch (err) {
      console.error('Erro ao atualizar curso:', err);
      throw err;
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId);

      if (error) throw error;
      
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Erro ao deletar curso:', err);
      throw err;
    }
  };

  const fetchCourseModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons (*)
        `)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      return data?.map(module => ({
        ...module,
        lessons: module.course_lessons?.sort((a, b) => a.order_index - b.order_index) || []
      })) || [];
    } catch (err) {
      console.error('Erro ao buscar módulos:', err);
      throw err;
    }
  };

  const createModule = async (moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert([moduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao criar módulo:', err);
      throw err;
    }
  };

  const createLesson = async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([lessonData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao criar aula:', err);
      throw err;
    }
  };

  const markLessonAsCompleted = async (courseId: string, lessonId: string) => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: profile.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao marcar aula como concluída:', err);
      throw err;
    }
  };

  const getUserProgress = async (courseId: string) => {
    if (!user) return [];

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
      return [];
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourseModules,
    createModule,
    createLesson,
    markLessonAsCompleted,
    getUserProgress,
  };
};