import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Upload, Palette, Image, Settings, BookOpen, Play, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  price: number;
  duration: string;
  instructor: string;
  status: 'active' | 'draft' | 'archived';
  progress?: number;
  rating?: number;
  studentsCount?: number;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

const defaultCourses: CourseData[] = [
  {
    id: '1',
    title: 'Reeducação Alimentar Definitiva',
    description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida.',
    category: 'Nutrição',
    coverImage: '/api/placeholder/320/480',
    price: 197.00,
    duration: '4h 30min',
    instructor: 'Dr. Ana Silva',
    status: 'active',
    progress: 65,
    rating: 4.8,
    studentsCount: 1240
  },
  {
    id: '2',
    title: 'Mindfulness para Emagrecimento',
    description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente.',
    category: 'Psicologia',
    coverImage: '/api/placeholder/320/480',
    price: 167.00,
    duration: '3h 15min',
    instructor: 'Dra. Maria Santos',
    status: 'active',
    rating: 4.9,
    studentsCount: 856
  },
  {
    id: '3',
    title: 'Exercícios em Casa: Do Básico ao Avançado',
    description: 'Programa completo de exercícios para fazer em casa, sem equipamentos.',
    category: 'Atividade Física',
    coverImage: '/api/placeholder/320/480',
    price: 127.00,
    duration: '6h 45min',
    instructor: 'Prof. João Costa',
    status: 'active',
    progress: 100,
    rating: 4.7,
    studentsCount: 2150
  }
];

