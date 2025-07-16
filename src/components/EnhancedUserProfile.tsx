import React, { useState, useRef } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Edit, Upload, BarChart3, Camera, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EditProfileModal } from './EditProfileModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EnhancedUserProfile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdate = () => {
    if (user) {
      const fetchUpdatedProfile = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setProfile(data);
        } catch (error) {
          console.error('Erro ao recarregar perfil:', error);
        }
      };
      fetchUpdatedProfile();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de arquivo
    if (!file.type.includes('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG)",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem com menos de 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload da imagem
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil com a nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Atualizar estado local
      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));

      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível atualizar sua foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!profile) return null;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Avatar clicável para editar */}
        <Button 
          variant="ghost" 
          className="relative h-16 w-16 rounded-full p-0 group"
          onClick={() => setShowEditModal(true)}
          title="Clique para editar perfil"
        >
          <Avatar className="h-16 w-16 ring-2 ring-instituto-orange/20 group-hover:ring-instituto-orange/40 transition-all">
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.full_name || 'Avatar'} 
              className="object-cover"
            />
            <AvatarFallback className="bg-instituto-orange text-white text-lg font-semibold">
              {getInitials(profile.full_name || user?.email || 'U')}
            </AvatarFallback>
          </Avatar>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Upload className="h-4 w-4 text-white animate-pulse" />
            </div>
          )}
        </Button>
        
        {/* Menu de opções */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-instituto-orange text-xl">⋮</span>
            </Button>
          </DropdownMenuTrigger>
        
          <DropdownMenuContent className="w-64 bg-white border border-instituto-orange/20 shadow-2xl" align="end" forceMount>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-instituto-orange/10 focus:bg-instituto-orange/10"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              <Camera className="mr-2 h-4 w-4 text-instituto-orange" />
              <span>{uploading ? 'Enviando...' : 'Alterar Foto'}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer hover:bg-instituto-orange/10 focus:bg-instituto-orange/10">
              <BarChart3 className="mr-2 h-4 w-4 text-instituto-orange" />
              <span>Ver Meu Progresso</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer hover:bg-instituto-orange/10 focus:bg-instituto-orange/10">
              <Trophy className="mr-2 h-4 w-4 text-instituto-orange" />
              <span>Ver Ranking</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer hover:bg-instituto-orange/10 focus:bg-instituto-orange/10">
              <Settings className="mr-2 h-4 w-4 text-instituto-orange" />
              <span>Configurações</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-red-50 focus:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-red-600">Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      <EditProfileModal
        trigger={showEditModal ? <div /> : null}
        userData={profile}
        onDataUpdated={() => {
          handleProfileUpdate();
          setShowEditModal(false);
        }}
      />
    </>
  );
};