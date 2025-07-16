import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Camera, ChevronDown, Upload, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { EditProfileModal } from '@/components/EditProfileModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ButtonLoading } from '@/components/ui/loading';

export const UserProfileMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Feedback visual imediato
      toast({
        title: "Saindo...",
        description: "Encerrando sua sessão com segurança"
      });

      await signOut();
      
      // Limpar dados locais
      localStorage.removeItem('userType');
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('user_onboarding_data');
      
      toast({
        title: "✅ Sessão encerrada",
        description: "Até logo! Volte sempre ao Instituto dos Sonhos"
      });
      
      // Redirecionar para página inicial
      window.location.href = '/';
    } catch (error) {
      handleError(error, 'Logout', () => handleSignOut());
    } finally {
      setIsSigningOut(false);
    }
  };

  const triggerFileInput = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validar arquivo
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "❌ Formato inválido",
        description: "Use apenas JPG, PNG ou WebP",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      toast({
        title: "📤 Enviando...",
        description: "Fazendo upload da sua foto"
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "✅ Foto atualizada!",
        description: "Sua nova foto de perfil foi salva"
      });

      // Recarregar página para atualizar avatar
      window.location.reload();
    } catch (error) {
      handleError(error, 'Upload de avatar');
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const userInitials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'US';

  return (
    <>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              {/* Indicador de upload */}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <ButtonLoading size="sm" className="text-white" />
                </div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Online
                </Badge>
              </div>
              <p className="text-sm text-white/60 truncate">
                {user?.email}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                className="w-56 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl" 
                align="end" 
                forceMount
              >
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                  onClick={triggerFileInput}
                  disabled={uploading}
                >
                  <div className="flex items-center">
                    {uploading ? (
                      <ButtonLoading size="sm" className="mr-2" />
                    ) : (
                      <Camera className="mr-2 h-4 w-4 text-purple-600" />
                    )}
                    <span className="text-purple-600">
                      {uploading ? 'Enviando...' : 'Alterar Foto'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                  onClick={() => setShowEditModal(true)}
                >
                  <User className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-purple-600">Editar Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                  onClick={() => {
                    toast({
                      title: "🔧 Em desenvolvimento",
                      description: "Configurações estarão disponíveis em breve"
                    });
                  }}
                >
                  <Settings className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-purple-600">Configurações</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50 focus:bg-red-50"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <div className="flex items-center">
                    {isSigningOut ? (
                      <ButtonLoading size="sm" className="mr-2" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    )}
                    <span className="text-red-600">
                      {isSigningOut ? 'Saindo...' : 'Sair'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      <EditProfileModal 
        open={showEditModal} 
        setOpen={setShowEditModal}
      />
    </>
  );
};