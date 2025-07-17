import React from 'react';
import { NetflixStyleCourses } from './NetflixStyleCourses';

export const PaidCourses = () => {
  return <NetflixStyleCourses />;
};

// Dados mock para demonstração
const mockCourses: Course[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Reeducação Alimentar Definitiva',
    description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida. Descubra como fazer escolhas inteligentes e criar hábitos duradouros.',
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Nutrição',
    price: 197.00
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Mindfulness para Emagrecimento',
    description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente. Transforme sua relação com a comida e desenvolva uma mentalidade saudável.',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Psicologia',
    price: 167.00
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Exercícios em Casa: Do Básico ao Avançado',
    description: 'Programa completo de exercícios para fazer em casa, sem equipamentos. Desenvolva força, resistência e flexibilidade.',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Atividade Física',
    price: 127.00
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Receitas Saudáveis e Deliciosas',
    description: 'Descubra receitas incríveis que são nutritivas e irresistíveis. Cozinhe com prazer e saúde.',
    image_url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Nutrição',
    price: 97.00
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Yoga para Perda de Peso',
    description: 'Sequências de yoga específicas para acelerar o metabolismo e promover o emagrecimento saudável.',
    image_url: 'https://images.unsplash.com/photo-1506629905826-b2562640e3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Atividade Física',
    price: 147.00
  }
];

const mockModules: CourseModule[] = [
  {
    id: 'aaaa1111-1111-1111-1111-111111111111',
    title: 'Fundamentos da Nutrição',
    description: 'Entenda os princípios básicos de uma alimentação equilibrada',
    lessons: [
      {
        id: '1111aaaa-1111-1111-1111-111111111111',
        title: 'O que é uma alimentação equilibrada?',
        description: 'Conceitos fundamentais sobre macronutrientes e micronutrientes',
        video_url: 'https://www.youtube.com/embed/L_xvHkFuQUU',
        duration_minutes: 25
      },
      {
        id: '1111aaaa-2222-2222-2222-222222222222',
        title: 'Lendo rótulos corretamente',
        description: 'Como interpretar informações nutricionais dos produtos',
        video_url: 'https://www.youtube.com/embed/L_xvHkFuQUU',
        duration_minutes: 18
      },
      {
        id: '1111aaaa-3333-3333-3333-333333333333',
        title: 'Hidratação adequada',
        description: 'A importância da água e como calcular suas necessidades',
        video_url: 'https://www.youtube.com/embed/L_xvHkFuQUU',
        duration_minutes: 15
      }
    ]
  },
  {
    id: 'aaaa2222-2222-2222-2222-222222222222',
    title: 'Planejamento de Refeições',
    description: 'Aprenda a organizar suas refeições de forma prática',
    lessons: [
      {
        id: '2222aaaa-1111-1111-1111-111111111111',
        title: 'Planejando a semana alimentar',
        description: 'Estratégias para organizar suas refeições',
        video_url: 'https://www.youtube.com/embed/L_xvHkFuQUU',
        duration_minutes: 28
      },
      {
        id: '2222aaaa-2222-2222-2222-222222222222',
        title: 'Lista de compras inteligente',
        description: 'Como fazer compras eficientes e saudáveis',
        video_url: 'https://www.youtube.com/embed/L_xvHkFuQUU',
        duration_minutes: 20
      }
    ]
  }
];