const categoryColors = {
  'Nutrição': { primary: '#10B981', secondary: '#ECFDF5', accent: '#065F46' },
  'Psicologia': { primary: '#8B5CF6', secondary: '#F3E8FF', accent: '#5B21B6' },
  'Atividade Física': { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#92400E' },
  'Bem-estar': { primary: '#EC4899', secondary: '#FCE7F3', accent: '#BE185D' },
  'Mindfulness': { primary: '#6366F1', secondary: '#EEF2FF', accent: '#3730A3' }
};

export const EnhancedCourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseData[]>(defaultCourses);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('courses');

  const [courseForm, setCourseForm] = useState<{
    title: string;
    description: string;
    category: string;
    coverImage: string;
    price: number;
    duration: string;
    instructor: string;
    status: 'active' | 'draft' | 'archived';
  }>({
    title: '',
    description: '',
    category: 'Nutrição',
    coverImage: '',
    price: 0,
    duration: '',
    instructor: '',
    status: 'draft'
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    primary: '#FF6B35',
    secondary: '#4A90E2',
    accent: '#7B68EE',
    background: '#1A1A1A'
  });

  const handleCreateCourse = () => {
    const newCourse: CourseData = {
      id: Date.now().toString(),
      ...courseForm,
      rating: 0,
      studentsCount: 0
    };

    setCourses(prev => [...prev, newCourse]);
    setIsCreateModalOpen(false);
    setCourseForm({
      title: '',
      description: '',
      category: 'Nutrição',
      coverImage: '',
      price: 0,
      duration: '',
      instructor: '',
      status: 'draft'
    });

    toast({
      title: "Sucesso",
      description: "Curso criado com sucesso!",
    });
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;

    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id 
        ? { ...course, ...courseForm }
        : course
    ));

    setIsEditModalOpen(false);
    setSelectedCourse(null);

    toast({
      title: "Sucesso",
      description: "Curso atualizado com sucesso!",
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    toast({
      title: "Curso Removido",
      description: "O curso foi removido com sucesso!",
    });
  };

  const openEditModal = (course: CourseData) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      coverImage: course.coverImage,
      price: course.price,
      duration: course.duration,
      instructor: course.instructor,
      status: course.status
    });
    setIsEditModalOpen(true);
  };

  const generateMockCover = (category: string) => {
    const colors = categoryColors[category as keyof typeof categoryColors];
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="320" height="480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="320" height="480" fill="url(#grad1)"/>
        <text x="160" y="240" fill="white" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold">${category}</text>
        <text x="160" y="280" fill="white" text-anchor="middle" font-family="Arial" font-size="16">Curso</text>
      </svg>
    `)}`;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = categoryColors[category as keyof typeof categoryColors];
    return colors ? `bg-[${colors.primary}]` : 'bg-instituto-orange';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-netflix-text">Gerenciamento de Cursos</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-instituto-orange hover:bg-instituto-orange-hover"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-netflix-card border-netflix-border">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Cursos
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2">
            <Palette className="w-4 h-4" />
            Design & Cores
          </TabsTrigger>
          <TabsTrigger value="covers" className="gap-2">
            <Image className="w-4 h-4" />
            Gerenciar Capas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-netflix-card border-netflix-border group hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="aspect-[2/3] bg-gradient-to-br from-instituto-orange/20 to-purple-500/20 rounded-t-lg overflow-hidden">
                    <img 
                      src={course.coverImage || generateMockCover(course.category)} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <Badge className={`category-${course.category.toLowerCase().replace(' ', '-')} text-white text-xs`}>
                      {course.category}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {course.status === 'active' ? 'Ativo' : course.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-netflix-text line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-netflix-text-muted">
                      por {course.instructor}
                    </p>
                  </div>

                   <p className="text-sm text-netflix-text-muted line-clamp-2">
                     {course.description}
                   </p>

                  <div className="flex items-center justify-between text-sm text-netflix-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="font-semibold text-instituto-orange">
                      R$ {course.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(course)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personalização de Cores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={colorTheme.primary}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, primary: e.target.value }))}
                        className="w-12 h-10 p-1 rounded"
                      />
                      <Input
                        value={colorTheme.primary}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, primary: e.target.value }))}
                        className="bg-netflix-hover border-netflix-border"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={colorTheme.secondary}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, secondary: e.target.value }))}
                        className="w-12 h-10 p-1 rounded"
                      />
                      <Input
                        value={colorTheme.secondary}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, secondary: e.target.value }))}
                        className="bg-netflix-hover border-netflix-border"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cor de Destaque</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={colorTheme.accent}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, accent: e.target.value }))}
                        className="w-12 h-10 p-1 rounded"
                      />
                      <Input
                        value={colorTheme.accent}
                        onChange={(e) => setColorTheme(prev => ({ ...prev, accent: e.target.value }))}
                        className="bg-netflix-hover border-netflix-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-netflix-text">Preview das Cores</h4>
                  <div className="space-y-3">
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: colorTheme.primary }}
                    >
                      Cor Primária
                    </div>
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: colorTheme.secondary }}
                    >
                      Cor Secundária
                    </div>
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: colorTheme.accent }}
                    >
                      Cor de Destaque
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Aplicar Tema Personalizado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="covers" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Image className="w-5 h-5" />
                Gerenciador de Capas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 border-2 border-dashed border-netflix-border rounded-lg">
                <Upload className="w-12 h-12 text-netflix-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-netflix-text mb-2">
                  Upload de Capas
                </h3>
                <p className="text-netflix-text-muted mb-4">
                  Faça upload de imagens para as capas dos cursos<br />
                  Dimensões recomendadas: 320x480px
                </p>
                <Button variant="outline">
                  Selecionar Arquivos
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(categoryColors).map(([category, colors]) => (
                  <div key={category} className="space-y-2">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden border border-netflix-border">
                      <img 
                        src={generateMockCover(category)}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-netflix-text text-center">{category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para Criar Curso */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">Criar Novo Curso</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label>Título do Curso</Label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              
              <div>
                <Label>Categoria</Label>
                <Select value={courseForm.category} onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    {Object.keys(categoryColors).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Instrutor</Label>
                <Input
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Duração</Label>
                <Input
                  placeholder="Ex: 4h 30min"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border h-32"
                />
              </div>

              <div>
                <Label>URL da Capa</Label>
                <Input
                  value={courseForm.coverImage}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  value={courseForm.status} 
                  onValueChange={(value) => setCourseForm(prev => ({ 
                    ...prev, 
                    status: value as 'active' | 'draft' | 'archived'
                  }))}
                >
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview da Capa */}
              <div>
                <Label>Preview da Capa</Label>
                <div className="aspect-[2/3] bg-netflix-hover rounded-lg border border-netflix-border overflow-hidden">
                  <img 
                    src={courseForm.coverImage || generateMockCover(courseForm.category)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleCreateCourse} className="flex-1 bg-instituto-orange hover:bg-instituto-orange-hover">
              Criar Curso
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Curso */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">Editar Curso</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label>Título do Curso</Label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              
              <div>
                <Label>Categoria</Label>
                <Select value={courseForm.category} onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    {Object.keys(categoryColors).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Instrutor</Label>
                <Input
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Duração</Label>
                <Input
                  placeholder="Ex: 4h 30min"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border h-32"
                />
              </div>

              <div>
                <Label>URL da Capa</Label>
                <Input
                  value={courseForm.coverImage}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  value={courseForm.status} 
                  onValueChange={(value) => setCourseForm(prev => ({ 
                    ...prev, 
                    status: value as 'active' | 'draft' | 'archived'
                  }))}
                >
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview da Capa */}
              <div>
                <Label>Preview da Capa</Label>
                <div className="aspect-[2/3] bg-netflix-hover rounded-lg border border-netflix-border overflow-hidden">
                  <img 
                    src={courseForm.coverImage || generateMockCover(courseForm.category)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleEditCourse} className="flex-1 bg-instituto-orange hover:bg-instituto-orange-hover">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};