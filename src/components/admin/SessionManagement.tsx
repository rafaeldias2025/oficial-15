import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Video, 
  Upload, 
  Send, 
  Users, 
  User,
  FileText
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  titulo: string;
  descricao: string;
  conteudo: string;
  videoFile?: File;
  pdfFile?: File;
  videoUrl?: string;
  destinoTipo: 'usuario' | 'grupo';
  usuarioSelecionado?: string;
  grupoSelecionado?: string;
}

const mockUsers = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com' },
  { id: '2', name: 'Carlos Santos', email: 'carlos@email.com' },
  { id: '3', name: 'Maria Costa', email: 'maria@email.com' }
];

const mockGroups = [
  { id: '1', name: 'Grupo Iniciantes', members: 5 },
  { id: '2', name: 'Grupo Avançado', members: 8 },
  { id: '3', name: 'Grupo VIP', members: 3 }
];

export const SessionManagement: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SessionData>({
    titulo: '',
    descricao: '',
    conteudo: '',
    destinoTipo: 'usuario'
  });

  const handleFileUpload = (file: File, type: 'video' | 'pdf') => {
    if (type === 'video') {
      setFormData({ ...formData, videoFile: file });
    } else {
      setFormData({ ...formData, pdfFile: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui integraria com Supabase para criar a sessão
    console.log('Nova sessão:', formData);
    
    toast({
      title: "Sessão criada com sucesso!",
      description: `"${formData.titulo}" foi enviada para ${formData.destinoTipo === 'usuario' ? 'usuário específico' : 'grupo'}.`,
    });

    // Reset form
    setFormData({
      titulo: '',
      descricao: '',
      conteudo: '',
      destinoTipo: 'usuario'
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full instituto-button">
            <Plus className="h-4 w-4 mr-2" />
            Criar Nova Sessão
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-instituto-purple" />
              Criar Nova Sessão
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da Sessão *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="bg-netflix-gray border-netflix-border text-netflix-text"
                  placeholder="Ex: Reflexão sobre Objetivos de Vida"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="bg-netflix-gray border-netflix-border text-netflix-text"
                  placeholder="Breve descrição do objetivo da sessão..."
                  required
                />
              </div>
            </div>

            {/* Upload de Arquivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-netflix-text">Materiais (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video">Upload de Vídeo</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      className="w-full border-netflix-border text-netflix-text hover:bg-netflix-gray"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.videoFile ? formData.videoFile.name : 'Selecionar Vídeo'}
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <Label htmlFor="videoUrl">Ou Link do Vídeo</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      className="bg-netflix-gray border-netflix-border text-netflix-text"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="pdf">Upload de PDF</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('pdf-upload')?.click()}
                      className="w-full border-netflix-border text-netflix-text hover:bg-netflix-gray"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {formData.pdfFile ? formData.pdfFile.name : 'Selecionar PDF'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo da Sessão */}
            <div>
              <Label htmlFor="conteudo">Conteúdo da Sessão *</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[120px]"
                placeholder="Instruções detalhadas, perguntas para reflexão, exercícios práticos..."
                required
              />
            </div>

            {/* Destino da Sessão */}
            <div className="space-y-4">
              <Label>Destino da Sessão *</Label>
              <RadioGroup
                value={formData.destinoTipo}
                onValueChange={(value: 'usuario' | 'grupo') => setFormData({...formData, destinoTipo: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="usuario" id="usuario" />
                  <Label htmlFor="usuario" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Usuário Específico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grupo" id="grupo" />
                  <Label htmlFor="grupo" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Grupo de Usuários
                  </Label>
                </div>
              </RadioGroup>

              {formData.destinoTipo === 'usuario' && (
                <div>
                  <Label htmlFor="usuario-select">Selecionar Usuário</Label>
                  <Select value={formData.usuarioSelecionado || ''} onValueChange={(value) => setFormData({...formData, usuarioSelecionado: value})}>
                    <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                      <SelectValue placeholder="Escolha um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-netflix-text-muted">{user.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.destinoTipo === 'grupo' && (
                <div>
                  <Label htmlFor="grupo-select">Selecionar Grupo</Label>
                  <Select value={formData.grupoSelecionado || ''} onValueChange={(value) => setFormData({...formData, grupoSelecionado: value})}>
                    <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                      <SelectValue placeholder="Escolha um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{group.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {group.members} membros
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full border-netflix-border text-netflix-text hover:bg-netflix-gray"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Grupo
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="instituto-button flex-1">
                <Send className="h-4 w-4 mr-2" />
                Publicar Sessão
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview de sessões ativas */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-netflix-text">Sessões Ativas</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          <div className="p-2 bg-netflix-hover rounded text-center text-sm text-netflix-text-muted">
            Nenhuma sessão ativa
          </div>
        </div>
      </div>
    </div>
  );
};