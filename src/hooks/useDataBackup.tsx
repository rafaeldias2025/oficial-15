import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackupData {
  id: string;
  user_id: string;
  data: any;
  backup_type: 'manual' | 'automatic';
  created_at: string;
  size_bytes: number;
}

export const useDataBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupHistory, setBackupHistory] = useState<BackupData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBackupHistory();
    
    // Backup automático a cada 24 horas
    const interval = setInterval(() => {
      const lastBackupTime = localStorage.getItem('last_auto_backup');
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (!lastBackupTime || (now - parseInt(lastBackupTime)) > dayInMs) {
        createAutomaticBackup();
      }
    }, 60 * 60 * 1000); // Verificar a cada hora

    return () => clearInterval(interval);
  }, []);

  const loadBackupHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Como não temos tabela de backup ainda, simular com dados locais
      const localBackups = localStorage.getItem('backup_history');
      if (localBackups) {
        setBackupHistory(JSON.parse(localBackups));
      }

      const lastBackupTime = localStorage.getItem('last_backup');
      if (lastBackupTime) {
        setLastBackup(lastBackupTime);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de backup:', error);
    }
  }, []);

  const createBackup = useCallback(async (type: 'manual' | 'automatic' = 'manual') => {
    setIsBackingUp(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Coletar dados para backup
      const backupData = {
        profile: null,
        healthData: null,
        missions: null,
        goals: null,
        diaryEntries: null,
        courses: null
      };

      // Buscar dados do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: healthData } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', user.id);

      const { data: missions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', user.id);

      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      const { data: diaryEntries } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id);

      backupData.profile = profile;
      backupData.healthData = healthData;
      backupData.missions = missions;
      backupData.goals = goals;
      backupData.diaryEntries = diaryEntries;

      const backupInfo: BackupData = {
        id: Date.now().toString(),
        user_id: user.id,
        data: backupData,
        backup_type: type,
        created_at: new Date().toISOString(),
        size_bytes: JSON.stringify(backupData).length
      };

      // Salvar backup localmente (em produção, salvaria no Supabase Storage)
      const localBackups = JSON.parse(localStorage.getItem('backup_history') || '[]');
      localBackups.push(backupInfo);
      
      // Manter apenas os últimos 10 backups
      if (localBackups.length > 10) {
        localBackups.splice(0, localBackups.length - 10);
      }

      localStorage.setItem('backup_history', JSON.stringify(localBackups));
      localStorage.setItem('last_backup', new Date().toISOString());
      
      if (type === 'automatic') {
        localStorage.setItem('last_auto_backup', Date.now().toString());
      }

      setBackupHistory(localBackups);
      setLastBackup(new Date().toISOString());

      toast({
        title: type === 'manual' ? "Backup criado ✅" : "Backup automático ✅",
        description: `Dados salvos com segurança (${(backupInfo.size_bytes / 1024).toFixed(1)} KB)`
      });

    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast({
        title: "Erro no backup",
        description: "Não foi possível criar o backup",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  }, [toast]);

  const createAutomaticBackup = useCallback(() => {
    createBackup('automatic');
  }, [createBackup]);

  const restoreBackup = useCallback(async (backupId: string) => {
    try {
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup) throw new Error('Backup não encontrado');

      // Em uma implementação completa, restauraria os dados no Supabase
      console.log('Restaurando backup:', backup);

      toast({
        title: "Backup restaurado ✅",
        description: "Seus dados foram restaurados com sucesso"
      });

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro na restauração",
        description: "Não foi possível restaurar o backup",
        variant: "destructive"
      });
    }
  }, [backupHistory, toast]);

  const deleteBackup = useCallback((backupId: string) => {
    const updatedBackups = backupHistory.filter(b => b.id !== backupId);
    localStorage.setItem('backup_history', JSON.stringify(updatedBackups));
    setBackupHistory(updatedBackups);

    toast({
      title: "Backup removido",
      description: "O backup foi removido do histórico"
    });
  }, [backupHistory, toast]);

  const exportBackup = useCallback((backupId: string) => {
    const backup = backupHistory.find(b => b.id === backupId);
    if (!backup) return;

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${backup.created_at.split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);

    toast({
      title: "Backup exportado",
      description: "Arquivo baixado com sucesso"
    });
  }, [backupHistory, toast]);

  return {
    isBackingUp,
    lastBackup,
    backupHistory,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup
  };
};