export const PaidCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Usar dados mock por padrão para demonstração
    setCourses(mockCourses);
    setLoading(false);
    
    // Tentar carregar do banco em background
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Se conseguiu carregar do banco, substitui os dados mock
      if (data && data.length > 0) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos (usando dados mock):', error);
      // Mantém dados mock em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseModules = async (courseId: string) => {
    try {
      // Usar dados mock primeiro
      if (courseId === '11111111-1111-1111-1111-111111111111') {
        setCourseModules(mockModules);
        return;
      }
      
      // Tentar carregar do banco
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons (
            id,
            title,
            description,
            video_url,
            duration_minutes,
            order_index
          )
        `)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;

      const modulesWithLessons = modules?.map(module => ({
        ...module,
        lessons: module.course_lessons?.sort((a, b) => a.order_index - b.order_index) || []
      })) || [];

      setCourseModules(modulesWithLessons);
    } catch (error) {
      console.error('Erro ao buscar módulos (usando dados mock):', error);
      // Em caso de erro, usar dados mock
      setCourseModules(mockModules);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseModules(course.id);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson: CourseLesson) => {
    setSelectedLesson(lesson);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pilulas':
        return 'bg-green-500';
      case 'plataforma':
        return 'bg-blue-500';
      case 'comunidade':
        return 'bg-purple-500';
      default:
        return 'bg-instituto-orange';
    }
  };

  const renderPillsSection = (courses: Course[]) => {
    const pillsCourses = courses.filter(c => c.category === 'pilulas');
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-netflix-text mb-4">
            <span className="text-netflix-text">NOVO CONTEÚDO</span>
            <br />
            <span className="text-pink-500">MENSALMENTE</span>
          </h2>
        </div>

        <div className="bg-netflix-dark p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-netflix-text mb-6">PÍLULAS DO BEM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {pillsCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-netflix-card border-netflix-border hover:scale-105 transition-transform cursor-pointer group"
                onClick={() => handleCourseSelect(course)}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-square rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-pink-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-2">
                      <Play className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">Assistir</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPlatformSection = (courses: Course[]) => {
    const platformCourses = courses.filter(c => c.category === 'plataforma');
    
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-netflix-text">PLATAFORMA DOS SONHOS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {platformCourses.map((course) => (
            <Card 
              key={course.id} 
              className="bg-netflix-card border-netflix-border hover:scale-105 transition-transform cursor-pointer group"
              onClick={() => handleCourseSelect(course)}
            >
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                  {course.image_url && (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Acessar Curso
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-netflix-text mb-2">{course.title}</h4>
                  <p className="text-sm text-netflix-text-secondary mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getCategoryColor(course.category)} text-white`}>
                      {course.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCommunitySection = (courses: Course[]) => {
    const communityCourses = courses.filter(c => c.category === 'comunidade');
    
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-netflix-text">COMUNIDADE DOS SONHOS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityCourses.map((course) => (
            <Card 
              key={course.id} 
              className="bg-netflix-card border-netflix-border hover:scale-105 transition-transform cursor-pointer group"
              onClick={() => handleCourseSelect(course)}
            >
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-lg relative overflow-hidden">
                  {course.image_url && (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Acessar Conteúdo
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-netflix-text mb-2">{course.title}</h4>
                  <p className="text-sm text-netflix-text-secondary mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-netflix-text-secondary">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">1.2k membros</span>
                    </div>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      EXCLUSIVO
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (selectedLesson) {
    return (
      <CoursePlayer
        lesson={selectedLesson}
        course={selectedCourse}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCourse(null)}>
            ← Voltar
          </Button>
          <h2 className="text-2xl font-bold text-netflix-text">{selectedCourse.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {courseModules.map((module) => (
                <Card key={module.id} className="bg-netflix-card border-netflix-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-netflix-text mb-4">{module.title}</h3>
                    {module.description && (
                      <p className="text-netflix-text-secondary mb-4">{module.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3 bg-netflix-hover rounded-lg cursor-pointer hover:bg-netflix-border transition-colors"
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-instituto-orange rounded-full flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-netflix-text">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-sm text-netflix-text-secondary">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            {lesson.duration_minutes && (
                              <div className="flex items-center gap-1 text-netflix-text-secondary">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{lesson.duration_minutes}min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-netflix-text mb-4">Sobre o Curso</h3>
                <p className="text-netflix-text-secondary mb-4">{selectedCourse.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-instituto-orange" />
                    <span className="text-netflix-text">Acesso ilimitado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-instituto-orange" />
                    <span className="text-netflix-text">No seu ritmo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-instituto-orange" />
                    <span className="text-netflix-text">Certificado incluso</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {renderPillsSection(courses)}
      {renderPlatformSection(courses)}
      {renderCommunitySection(courses)}
    </div>
  );
};