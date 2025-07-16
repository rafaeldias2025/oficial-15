import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play, BookOpen, Clock } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';

export const CourseManagement = () => {
  const { courses, loading, createCourse, updateCourse, deleteCourse, fetchCourseModules, createModule, createLesson } = useCourses();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [courseModules, setCourseModules] = useState<any[]>([]);
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    price: 0,
    is_active: true
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order_index: 0,
    is_active: true
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    order_index: 0,
    is_active: true
  });

  const handleCreateCourse = async () => {
    try {
      await createCourse(courseForm);
      setIsCreateModalOpen(false);
      setCourseForm({
        title: '',
        description: '',
        image_url: '',
        category: 'general',
        price: 0,
        is_active: true
      });
      toast({
        title: "Sucesso",
        description: "Curso criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar curso",
        variant: "destructive",
      });
    }
  };

  const handleCreateModule = async () => {
    if (!selectedCourse) return;
    
    try {
      await createModule({
        course_id: selectedCourse.id,
        ...moduleForm
      });
      setIsModuleModalOpen(false);
      setModuleForm({
        title: '',
        description: '',
        order_index: 0,
        is_active: true
      });
      // Recarregar módulos
      const modules = await fetchCourseModules(selectedCourse.id);
      setCourseModules(modules);
      toast({
        title: "Sucesso",
        description: "Módulo criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar módulo",
        variant: "destructive",
      });
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedModule) return;
    
    try {
      await createLesson({
        module_id: selectedModule.id,
        ...lessonForm
      });
      setIsLessonModalOpen(false);
      setLessonForm({
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        order_index: 0,
        is_active: true
      });
      // Recarregar módulos
      const modules = await fetchCourseModules(selectedCourse.id);
      setCourseModules(modules);
      toast({
        title: "Sucesso",
        description: "Aula criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar aula",
        variant: "destructive",
      });
    }
  };

  const handleViewCourse = async (course: any) => {
    setSelectedCourse(course);
    const modules = await fetchCourseModules(course.id);
    setCourseModules(modules);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange"></div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              ← Voltar
            </Button>
            <h2 className="text-2xl font-bold text-netflix-text">{selectedCourse.title}</h2>
          </div>
          
          <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Módulo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-netflix-card border-netflix-border">
              <DialogHeader>
                <DialogTitle className="text-netflix-text">Novo Módulo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="module-title">Título do Módulo</Label>
                  <Input
                    id="module-title"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                <div>
                  <Label htmlFor="module-description">Descrição</Label>
                  <Textarea
                    id="module-description"
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                <div>
                  <Label htmlFor="module-order">Ordem</Label>
                  <Input
                    id="module-order"
                    type="number"
                    value={moduleForm.order_index}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                <Button onClick={handleCreateModule} className="w-full">
                  Criar Módulo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courseModules.map((module) => (
            <Card key={module.id} className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-netflix-text">{module.title}</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedModule(module);
                      setIsLessonModalOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Aula
                  </Button>
                </div>
                {module.description && (
                  <p className="text-netflix-text-secondary">{module.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.lessons?.map((lesson: any) => (
                    <div key={lesson.id} className="p-3 bg-netflix-hover rounded-lg">
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
                        <div className="flex items-center gap-2">
                          {lesson.duration_minutes && (
                            <div className="flex items-center gap-1 text-netflix-text-secondary">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{lesson.duration_minutes}min</span>
                            </div>
                          )}
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-netflix-text-secondary text-center py-4">
                      Nenhuma aula adicionada ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {courseModules.length === 0 && (
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-netflix-text-secondary mx-auto mb-4" />
                <p className="text-netflix-text-secondary">
                  Nenhum módulo criado ainda. Adicione o primeiro módulo para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal para criar aula */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent className="bg-netflix-card border-netflix-border">
            <DialogHeader>
              <DialogTitle className="text-netflix-text">Nova Aula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson-title">Título da Aula</Label>
                <Input
                  id="lesson-title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-description">Descrição</Label>
                <Textarea
                  id="lesson-description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-video">URL do Vídeo (YouTube)</Label>
                <Input
                  id="lesson-video"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-duration">Duração (minutos)</Label>
                <Input
                  id="lesson-duration"
                  type="number"
                  value={lessonForm.duration_minutes}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-order">Ordem</Label>
                <Input
                  id="lesson-order"
                  type="number"
                  value={lessonForm.order_index}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <Button onClick={handleCreateLesson} className="w-full">
                Criar Aula
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-netflix-text">Gerenciar Cursos</h2>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-netflix-card border-netflix-border">
            <DialogHeader>
              <DialogTitle className="text-netflix-text">Criar Novo Curso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course-title">Título do Curso</Label>
                <Input
                  id="course-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="course-description">Descrição</Label>
                <Textarea
                  id="course-description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="course-image">URL da Imagem</Label>
                <Input
                  id="course-image"
                  value={courseForm.image_url}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="course-category">Categoria</Label>
                <Select value={courseForm.category} onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    <SelectItem value="pilulas">Pílulas do Bem</SelectItem>
                    <SelectItem value="plataforma">Plataforma dos Sonhos</SelectItem>
                    <SelectItem value="comunidade">Comunidade dos Sonhos</SelectItem>
                    <SelectItem value="general">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course-price">Preço</Label>
                <Input
                  id="course-price"
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <Button onClick={handleCreateCourse} className="w-full">
                Criar Curso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-netflix-card border-netflix-border group hover:scale-105 transition-transform">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-instituto-orange/20 to-purple-500/20 rounded-t-lg overflow-hidden">
                {course.image_url && (
                  <img 
                    src={course.image_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-netflix-text">{course.title}</h3>
                  <Badge className={`${getCategoryColor(course.category)} text-white text-xs`}>
                    {course.category.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-netflix-text-secondary mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-instituto-orange">
                    R$ {course.price.toFixed(2)}
                  </span>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewCourse(course)}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {courses.length === 0 && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-netflix-text-secondary mx-auto mb-4" />
            <p className="text-netflix-text-secondary">
              Nenhum curso criado ainda. Crie o primeiro curso para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};